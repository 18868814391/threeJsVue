import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let MakeRobot=function(name,callBack){
  this.model=null
  this.mixer=null
  this.actions={}
  this.animations=[]
}
MakeRobot.prototype.loadGLB=function(){
  return new Promise((resolve, reject)=>{
    let env=process.env.NODE_ENV
    const loader = new GLTFLoader();
    const self=this
    loader.load( `${env=='development'?'':'/threeJs'}/module/RobotExpressive.glb`, function ( gltf ) {
      console.log('gltf',gltf)
      self.animations=gltf.animations
      self.model = gltf.scene; 
      self.model.position.set(0, 0, 0);
      self.model.rotation.y=Math.PI 
      self.model.position.set(0, 0,25);
      self.model.scale.set(5, 5, 5);
      
      const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
      const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];
      self.mixer = new THREE.AnimationMixer( self.model );
      self.actions = {};
      for ( let i = 0; i < self.animations.length; i ++ ) {
        const clip = self.animations[ i ];
        const action = self.mixer.clipAction( clip );
        self.actions[ clip.name ] = action;
        if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {
          action.clampWhenFinished = true;
          action.loop = THREE.LoopOnce;
        }
      }
      console.log('self.actions',self.actions)
      //https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_morph.html
      // self.actions.Walking.play();
      setTimeout(()=>{
        console.log(5555555)
        self.mixer.clipAction(self.animations[0]).play();
        self.actions.Walking.play();
      },5000)
      resolve(self.model)
    })    
  })
}
MakeRobot.prototype.initAllAnimi=function(model, animations){
  const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
  const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];
  this.mixer = new THREE.AnimationMixer( model );
  this.actions = {};
  for ( let i = 0; i < animations.length; i ++ ) {
    const clip = animations[ i ];
    const action = mixer.clipAction( clip );
    this.actions[ clip.name ] = action;
    if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }
  console.log('this.actions',this.actions)
}
MakeRobot.prototype.initAction=function(){
  
}
MakeRobot.prototype.goWalk=function(){

}
export{
  MakeRobot
}