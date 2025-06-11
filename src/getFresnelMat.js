// Fresnel Mat is a shader that creates a Fresnel effect on the object
// Fresnel lenses are thin, flat lenses with concentric rings or stepped surfaces that act like a series of prisms, focusing light onto a specific point
// The Blue and Red Colors are used to create the Fresnel effect
import * as THREE from "three";

function getFresnelMat({rimHex = 0x0088ff, facingHex = 0x000000} = {}) {
  // - uniforms are used to pass data to the shader
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) }, // - rimHex is used to set the color of the rim
    color2: { value: new THREE.Color(facingHex) }, // - facingHex is used to set the color of the facing
    fresnelBias: { value: 0.2 }, // - fresnelBias is used to set the size of the rim
    fresnelScale: { value: 1.5 }, // - fresnelScale is used to set the scale of the rim
    fresnelPower: { value: 4.0 }, // - fresnelPower is used to set the power of the rim
  };
  const vs = `
  uniform float fresnelBias; // - fresnelBias is used to set the size of the rim
  uniform float fresnelScale; // - fresnelScale is used to set the scale of the rim
  uniform float fresnelPower; // - fresnelPower is used to set the power of the rim
  
  varying float vReflectionFactor;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 ); // - modelViewMatrix is used to transform the position of the object from model space to view space
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 ); // - modelMatrix is used to transform the position of the object from model space to world space
  
    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal ); // - mat3 is used to transform the normal of the object from model space to world space
  
    vec3 I = worldPosition.xyz - cameraPosition; // - cameraPosition is used to get the position of the camera
  
    vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower ); // - fresnelPower is used to control the sharpness of the reflection
  
    gl_Position = projectionMatrix * mvPosition; // - projectionMatrix is used to transform the position of the object from view space to clip space
  }
  `;
  const fs = `
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying float vReflectionFactor;
  
  void main() {
    float f = clamp( vReflectionFactor, 0.0, 1.0 );
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
  }
  `;
  const fresnelMat = new THREE.ShaderMaterial({ //Creates a shader material
    uniforms: uniforms, //Sets the uniforms of the material
    vertexShader: vs, //Sets the vertex shader of the material
    fragmentShader: fs, //Sets the fragment shader of the material
    transparent: true, //Makes the material transparent
    blending: THREE.AdditiveBlending, //Sets the blending mode of the material
  });
  return fresnelMat;
}
export { getFresnelMat };