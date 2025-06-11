// - getSun is a function that creates a sun
import * as THREE from 'three';
import { getFresnelMat } from "./getFresnelMat.js";
import { ImprovedNoise } from 'jsm/math/ImprovedNoise.js'; // noise for the corona
// sun
// sun's corona is its outermost layer of atmosphere, a hot, wispy layer of plasma that extends millions of kilometers into space
function getCorona() {
    const radius = 0.9;
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff99,
        side: THREE.BackSide,
    });
    const geo = new THREE.IcosahedronGeometry(radius, 6);
    const mesh = new THREE.Mesh(geo, material);
    const noise = new ImprovedNoise(); 

    let v3 = new THREE.Vector3();   
    let p = new THREE.Vector3(); 
    let pos = geo.attributes.position;
    pos.usage = THREE.DynamicDrawUsage;
    const len = pos.count;
    // update the corona
    function update(t) {
        for (let i = 0; i < len; i += 1) {
            p.fromBufferAttribute(pos, i).normalize();
            v3.copy(p).multiplyScalar(3.0);
            // improving noise by adding cos and sin to the noise
            let ns = noise.noise(v3.x + Math.cos(t), v3.y + Math.sin(t), v3.z + t); 
            v3.copy(p)
                .setLength(radius)
                .addScaledVector(p, ns * 0.4);
            pos.setXYZ(i, v3.x, v3.y, v3.z); //Sets the position of the corona
        }
        pos.needsUpdate = true;
    }
    mesh.userData.update = update;
    return mesh;
}
function getSun() {
    // MeshStandardMaterial is used to create a material for the sun
    const sunMat = new THREE.MeshStandardMaterial({
        emissive: 0xff0000, // - red color for the sun
    });
    const geo = new THREE.IcosahedronGeometry(1, 6); // - IcosahedronGeometry is used to create a 3D shape for the sun
    const sun = new THREE.Mesh(geo, sunMat); // Combines the geometry and material to create the final sun object

    const sunRimMat = getFresnelMat({ rimHex: 0xffff99, facingHex: 0x000000 }); // - getFresnelMat is used to create a material for the sun's rim
    const rimMesh = new THREE.Mesh(geo, sunRimMat);
    rimMesh.scale.setScalar(1.01);
    sun.add(rimMesh);

    const coronaMesh = getCorona();
    sun.add(coronaMesh);

    const sunLight = new THREE.PointLight(0xffff99, 10);
    sun.add(sunLight);
    sun.userData.update = (t) => {
        sun.rotation.y = t;
        coronaMesh.userData.update(t);
    };
    return sun;
}
export default getSun;