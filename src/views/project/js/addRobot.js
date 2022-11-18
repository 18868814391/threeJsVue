import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let MakeRobot=function(name,callBack){
  this.model=null
  this.mixer=null
  this.actions={}
  this.animations=[]
  this.robotNoewAction=null
  this.timeObj=null
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
      self.model.scale.set(3.5, 3.5, 3.5);
      
      const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
      const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];
      self.mixer = new THREE.AnimationMixer( self.model );
      self.mixer.addEventListener( 'finished', function( ) { 
        console.log('finished')
        self.actionDo('Idle')
      });
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
      //https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_morph.html
      resolve([self.model,self.mixer,self.actions])
    })    
  })
}
MakeRobot.prototype.actionDo=function(action){
  if(this.robotNoewAction){
    this.robotNoewAction.stop();
  }
  this.robotNoewAction=this.actions[action]
  this.robotNoewAction.play()
}
MakeRobot.prototype.isRobotPart=function(name){
  const robotPart=['Head','Torso','HandR','LowerLeg','Arm','Hand']
  let flag=false
  robotPart.forEach((v)=>{
    if(name.indexOf(v)!=-1){
      flag=true
    }
  })
  return flag
}
MakeRobot.prototype.goWhere=function(points_arr=[[0,0,20],[0,0,0],[-20,0,0],[-20,0,20]],turn_arr=['-z','-x','z']){
  const self=this
  let pinh=100 //点数
  let len=turn_arr.length // 节点数
  let are=pinh/len
  let pping=[]
  for(let i=0;i<len;i++){
    pping.push(i*are.toFixed(0)*1)
  }
  console.log('ppingpping',pping)
  let Vector3s=[]
  points_arr.forEach((v)=>{
    Vector3s.push(new THREE.Vector3(v[0], v[1], v[2]))
  })
  let curve = new THREE.CatmullRomCurve3(Vector3s);//通过类CatmullRomCurve3创建一个3D样条曲线
  let points = curve.getPoints(pinh);// 样条曲线均匀分割100分，返回51个顶点坐标
  console.log('points', points);//控制台查看返回的顶点坐标
  let index=0
  this.timeObj=setInterval(()=>{
    index++
    let forward=pping.indexOf(index)
    if(forward!=-1){
      console.log(index)
      if(forward==''){
        return false
      }
      let dir=turn_arr[forward]
      const axis = new THREE.Vector3(0, 1, 0); //向量axis
      self.model.rotateOnAxis(axis, Math.PI / 2); //绕axis轴旋转π/100
    }
    
    if(points[index]&&points[index].x){
      self.model.position.set(points[index].x,points[index].y,points[index].z)
    }else{
      self.actionDo('Idle')
      clearInterval(self.timeObj)
    }
  },40)
}
MakeRobot.prototype.goWhere_line=function(points_arr=[[0,0,20],[0,0,0],[-20,0,0],[-20,0,20]]){
  const self=this
  let Vector3s=[]
  points_arr.forEach((v)=>{
    Vector3s.push(new THREE.Vector3(v[0], v[1], v[2]))
  })
  let curve = new THREE.CatmullRomCurve3(Vector3s);//通过类CatmullRomCurve3创建一个3D样条曲线
  let points = curve.getPoints(100);// 样条曲线均匀分割100分，返回51个顶点坐标
  console.log('points', points);//控制台查看返回的顶点坐标
  let arr = [] // 声明一个数组用于存储时间序列
  for (let i = 0; i < 101; i++) {
    arr.push(i)
  }
  let times = new Float32Array(arr);// 生成一个时间序列
  let posArr = []
  points.forEach(elem => {
    posArr.push(elem.x, elem.y, elem.z)
  });
  let values = new Float32Array(posArr);// 创建一个和时间序列相对应的位置坐标系列
  //  创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
  let posTrack = new THREE.KeyframeTrack('.position', times, values);
  let duration = 101;
  let clip = new THREE.AnimationClip("my_default", duration, [posTrack]);
  let action = self.mixer.clipAction(clip);
  self.actions['my_default'] = action;
  this.actionDo('my_default')
}
export{
  MakeRobot
}