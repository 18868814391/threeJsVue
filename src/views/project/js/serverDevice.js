import * as THREE from "three";
let MakeSD=function(name,callBack){
  const self=this
  let loader = new THREE.TextureLoader();
  let geometry = new THREE.BoxGeometry(19, 2, 19);
  let one = loader.load(require('../../../assets/sd-c.png'));
  let two = loader.load(require('../../../assets/sd-c.png'));
  let three = loader.load(require('../../../assets/sd-t.png'));
  let four = loader.load(require('../../../assets/sd-t.png'));
  let five = loader.load(require('../../../assets/sd-z.png'));
  let six = loader.load(require('../../../assets/sd-b.png'));
  const material1 = new THREE.MeshBasicMaterial( { map: one} );
  const material2 = new THREE.MeshBasicMaterial( { map: two} );
  const material3 = new THREE.MeshBasicMaterial( { map: three} );
  const material4 = new THREE.MeshBasicMaterial( { map: four} );
  const material5 = new THREE.MeshBasicMaterial( { map: five} );
  const material6 = new THREE.MeshBasicMaterial( { map: six} );
  const materials = [material1,material2,material3,material4,material5,material6]
  const dice = new THREE.Mesh(geometry, materials);
  return dice
}
export{
  MakeSD
}