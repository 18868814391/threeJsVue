import * as THREE from "three";
let MakeSD=function(name,callBack){
  const self=this
  this.timeObj=null 
  this.flag=0
  this.step=1
  this.inChange=false
  this.call_Back=callBack
  this.name=name
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
  const material3 = new THREE.MeshStandardMaterial( { map: three} );
  const material4 = new THREE.MeshBasicMaterial( { map: four} );
  const material5 = new THREE.MeshBasicMaterial( { map: five} );
  const material6 = new THREE.MeshBasicMaterial( { map: six} );

  const materials = [material1,material2,material3,material4,material5,material6]
  const dice = new THREE.Mesh(geometry, materials);
  dice.name=name
  this.dice=dice
}
MakeSD.prototype.giveSD=function (){
  return this.dice
}
MakeSD.prototype.pickOut = function () {
  const self=this
  if(this.inChange){
    return false
  }
  this.timeObj=setInterval(() => {
    if(this.flag===0&&this.step<=30){
      this.inChange=true
      this.step=this.step+1
    }
    if(this.flag===0&&this.step>30){
      this.inChange=false
      this.flag=1
      clearInterval(self.timeObj)
    }
    if(this.flag===1&&this.step>=1){
      // this.inChange=true
      this.step=this.step-1
    }
    if(this.flag===1&&this.step<1){
      this.inChange=false
      this.flag=0
      clearInterval(self.timeObj)
    }
    this.dice.position.z=this.step
    self.call_Back()
  },25)
};
export{
  MakeSD
}