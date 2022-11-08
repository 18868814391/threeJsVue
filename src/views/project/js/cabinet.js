import * as THREE from "three";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getRotationMatrix } from './rotationMatrix'
// import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";
  let cabinet = new THREE.Group();
  let doors = new THREE.Group();
  let _material=new THREE.MeshPhongMaterial({color: 0xaaaaaa})
  let _material2=new THREE.MeshStandardMaterial({
    roughness: 0.75,
    metalness: 1
})

  let b_board=new THREE.BoxBufferGeometry(20, 1, 20);
  let b_Mesh=new THREE.Mesh(b_board, _material);

  let t_Mesh=new THREE.Mesh(new THREE.BoxBufferGeometry(20, 1, 20), _material);
  t_Mesh.position.set(0,40,0)

  let r_board=new THREE.BoxBufferGeometry(20, 40, 1);
  let r_Mesh=new THREE.Mesh(r_board, _material);
  r_Mesh.position.set(0,20,-10)

  let l_board=new THREE.BoxBufferGeometry(1, 40, 20);
  let l_Mesh=new THREE.Mesh(l_board, _material);
  let f_Mesh=new THREE.Mesh(new THREE.BoxBufferGeometry(1, 40, 20), _material);
  l_Mesh.position.set(-10,20,0)
  f_Mesh.position.set(10,20,0)
  
  let meshArr=[b_Mesh,r_Mesh,t_Mesh,l_Mesh,f_Mesh]
  let geos = []
  meshArr.forEach((mesh)=>{
    mesh.updateMatrix() // 更新投影矩阵，不更新各mesh位置会不正确
    // 更新后的矩阵，重新转换为几何体，此时，几何体位置才正确
    const newGeometry = mesh.geometry.applyMatrix4(mesh.matrix)
    geos.push(newGeometry)
  })
  const bufferGeometry = BufferGeometryUtils.mergeBufferGeometries(geos)
  let singleMergeMesh=new THREE.Mesh(bufferGeometry, _material)
  let door=new THREE.Mesh(new THREE.BoxBufferGeometry(20, 40, 1), _material2);
  door.position.set(0,20,10)
  let doorHand=new THREE.Mesh(new THREE.BoxBufferGeometry(2, 4, 1), _material2);
  doorHand.position.set(-7,20,11)
  door.name='Iamdoor'
  doorHand.name='Iamdoor'
  doors.add(door)
  doors.add(doorHand)
  cabinet.add(singleMergeMesh,doors)
function cabinetAdd(name) {
  return cabinet
}
let deg=0.031
let flag=0
let openStatus=0
let inChange=false
let timeObj=null
function openDoor(callBack){
  if(inChange){
    return false
  }
  let axis=new THREE.Vector3(0, 1, 0)
    timeObj=setInterval(() => {
      if(flag<(Math.PI / 8)&&openStatus===0){
        inChange=true
        deg=0.031
        flag=flag+0.0065
      }
      if(flag>=(Math.PI / 8)&&openStatus===0){
        openStatus=1
        deg=-0.031  
        inChange=false
        clearInterval(timeObj)
        return false
      }
      if(flag>=0.0065&&openStatus===1){
        deg=-0.031  
        flag=flag-0.0065
        inChange=true
      }
      if(flag<0.0065&&openStatus===1){
        openStatus=0
        deg=0.031  
        inChange=false
        clearInterval(timeObj)
        return false
      }
      let ddd=getRotationMatrix({x:10,y:0,z:10},axis,deg)
      let matrix = new THREE.Matrix4();
      ddd.forEach((v,i)=>{
        matrix.elements[i]=ddd[i]
      })
      doors.applyMatrix4(matrix);  
      callBack()  
    }, 25);
}
export {
  cabinetAdd,openDoor
}