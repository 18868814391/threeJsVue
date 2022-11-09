import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
let MakeDesk=function(name,callBack){
  this.obj3D=new THREE.Group();
}
MakeDesk.prototype.loadGLB=function(){
  return new Promise((resolve, reject)=>{
    let env=process.env.NODE_ENV
    let model = "";
    const loader = new GLTFLoader();
    const self=this
    loader.load( `${env=='development'?'':'/threeJs'}/module/datacenter.glb`, function ( gltf ) {
      model = gltf.scene; 
      const list = [...model.children]; 
      model.position.set(0, 0, 0);
      let chair=list[1].children[0].children[0].children[21]
      let desk=list[1].children[0].children[0].children[22]
      let screen=list[1].children[0].children[0].children[23]
      console.log('obj3D',self.obj3D)
      self.obj3D.add(desk)
      self.obj3D.add(screen)
      self.obj3D.rotation.y=Math.PI 
      self.obj3D.position.set(0, 15,-65);
      self.obj3D.scale.set(15, 15, 15);
    },resolve(self.obj3D))    
  })
}
export{
  MakeDesk
}