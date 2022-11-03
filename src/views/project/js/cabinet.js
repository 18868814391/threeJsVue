import * as THREE from "three";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils.js";
// import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";
function cabinetAdd(callBack) {
  let cabinet = new THREE.Group();

  let _material=new THREE.MeshPhongMaterial({color: 0xaaaaaa})
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
  
  cabinet.add(b_Mesh)
  cabinet.add(r_Mesh)
  cabinet.add(t_Mesh)
  cabinet.add(l_Mesh)
  cabinet.add(f_Mesh)
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
  // let box=new THREE.BoxHelper( singleMergeMesh, '#00ffff');  //object 模型
  // singleMergeMesh.attach(box);
  console.log('singleMergeMesh',singleMergeMesh)
  return singleMergeMesh
}
export {
  cabinetAdd
}