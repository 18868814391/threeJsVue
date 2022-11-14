<template>
  <div id="p3" ref="p3" class="p3">
    <div class="warn" :style="{top:top+'px',left:left+'px'}">⚠</div>
  </div>
</template>

<script>
import * as THREE from "three";
import Stats from "../stats.js";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { groundAdd } from './js/wall.js'
import { MakeCabinet } from './js/cabinet.js'
// import { MakeDesk } from './js/addDesk.js'
import { MakeRobot } from './js/addRobot.js'
import { CreateLine } from './js/addLine.js'
import makeCuboid from "../components/Cuboid.js";
import makeConvex from "../components/Convex.js"
import vc from "../components/normalVector.js"
// import { Face3 } from "three/examples/jsm/deprecated/Geometry";
export default {
  data() {
    return {
      top:'',
      left:'',
      MATERIAL_COLOR: "rgb(120, 120, 120)",
      stats: "",
      clock: "",
      mouse:null,
      mousePosition:{},
      raycaster:null,
      itemList:[],
      outLineName:'',
      CabinetPro1:null,
      CabinetPro2:null,
      CabinetPro3:null,
    };
  },
  mounted() {
    this.scene = "";
    this.light = "";
    this.camera = "";
    this.renderer = "";
    this.controls = "";
    this.stats = new Stats();
    this.$refs.p3.appendChild(this.stats.dom);
    this.initWorld();
  },
  methods: {
    initWorld() {
      this.scene = new THREE.Scene();
      let axesHelper = new THREE.AxesHelper(500);
      this.scene.add(axesHelper);
      this.initLight(1.2);
      this.initCamera();
      this.addMeshes()
      this.addGlb()
      this.addLine()
      this.initRender();
      this.initMouse()
    },
    initLight(intensity) {
      // 生成光源
      let AmbLight = new THREE.AmbientLight(0xffffff, 0.2)
      let light = new THREE.PointLight(0xffffff, intensity);
      light.castShadow = true;
      light.receiveShadow = true;

      light.shadow.bias = 0.001;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.position.set(20, 100, 120);
      AmbLight.position.set(100, 100, 80);
      this.scene.add(light);
      this.scene.add(AmbLight);

      let rectLight = new THREE.RectAreaLight(0xff0000,100,3,3);
      rectLight.position.set(35, 40, -30);
      rectLight.lookAt(35, 0, -30)
      this.scene.add(rectLight);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,1000);
      this.camera.position.set(40, 80, 200);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    initRender() {
      // 3.渲染器
      const self = this;
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(self.MATERIAL_COLOR);
      this.renderer.shadowMap.enabled = true; // 开启渲染器的阴影功能
      this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCF阴影类型
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.p3.appendChild(self.renderer.domElement);
      this.renderer.render(this.scene, this.camera);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 创建控件对象
      this.controls.addEventListener("change", () => {
        this.renderer.render(this.scene, this.camera);
      }); // 监听鼠标、键盘事件
    },
    upDataCallBack(){
      this.renderer.render(this.scene, this.camera);
    },
    addMeshes(){
      let wall=groundAdd(this.upDataCallBack)
      this.itemList.push(wall)
      this.scene.add(wall)

      this.CabinetPro1=new MakeCabinet('CabinetPro1',this.upDataCallBack)
      let Cabinet=this.CabinetPro1.giveCabinet()
      Cabinet.position.set(-30,0,-30)
      this.itemList.push(Cabinet)
      this.scene.add(Cabinet)

      this.CabinetPro2=new MakeCabinet('CabinetPro2',this.upDataCallBack)
      let Cabinet2=this.CabinetPro2.giveCabinet()
      Cabinet2.position.set(0,0,-30)
      this.itemList.push(Cabinet2)
      this.scene.add(Cabinet2)      

      this.CabinetPro3=new MakeCabinet('CabinetPro3',this.upDataCallBack)
      let Cabinet3=this.CabinetPro3.giveCabinet()
      Cabinet3.position.set(30,0,-30)
      this.itemList.push(Cabinet3)
      this.scene.add(Cabinet3)        

      this.initMouse()
      this.animate()
    },
    addGlb(){
      const self=this
      let MakeRobotPro=new MakeRobot()
      MakeRobotPro.loadGLB().then((f)=>{
        self.scene.add(f)
        setTimeout(()=>{
          self.upDataCallBack()
        },150)
      })
    },
    addLine(){
      let mLine1=new CreateLine()
      let mLine2=new CreateLine()
      let ddd1=mLine1.pathLine([
        [-20, 1, -40],[-15, 1, -40],[-15, 1, -20],[-10, 1, -20]
      ])
      let ddd2=mLine2.pathLine([
        [20, 1, -40],[15, 1, -40],[15, 1, -20],[10, 1, -20]
      ])
      this.scene.add(ddd1)
      this.scene.add(ddd2)
      setTimeout(()=>{
        this.upDataCallBack()
      },150)
      setInterval(()=>{
        mLine1.loopLine()
        mLine2.loopLine()
        this.upDataCallBack()
      },25)
    },
    initMouse(){
      // 选中高亮并显示名称
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2( 1, 1 );
      this.mousePosition = {x:0,y:0};
      document.addEventListener( "mousemove", this.onMouseMove, false );
      document.addEventListener( "mousedown", this.onMouseDown, false );
    },
    onMouseMove(event){
      event.preventDefault();
      this.mousePosition.x =event.clientX;
      this.mousePosition.y =event.clientY;
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, 
    onMouseDown(event){
      const self=this
      this.raycaster.setFromCamera(self.mouse, self.camera); 
      const intersection = this.raycaster.intersectObjects( self.itemList, true );    
      if(intersection.length>0){
        let mm=intersection[0].object
        console.log('hickName',mm.name)
        if(mm.name.indexOf('CabinetPro')!=-1&&mm.name.indexOf('_')!=-1){
          self[mm.name.split('_')[0]].pickSD(mm.name)
        }else if(mm.name.indexOf('CabinetPro')!=-1&&mm.name.indexOf('hand')!=-1){
          self[mm.name.split('hand')[0]].switchDoor()
        }else if(mm.name.indexOf('CabinetPro')!=-1){
          self[mm.name].switchDoor()
        }
      }      
      
    },
    animate(){
      const self=this
      this.setStaticPosition()
      // console.log(self.mouse)
      this.raycaster.setFromCamera(self.mouse, self.camera); 
      const intersection = this.raycaster.intersectObjects( self.itemList, true );    
      if(intersection.length>0){
        let mm=intersection[0].object
        if(this.outLineName && (this.outLineName==mm.id)){
        }else{
          if(this.outLineName){
            this.scene.remove(this.scene.getObjectByName(this.outLineName));
          }
          let box=new THREE.BoxHelper( mm, '#00ffff');  //object 模型
          box.name=mm.id
          this.outLineName=mm.id
          this.scene.add(box)
        }
        this.upDataCallBack()
      }
      requestAnimationFrame( this.animate );
    },
    setStaticPosition(){
      const self=this
      const box3 = new THREE.Box3();
      const object3d = this.scene.getObjectByName("CabinetPro3hand");
      const widthHalf = window.innerWidth / 2;
      const heightHalf = window. innerHeight / 2;
      // 获取在3D空间里的坐标
      const vector = new THREE.Vector3();
      box3.setFromObject(object3d);
      box3.getCenter(vector);
      vector.project(self.camera);
      // 转换成平面坐标
      this.left=vector.x * widthHalf + widthHalf;
      this.top=-(vector.y * heightHalf) + heightHalf;
    }
  },
};
</script>

<style lang="less" scoped>
.p3 {
  width: 100vw;
  height: 100vh;
  .warn{
    position: absolute;
    color: red;
    font-size: 20px;
    animation: fade 1000ms infinite;
  }
  @keyframes fade {
    from {        
      opacity: 1.0;    
    }
    50% {        
      opacity: 0.4;    
    }
    to {        
      opacity: 1.0;    
    }
  }
}
</style>
