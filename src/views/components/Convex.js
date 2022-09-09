import * as THREE from "three";
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
let makeConvex= (points=[],showPoint=true) => {
  let len=points.length
  let step=len/3
  let newPint=[]
  for (let i = 0; i < step; i ++) {
    newPint.push(new THREE.Vector3(points[i*3],points[i*3+1],points[i*3+2]))
  }
  const spGroup = new THREE.Object3D()
  const material = new THREE.MeshBasicMaterial({
    'color': 'red' // 材质颜色
  })
  newPint.forEach(point => {
    const spGeom = new THREE.SphereGeometry(0.2)
    const spMesh = new THREE.Mesh(spGeom, material)
    spMesh.position.copy(point)
    spGroup.add(spMesh)
  })
  const convexMaterial = new THREE.MeshPhongMaterial({
    color: "#666",
  }) 
  const convexGeometry = new ConvexGeometry(newPint)
  const convexMesh = new THREE.Mesh(convexGeometry, convexMaterial)  
  return [spGroup,convexMesh]
}
export default makeConvex;