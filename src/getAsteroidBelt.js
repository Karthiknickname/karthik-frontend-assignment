// Asteroid Belt is a collection of asteroids in space
// Asteroids are distributed in a circular pattern around the sun
import * as THREE from 'three';

function getInstanced({ distance, mesh, size }) {
    const numObjs = 25 + Math.floor(Math.random() * 25); //Calculates the number of asteroids
    const instaMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, numObjs); //Creates an instanced mesh
    const matrix = new THREE.Matrix4(); //Creates a matrix
    for (let i = 0; i < numObjs; i += 1) {
        const radius = distance + Math.random() * 0.1 - 0.05;  //Calculates the radius of the asteroid
        const angle = Math.random() * Math.PI * 2; //Calculates the angle of the asteroid
        const x = Math.cos(angle) * radius; //Calculates the x-coordinate of the asteroid
        const z = Math.sin(angle) * radius; //Calculates the z-coordinate of the asteroid
        const position = new THREE.Vector3(x, 0, z);
        const quaternion = new THREE.Quaternion(); //Gives each asteroid a random rotation in 3D space
        quaternion.random();
        const currentSize = size + Math.random() * 0.05 - 0.025;
        const scale = new THREE.Vector3().setScalar(currentSize); //Scales the asteroid to a random size
        matrix.compose(position, quaternion, scale); //Combines position, rotation, and scale into a single transformation matrix
        instaMesh.setMatrixAt(i, matrix); //Applies the transformation to each asteroid instance
    }
    instaMesh.userData = {
        update(t) {
            const rate = -0.0002 * (index * 0.1); //Calculates the rate of rotation of the asteroid
            instaMesh.rotation.z = t * rate; //Rotates the asteroid
        }
    };
    return instaMesh; 
}
function getAsteroidBelt(objs) { //Creates a group of asteroids
    const group = new THREE.Group(); 
    objs.forEach((obj) => { //Loops through each object in the array
        const asteroids = getInstanced({ distance: 2.5, mesh: obj, size: 0.035 }); //Creates an instanced mesh for each asteroid
        group.add(asteroids); //Adds the instanced mesh to the group
    });
    return group;
}

export default getAsteroidBelt;