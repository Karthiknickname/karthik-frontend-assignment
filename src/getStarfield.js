// - getStarfield is a function that creates a starfield
// - numStars is the number of stars
// - size is the size of the stars
import * as THREE from "three";

export default function getStarfield({ numStars = 500, size = 0.2 } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    // calculate the position of the stars on the sphere 
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta); 
    let z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6, // radius * 0.02 + 0.5
      minDist: radius,
    };
  }
  const verts = [];
  const colors = [];
  const positions = [];
  let col;
  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z); // position of the stars
    colors.push(col.r, col.g, col.b); // color of the stars
  }
  const geo = new THREE.BufferGeometry(); // geometry of the stars
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3)); // position of the stars
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); // color of the stars
  const mat = new THREE.PointsMaterial({
    size: 0.50,       // size of the stars
    vertexColors: true, 
    map: new THREE.TextureLoader().load( // - TextureLoader is used to load the texture for the stars
      "./src/circle.png"
    ),
  });
  const points = new THREE.Points(geo, mat);
  return points;
}