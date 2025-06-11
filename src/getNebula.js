// - Nebula is a cloud of gas and dust in space
import * as THREE from "three";

const loader = new THREE.TextureLoader(); //Creates a texture loader

function getSprite({ color, opacity, pos, size }) { //Creates a sprite
  const spriteMat = new THREE.SpriteMaterial({ //Creates a sprite material
    color,
    map: loader.load("./src/rad-grad.png"),
    transparent: true,
    opacity,
  });
  spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1); //Offsets the color of the sprite
  const sprite = new THREE.Sprite(spriteMat); //Creates a sprite
  sprite.position.set(pos.x, -pos.y, pos.z); //Sets the position of the sprite
  size += Math.random() - 0.5; //Sets the size of the sprite
  sprite.scale.set(size, size, size);
  sprite.material.rotation = 0;
  return sprite;
}

function getNebula({
  hue = 0.0,
  numSprites = 10,
  opacity = 1,
  radius = 1,
  sat = 0.5,
  size = 1,
  z = 0,
}) {
  const layerGroup = new THREE.Group();
  for (let i = 0; i < numSprites; i += 1) {
    let angle = (i / numSprites) * Math.PI * 2; //Calculates the angle of the sprite
    const pos = new THREE.Vector3(
      Math.cos(angle) * Math.random() * radius, //Calculates the x-coordinate of the sprite
      Math.sin(angle) * Math.random() * radius, //Calculates the y-coordinate of the sprite
      z + Math.random() //Calculates the z-coordinate of the sprite
    );
    const length = new THREE.Vector3(pos.x, pos.y, 0).length();

    let color = new THREE.Color().setHSL(hue, 1, sat);
    const sprite = getSprite({ color, opacity, pos, size });
    layerGroup.add(sprite);
  }
  return layerGroup;
}
export default getNebula;