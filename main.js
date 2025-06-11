// used requestAnimationFrame for Animation
import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { OBJLoader } from "jsm/loaders/OBJLoader.js";
import getSun from "./src/getSun.js";
import getNebula from "./src/getNebula.js";
import getStarfield from "./src/getStarfield.js";
import getPlanet from "./src/getPlanet.js";
import getAsteroidBelt from "./src/getAsteroidBelt.js";
import getElipticLines from "./src/getElipticLines.js";

const w = window.innerWidth;
const h = window.innerHeight;
const DISTANCE_SCALE = 1.5;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 3.5, 4.5);
// Makes the scene look smoother
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
//  append the renderer's DOM element to the body of the HTML document
document.body.appendChild(renderer.domElement);
// - OrbitControls is used to control the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // - enableDamping is used to smooth the camera movement
controls.dampingFactor = 0.03; // - dampingFactor is used to control the speed of the camera movement
const useAnimatedCamera = true; // - useAnimatedCamera is used to control the camera movement

// Animation state
let isPaused = false;
const pauseButton = document.getElementById('pauseButton');

function initScene(data) {
  const orbitingPlanets = [];
  const { objs } = data;
  const solarSystem = new THREE.Group(); // - Group is used to group the objects together
  solarSystem.userData.update = (t) => { // - update is used to update the position of the objects
    solarSystem.children.forEach((child) => {
      child.userData.update?.(t); // ?. - using existential operator to check if the object has a userData.update method
    });
  };
  const controlsContainer = document.createElement('div'); 
  controlsContainer.style.position = 'absolute';
  controlsContainer.style.top = '10px';
  controlsContainer.style.right = '1000px';
  controlsContainer.style.background = 'rgba(0,0,0,0.6)';
  controlsContainer.style.padding = '10px';
  controlsContainer.style.color = 'white';
  controlsContainer.style.fontFamily = 'sans-serif';
  controlsContainer.style.borderRadius = '8px';
  document.body.appendChild(controlsContainer);

  scene.add(solarSystem);
  // Adding Planets
  const sun = getSun();
  solarSystem.add(sun);

  const mercury = getPlanet({ size: 0.1, distance: 1.25 * DISTANCE_SCALE, img: 'mercury.png' });
  mercury.userData = { speed: 0.04, angle: 0, distance: 1.25 * DISTANCE_SCALE, name: 'Mercury' };
  solarSystem.add(mercury);
  orbitingPlanets.push(mercury);

  const venus = getPlanet({ size: 0.2, distance: 1.65 * DISTANCE_SCALE, img: 'venus.png' });
  venus.userData = { speed: 0.015, angle: 0, distance: 1.65 * DISTANCE_SCALE, name: 'Venus' };
  solarSystem.add(venus);
  orbitingPlanets.push(venus);
  
  const moon = getPlanet({ size: 0.075, distance: 0.4, img: 'moon.png' });
  const earth = getPlanet({ children: [moon], size: 0.225, distance: 2.0 * DISTANCE_SCALE, img: 'earth.png' });
  earth.userData = { speed: 0.01, angle: 0, distance: 2.0 * DISTANCE_SCALE, name: 'Earth' };
  solarSystem.add(earth);
  orbitingPlanets.push(earth);

  const mars = getPlanet({ size: 0.15, distance: 2.25 * DISTANCE_SCALE, img: 'mars.png' });
  mars.userData = { speed: 0.008, angle: 0, distance: 2.25 * DISTANCE_SCALE, name: 'Mars' };
  solarSystem.add(mars);
  orbitingPlanets.push(mars);

  const asteroidBelt = getAsteroidBelt(objs); 
  solarSystem.add(asteroidBelt);

  const jupiter = getPlanet({ size: 0.4, distance: 3.0 * DISTANCE_SCALE, img: 'jupiter.png' });
  jupiter.userData = { speed: 0.002, angle: 0, distance: 3.0 * DISTANCE_SCALE, name: 'Jupiter' };
  solarSystem.add(jupiter);
  orbitingPlanets.push(jupiter);

  // - TorusGeometry is used to create a torus ring for Saturn
  const sRingGeo = new THREE.TorusGeometry(0.6, 0.15, 8, 64);
  const sRingMat = new THREE.MeshStandardMaterial();
  const saturnRing = new THREE.Mesh(sRingGeo, sRingMat);
  saturnRing.scale.z = 0.1;
  saturnRing.rotation.x = Math.PI * 0.5;
  const saturn = getPlanet({ children: [saturnRing], size: 0.35, distance: 3.25 * DISTANCE_SCALE, img: 'saturn.png' });
  saturn.userData = { speed: 0.0009, angle: 0, distance: 3.25 * DISTANCE_SCALE, name: 'Saturn' };
  solarSystem.add(saturn);
  orbitingPlanets.push(saturn);

  const uRingGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 64);
  const uRingMat = new THREE.MeshStandardMaterial();
  const uranusRing = new THREE.Mesh(uRingGeo, uRingMat);
  uranusRing.scale.z = 0.1;
  const uranus = getPlanet({ children: [uranusRing], size: 0.3, distance: 3.75 * DISTANCE_SCALE, img: 'uranus.png' });
  uranus.userData = { speed: 0.0004, angle: 0, distance: 3.75 * DISTANCE_SCALE, name: 'Uranus' };
  solarSystem.add(uranus);
  orbitingPlanets.push(uranus);

  const neptune = getPlanet({ size: 0.3, distance: 4.25 * DISTANCE_SCALE, img: 'neptune.png' });
  neptune.userData = { speed: 0.0001, angle: 0, distance: 4.25 * DISTANCE_SCALE, name: 'Neptune' };
  solarSystem.add(neptune); 
  orbitingPlanets.push(neptune);
  // - getElipticLines is used to create a line that follows an elliptical path
  const elipticLines = getElipticLines();
  solarSystem.add(elipticLines);
  // Adding Stars
  const starfield = getStarfield({ numStars: 2500, size: 0.35 });
  scene.add(starfield);

  const dirLight = new THREE.DirectionalLight(0x0099ff, 1); // - DirectionalLight is a light that simulates a light source that is infinitely far away
  dirLight.position.set(0, 1, 0); // - position is used to set the position of the light
  scene.add(dirLight); // - scene.add is used to add the light to the scene
  // nebula is a cloud of gas and dust in space
  const nebula = getNebula({
    hue: 0.6,
    numSprites: 10,
    opacity: 0.2,
    radius: 40,
    size: 50,
    z: -30.5,
  });
  scene.add(nebula);

  const anotherNebula = getNebula({
    hue: 0.0,
    numSprites: 10,
    opacity: 0.2,
    radius: 40,
    size: 50,
    z: 30.5,
  });
  scene.add(anotherNebula);
  // - isPaused acts as a flag to stop or resume the animation loop
  const cameraDistance = 6;
  function animate(t = 0) {
    orbitingPlanets.forEach(planet => {
      planet.userData.angle += planet.userData.speed;
      planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
      planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
    });
    if (!isPaused) {
      const time = t * 0.0002; // - t is the timestamp parameter that requestAnimationFrame automatically passes to the animate function
      solarSystem.userData.update(time);
      orbitingPlanets.forEach(planet => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
      });
      renderer.render(scene, camera);
      // - useAnimatedCamera is a flag to animate the camera or not
      if (useAnimatedCamera) {
        camera.position.x = Math.cos(time * 0.75) * cameraDistance; //Circular motion using cosine function
        camera.position.y = Math.cos(time * 0.75); //Up and down motion using cosine
        camera.position.z = Math.sin(time * 0.75) * cameraDistance; //Circular motion using sine function
        camera.lookAt(0, 0, 0); // - lookAt is used to set the target of the camera
      } else {
        controls.update(); // - update is used to update the camera
      }
    }
  
    requestAnimationFrame(animate);
  }
  orbitingPlanets.forEach(planet => {
    const container = document.createElement('div');
    container.style.marginBottom = '10px';
  
    const label = document.createElement('label');
    label.textContent = `${planet.userData.name} Speed: `;
    label.style.marginRight = '5px';
  
    const input = document.createElement('input');
    input.type = 'range';
    input.min = '0.0001';
    input.max = '0.05';
    input.step = '0.0001';
    input.value = planet.userData.speed;
  
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = input.value;
    // The speed control directly affects the planet's orbital motion through this code
    input.addEventListener('input', () => {
      const newSpeed = parseFloat(input.value);
      planet.userData.speed = newSpeed;
      valueDisplay.textContent = newSpeed.toFixed(4);
    });
  
    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(valueDisplay);
    controlsContainer.appendChild(container);
  });

  animate();
}

const sceneData = { // - sceneData is an object that contains the rock objects
  objs: [],
};
const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);
const loader = new OBJLoader(manager);
const objs = ['Rock1', 'Rock2', 'Rock3']; // - objs is an array of the rock objects I have copied Rocks from a Git Hub repo
objs.forEach((name) => {
  let path = `./rocks/${name}.obj`;
  loader.load(path, (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        sceneData.objs.push(child);
      }
    });
  });
});

// Add pause button event listener
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
});

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);



