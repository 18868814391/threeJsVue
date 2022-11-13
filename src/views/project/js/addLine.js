import * as THREE from "three";
class CustomSinCurve extends THREE.Curve {
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = t * 3 ;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = t * 3;
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}
let CreateLine=function(name,callBack){
  this.name=name
  this.callBack=callBack
  this.lineMesh=null
  this.texture=null
}
CreateLine.prototype.normalLine=function(){
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const geometry = new THREE.BufferGeometry()
  const points = [];
  points.push(new THREE.Vector3(20, 20, 0));
  points.push(new THREE.Vector3(20, -20, 0));
  points.push(new THREE.Vector3(-20, -20, 0));
  points.push(new THREE.Vector3(-20, 20, 0));
  // 绑定顶点到空几何体
  geometry.setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line  
}
CreateLine.prototype.pathLine=function(pointArr=[]){
  const self=this
  const curve = new CustomSinCurve(10);
  const points = curve.getPoints(100);
  const positions = new Float32Array(100 * 3);
  points.forEach((point, index) => {
    positions[index * 3 + 0] = point.x;
    positions[index * 3 + 1] = point.y;
    positions[index * 3 + 2] = point.z;
  });
  let i = 0;
  this.texture = new THREE.TextureLoader().load( 
    require("../../../assets/pathImg.png")
  );
  this.texture.wrapS = THREE.RepeatWrapping;
  this.texture.wrapT = THREE.RepeatWrapping;
  this.texture.repeat.x = 10;
  this.texture.repeat.y = 1;
  let Parr=[]
  pointArr.forEach((v)=>{
    Parr.push(new THREE.Vector3(v[0],v[1],v[2]))
  })
  let path = new THREE.CatmullRomCurve3(Parr);

  const tubeGeometry = new THREE.TubeGeometry(path,20,0.75,8,false);
  // new CustomSinCurve(12)

  const tubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x156289,
    emissive: 0x156289,
    map: self.texture,
    side: THREE.DoubleSide
  });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  this.lineMesh=tube
  return this.lineMesh
}
CreateLine.prototype.loopLine=function(){
  if (this.texture) {
    this.texture.offset.x -= 0.01;
  }  
}
function renderLoop() {
  renderer.render(scene, camera);

  requestAnimationFrame(renderLoop);
}
export{
  CreateLine
}