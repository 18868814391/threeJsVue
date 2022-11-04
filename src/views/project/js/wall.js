import * as THREE from "three";
function loadGround(callBack) {
  let texture = new THREE.TextureLoader().load(
    require("../../../assets/ground.png"),
    ()=>{
      // this.renderer.render(this.scene, this.camera);
      callBack()
    }
  );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.copy(new THREE.Vector2(20, 20));
  return texture;
}
function groundAdd(callBack) {
  let house = new THREE.Group();
  const self=this
  let groundGeom = new THREE.BoxBufferGeometry(100, 0.2, 100);
  let groundMate = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    map: loadGround(callBack),
  });
  let ground = new THREE.Mesh(groundGeom, groundMate);
  ground.position.y = 0.1;
  ground.receiveShadow = true;
  let wall1=new THREE.BoxBufferGeometry(100, 30, 3);
  let wall_material=new THREE.MeshPhongMaterial({color: 0xdddddd})
  let wallMesh=new THREE.Mesh(wall1, wall_material);
  wallMesh.receiveShadow = true;
  let wallMesh2=wallMesh.clone();
  wallMesh.position.y = 15;
  wallMesh.position.z = -50;
  wallMesh2.position.y = 15;
  let axis=new THREE.Vector3(0,1,0);
  wallMesh2.rotateOnAxis(axis, Math.PI / 2); // 绕axis轴旋转π/8
  wallMesh2.position.x = -50;
  house.add(wallMesh)
  house.add(wallMesh2)
  house.add(ground)
  return house
}
export {
  groundAdd
}