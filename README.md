**Built the Solar System with Three.js**

This project is an interactive 3D simulation of our solar system built with [Three.js](https://threejs.org/). It features orbiting planets, moons, asteroid belts, and nebulae, complete with camera controls and a real-time orbital speed control panel.

## 🧭 Features

- 3D rendering of planets and moons with realistic textures
- Orbit paths and animations using `requestAnimationFrame`
- Asteroid belt and surrounding starfield
- Camera controls via mouse with `OrbitControls`
- Control panel for Users to adjust orbital speed for each planet in real-time
- Responsive layout with pause/resume functionality

## 📁 Folder Structure

project-root/
│
├── /rocks
│ ├── Rock1.obj
│ ├── Rock2.obj
│ └── Rock3.obj
├── /src
│ ├── getAsteroidBelt.js
│ ├── getElipticLines.js
│ ├── getFresnelMat.js
│ ├── getNebula.js
│ ├── getPlanet.js
│ ├── getStarfield.js
│ └── getSun.js
├── /textures
│ ├── earth.png
│ ├── jupiter.png
│ └── mars.png
│ └── mercury.png
│ └── moon.png
│ └── neptune.png
│ └── saturn.png
│ └── uranus.png
│ └── venus.png
├── index.html
├── main.js

## 🚀 Getting Started

### 1. 📦 Prerequisites

Ensure you have a local web server. You can use:

- [VSCode Live Server]
- NPX stands for Node Package eXecute. It is simply an NPM package runner.
- Zero configuration needed.
- Supports custom ports: npx serve -l 3000
- Can serve any folder: npx serve ./dist

- npx serve to run
- npx: A tool that comes with Node.js. It lets you run packages without installing them globally.
- serve: A lightweight npm package (by Vercel) that acts as a static file server

### 2. 🧠 Technologies Used
Three.js – 3D rendering

JavaScript (ES6+)

GLSL shaders (Fresnel effect)

OBJ Loader for asteroids

### 3. 🐱‍🏍 ScreenShots
![Closer Look of Earth](https://github.com/user-attachments/assets/2806aa3e-e42a-4baa-a77e-ef8e08b8c7f1)
![Solar System](https://github.com/user-attachments/assets/42c2aa1f-9158-45a3-ba6f-3c6c1d0b7d43)

