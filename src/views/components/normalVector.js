let vc=(p1=[0,0,0],p2=[0,0,0],p3=[0,0,0],positive=true)=>{
  let p1p2=[p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]]
  let p1p3=[p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]]
  let a=p1p2[1]*p1p3[2]-p1p3[1]*p1p2[2]
  let b=p1p2[2]*p1p3[0]-p1p3[2]*p1p2[0]
  let c=p1p2[0]*p1p3[1]-p1p3[0]*p1p2[1]
  if(positive){
    return `${a},${b},${c}`
  }else{
    return `${-a},${-b},${-c}`
  }
}
export default vc