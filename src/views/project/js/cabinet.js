import * as THREE from "three";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getRotationMatrix } from './rotationMatrix'
// import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";
function cabinetAdd(callBack) {
  let cabinet = new THREE.Group();
  let doors = new THREE.Group();
  let _material=new THREE.MeshPhongMaterial({color: 0xaaaaaa})
  let _material2=new THREE.MeshStandardMaterial({
    roughness: 0.5,
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
    console.log('mesh.matrixmesh.matrix',mesh.matrix)
    geos.push(newGeometry)
  })
  const bufferGeometry = BufferGeometryUtils.mergeBufferGeometries(geos)
  let singleMergeMesh=new THREE.Mesh(bufferGeometry, _material)

  let door=new THREE.Mesh(new THREE.BoxBufferGeometry(20, 40, 1), _material2);
  door.position.set(0,20,10)
  let doorHand=new THREE.Mesh(new THREE.BoxBufferGeometry(2, 4, 1), _material2);
  doorHand.position.set(-7,20,11)
  doors.add(door)
  doors.add(doorHand)
  // doors.position.set(0,0,0)
  // doors.rotation.y=Math.PI/4
  // doors.rotateOnAxis(axis,Math.PI/4)
  let axis=new THREE.Vector3(0, 1, 0)
  let ddd=getRotationMatrix({x:5,y:0,z:5},axis,-Math.PI / 4)
  let matrix = new THREE.Matrix4();
  matrix.set(ddd[0],ddd[1],ddd[2],ddd[3],ddd[4],ddd[5],ddd[6],ddd[7],ddd[8],ddd[9],ddd[10],ddd[11],ddd[12],ddd[13],ddd[14],ddd[15])
  console.log('getRotationMatrix',matrix)
  console.log('doors.matrix',doors.matrix)
  doors.applyMatrix4(matrix);
  cabinet.add(singleMergeMesh,doors)
  return cabinet
}
export {
  cabinetAdd
}