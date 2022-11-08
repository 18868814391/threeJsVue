import * as THREE from "three";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getRotationMatrix } from './rotationMatrix'
import { MakeSD } from './serverDevice'
// import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";
let MakeCabinet=function(name,callBack){
  const self=this
  this.c_name=name
  this.c_callBack=callBack

  this.deg=0.031
  this.flag=0
  this.openStatus=0
  this.inChange=false
  this.timeObj=null 

  this.cabinet = new THREE.Group();
  this.doors = new THREE.Group();
  this._material=new THREE.MeshPhongMaterial({color: 0xaaaaaa})
  this._material2=new THREE.MeshStandardMaterial({
    roughness: 0.75,
    metalness: 1
})

this.b_board=new THREE.BoxBufferGeometry(20, 1, 20);
this.b_Mesh=new THREE.Mesh(self.b_board, self._material);

this.t_Mesh=new THREE.Mesh(new THREE.BoxBufferGeometry(20, 1, 20), self._material);
this.t_Mesh.position.set(0,40,0)

this.r_board=new THREE.BoxBufferGeometry(20, 40, 1);
this.r_Mesh=new THREE.Mesh(self.r_board, self._material);
this.r_Mesh.position.set(0,20,-10)

this.l_board=new THREE.BoxBufferGeometry(1, 40, 20);
this.l_Mesh=new THREE.Mesh(self.l_board, self._material);
this.f_Mesh=new THREE.Mesh(new THREE.BoxBufferGeometry(1, 40, 20), self._material);
this.l_Mesh.position.set(-10,20,0)
this.f_Mesh.position.set(10,20,0)
  
this.meshArr=[this.b_Mesh,this.r_Mesh,this.t_Mesh,this.l_Mesh,this.f_Mesh]
this.geos = []
this.meshArr.forEach((mesh)=>{
    mesh.updateMatrix() // 更新投影矩阵，不更新各mesh位置会不正确
    // 更新后的矩阵，重新转换为几何体，此时，几何体位置才正确
    const newGeometry = mesh.geometry.applyMatrix4(mesh.matrix)
    this.geos.push(newGeometry)
  })
  this.bufferGeometry = BufferGeometryUtils.mergeBufferGeometries(self.geos)
  this.singleMergeMesh=new THREE.Mesh(self.bufferGeometry, self._material)
  this.door=new THREE.Mesh(new THREE.BoxBufferGeometry(20, 40, 1), self._material2);
  this.door.position.set(0,20,10)
  this.doorHand=new THREE.Mesh(new THREE.BoxBufferGeometry(2, 4, 1), self._material2);
  this.doorHand.position.set(-7,20,11)
  this.door.name=this.c_name
  this.doorHand.name=this.c_name
  this.doors.add(self.door)
  this.doors.add(self.doorHand)
  this.cabinet.add(self.singleMergeMesh,self.doors)
  this.addSD()
}
MakeCabinet.prototype.giveCabinet = function () {
  return this.cabinet
};
MakeCabinet.prototype.switchDoor = function () {
  const self=this
  if(self.inChange){
    return false
  }
  let axis=new THREE.Vector3(0, 1, 0)
  self.timeObj=setInterval(() => {
      if(this.flag<(Math.PI / 8)&&this.openStatus===0){
        this.inChange=true
        this.deg=0.031
        this.flag=this.flag+0.0065
      }
      if(this.flag>=(Math.PI / 8)&&this.openStatus===0){
        this.openStatus=1
        this.deg=-0.031  
        this.inChange=false
        clearInterval(self.timeObj)
        return false
      }
      if(this.flag>=0.0065&&this.openStatus===1){
        this.deg=-0.031  
        this.flag=this.flag-0.0065
        this.inChange=true
      }
      if(this.flag<0.0065&&this.openStatus===1){
        this.openStatus=0
        this.deg=0.031  
        this.inChange=false
        clearInterval(self.timeObj)
        return false
      }
      let ddd=getRotationMatrix({x:10,y:0,z:10},axis,self.deg)
      let matrix = new THREE.Matrix4();
      ddd.forEach((v,i)=>{
        matrix.elements[i]=ddd[i]
      })
      this.doors.applyMatrix4(matrix);  
      this.c_callBack()  
    }, 15);  
};
MakeCabinet.prototype.addSD = function () {
  let sd=MakeSD()
  sd.position.set(0,20,0)
  this.cabinet.add(sd)
};
export {
  MakeCabinet
}