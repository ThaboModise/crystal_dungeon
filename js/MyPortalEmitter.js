import * as THREE from 'three';


// Create a custom particle class
class Portal extends THREE.Sprite {
  constructor(texture, color, lerpToColor = null, ) {
    const material = new THREE.SpriteMaterial({ map: texture, alphaTest: 0.0001, /*alphaMap: texture,*/ opacity: 0.1 , transparent: true});
   
    material.color.set(color);
    const randScale = Math.random() * 2.5;
    const scale = /*randScale > 1.7 ? randScale:*/ 3.8;
    super(material);

    this.matrixAutoUpdate = false;
    this.geometry.computeBoundingBox();
    this.box3 = new THREE.Box3().setFromObject(this);
    this.position;
    this.clock = new THREE.Clock();
    this.startTime = this.clock.getElapsedTime();
    this.lerpTime;
    this.currentTime;
    this.scale.set(scale, scale, scale);
    this.randRotation = Math.PI * (Math.random() * 2);
    this.material.rotation = this.randRotation;
    this.dirVector = new THREE.Vector3();
    this.velocity; /*= this.position.clone().sub(colliderCube.position).normalize();*/
    this.material.blending = THREE.AdditiveBlending;
    this.lerpToColor = lerpToColor;
    this.color = this.material.color;

    this.offset = 0;
  }

  update() {
    
    this.lerpTime = this.clock.getElapsedTime();
    //this.position.sub(this.dirVector.copy(this.velocity).multiplyScalar(0.1));

    this.updateMatrix();
    this.updateMatrixWorld();

    //this.box3.setFromCenterAndSize(this.position, new THREE.Vector3());
    //this.box3.setFromObject(this);

    this.scale.multiplyScalar(1.019);
    this.offset += 0.01;
    this.material.rotation += 0.001; /*this.randRotation * 0.8;*/
    if(this.lerpToColor !== null)this.material.color.lerpColors(this.color ,new THREE.Color().set(this.lerpToColor), Math.abs(Math.sin(this.lerpTime)));

    this.material.opacity -= 0.0055;
  }
}

// Create a particle emitter class
class PortalEmitter {
  constructor() {
    this.particles = [];
    this.group = new THREE.Group();
    this.timer = 0;
    this.spawnFrequency = 0;
    this.firstParticleSpawned = false;
    this.clock = new THREE.Clock();
    this.contact = false;
    //this.group.position.x = ;
    //scene.add(this.group);
    
  }

  emitParticle(texture, color, lerpToColor) {
      const delta = this.clock.getDelta();
      this.timer += delta;

      const particle = new Portal(texture, color, lerpToColor);
      particle.currentTime = particle.clock.getElapsedTime();
      this.group.add(particle);
      this.particles.push(particle);
      //particle.velocity = particle.getWorldPosition(new THREE.Vector3()).sub(colliderPos).normalize();
      this.timer -= delta;
      
  }
  

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.currentTime = particle.clock.getElapsedTime();
      if((particle.currentTime - particle.startTime) > 5){
        //console.log("group:", this.group)
        particle.material.dispose();
        this.group.remove(particle);
      }
      particle.update();
    
    });
  }
}

export { PortalEmitter };