import * as THREE from "three";
let makeCuboid = (l = 10, w = 10, h = 10) => {
  let position = new Float32Array([
    0,0,0,l,h,0,l,0,0,
    0,0,0,0,h,0,l,h,0,
    0,0,0,0,h,0,0,0,w,
    0,h,0,0,0,w,0,h,w,
    0,0,0,l,0,0,0,0,w,
    l,0,0,l,0,w,0,0,w,
    0,h,0,l,h,0,0,h,w,
    l,h,0,l,h,w,0,h,w,
    l,0,0,l,h,0,l,0,w,
    l,h,0,l,h,w,l,0,w,
    0,h,w,0,0,w,l,h,w,
    0,0,w,l,0,w,l,h,w,
  ]);
  let normals = new Float32Array([
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0,
    0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  ]);
  let _geometry = new THREE.BufferGeometry();
  _geometry.attributes.position = new THREE.BufferAttribute(position, 3);
  _geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  let _material = new THREE.MeshPhongMaterial({
    color: "#666",
    side: THREE.DoubleSide, // 双面渲染
    // wireframe: true,
    // wireframeLinewidth: 2,
  });
  let globalFinancialCenter = new THREE.Mesh(_geometry, _material);
  return globalFinancialCenter;
};
export default makeCuboid;
