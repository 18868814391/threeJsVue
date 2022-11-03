import * as THREE from "three";
function cabinetAdd(callBack) {
  let cabinet = new THREE.Group();

  let _material=new THREE.MeshPhongMaterial({color: 0xaaaaaa})
  let b_board=new THREE.BoxBufferGeometry(20, 1, 20);
  let b_Mesh=new THREE.Mesh(b_board, _material);

  let t_Mesh=b_Mesh.clone()
  t_Mesh.position.set(0,40,0)

  let r_board=new THREE.BoxBufferGeometry(20, 40, 1);
  let r_Mesh=new THREE.Mesh(r_board, _material);
  r_Mesh.position.set(0,20,-10)

  let l_board=new THREE.BoxBufferGeometry(1, 40, 20);
  let l_Mesh=new THREE.Mesh(l_board, _material);
  let f_Mesh=l_Mesh.clone()
  l_Mesh.position.set(-10,20,0)
  f_Mesh.position.set(10,20,0)
  
  cabinet.add(b_Mesh)
  cabinet.add(r_Mesh)
  cabinet.add(t_Mesh)
  cabinet.add(l_Mesh)
  cabinet.add(f_Mesh)
  let box=new THREE.BoxHelper( cabinet, '#00ffff');  //object 模型
  cabinet.attach(box);
  return cabinet
}
export {
  cabinetAdd
}