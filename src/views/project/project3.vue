<template>
  <div id="p3" ref="p3" class="p3">
    <div class="warn"  :style="{top:top+'px',left:left+'px'}">⚠</div>
    <div class="charts" :style="{top:top_chart+'px',left:left_chart+'px'}" v-show="chart_pos==0">
      <Charts :option="option"></Charts>
    </div>
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
import Charts from '../components/Charts.vue'
import makeCuboid from "../components/Cuboid.js";
import makeConvex from "../components/Convex.js"
import vc from "../components/normalVector.js"
// import { Face3 } from "three/examples/jsm/deprecated/Geometry";
export default {
  components:{
    Charts
  },
  data() {
    return {
      option:{
        title: {
          text: '实时负载'
        },
        legend: {
          show:false
        },
        xAxis: {
          data: ['负载1', '负载2', '负载3', '负载4', '负载5', '负载6']
        },
        yAxis: {},
        series: [
          {
            name: '负载',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      },
      top:'',
      left:'',
      chart_name:'',
      chart_pos:'',
      top_chart:-999,
      left_chart:'',
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
      MakeRobotPro:null,
      robotMesh:null,
      robotMix:null,
      cameraTween:null
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
      const self=this
      this.scene = new THREE.Scene();
      let axesHelper = new THREE.AxesHelper(500);
      this.scene.add(axesHelper);
      this.clock = new THREE.Clock();
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
      rectLight.lookAt(new THREE.Vector3(35, 0, -30))
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
      this.initControls()
    },
    initControls(){
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
      this.MakeRobotPro=new MakeRobot()
      this.MakeRobotPro.loadGLB().then((f)=>{
        self.robotMesh=f[0]
        self.robotMix=f[1]
        self.robotAction=f[2]
        self.robotMesh.position.set(0,0,20)
        self.robotMesh.name='robot'
        console.log('self.robotMesh',self.robotMesh)
        self.itemList.push(self.robotMesh)
        self.scene.add(self.robotMesh)
        self.MakeRobotPro.actionDo('Idle')
      })
    },
    restoreAction(){
      console.log('finished')
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
      const robotPart=['Head','Torso','HandR','LowerLeg','Arm','Hand']
      this.raycaster.setFromCamera(self.mouse, self.camera); 
      const intersection = this.raycaster.intersectObjects( self.itemList, true );    
      if(intersection.length>0){
        console.log(intersection[0])
        let mm=intersection[0].object
        console.log('hickName',mm.name)
        if(mm.name.indexOf('CabinetPro')!=-1&&mm.name.indexOf('_')!=-1){
          let object3d = this.scene.getObjectByName(mm.name);
          self.chart_name=mm.name
          self.chart_pos=object3d.position.z
          self[mm.name.split('_')[0]].pickSD(mm.name)
          self.setChartPos()
        }else if(mm.name.indexOf('CabinetPro')!=-1&&mm.name.indexOf('hand')!=-1){
          self[mm.name.split('hand')[0]].switchDoor()
        }else if(mm.name.indexOf('CabinetPro')!=-1){
          self[mm.name].switchDoor()
        }else if(this.MakeRobotPro.isRobotPart(mm.name)){
          self.MakeRobotPro.actionDo('Jump')
        }else if(mm.name=='my_ground'){
          console.log('intersection[0].object.point',intersection[0].point)
          self.MakeRobotPro.goPoint(intersection[0].point)         
        }else if(mm.name=='charts'){
          self.cameraTocharts()
        }
      }
    },
    animate(){
      const self=this
      this.setStaticPosition()
      this.setChartPos()
      this.raycaster.setFromCamera(self.mouse, self.camera); 
      if(this.cameraTween){
        this.cameraTween.update();
      }
      const intersection = this.raycaster.intersectObjects( self.itemList, true ); 
      if(self.robotMix){
        self.robotMix.update(self.clock.getDelta())
      }
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
          if(mm.name.indexOf('Cabinet')!=-1||mm.name.indexOf('charts')!=-1){
            this.scene.add(box) 
          }         
        }
        this.upDataCallBack()
      }
      this.stats.begin();
      requestAnimationFrame( this.animate );
      this.stats.end();
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
    },
    setChartPos(){
      if(!this.chart_name){
        return false
      }
      const self=this
      const box3 = new THREE.Box3();
      const object3d = this.scene.getObjectByName(self.chart_name);
      const widthHalf = window.innerWidth / 2;
      const heightHalf = window. innerHeight / 2;
      // 获取在3D空间里的坐标
      const vector = new THREE.Vector3();
      box3.setFromObject(object3d);
      box3.getCenter(vector);
      vector.project(self.camera);
      // 转换成平面坐标
      this.left_chart=vector.x * widthHalf + widthHalf;
      this.top_chart=-(vector.y * heightHalf) + heightHalf;
    },
    cameraTocharts(){
      console.log(this.camera.position)
      console.log(this.controls.target)
      if((this.camera.position.x+this.camera.position.y+this.camera.position.z)<=100){
        this.animateCamera(this.camera.position,new THREE.Vector3(40, 80, 200),this.controls.target,new THREE.Vector3(-48, 15, 15),new THREE.Vector3(-48, 15, 15))
      }else{
        this.animateCamera(this.camera.position,new THREE.Vector3(0, 20, 0),this.controls.target,new THREE.Vector3(-48, 15, 15),new THREE.Vector3(-48, 15, 15))
      }
    },
    animateCamera(current1, target1,current2,target2,lookAt) {
      const self=this
      this.cameraTween = new TWEEN.Tween({
        x1: current1.x, // 相机当前位置x
        y1: current1.y, // 相机当前位置y
        z1: current1.z, // 相机当前位置z
        x2: current2.x, // 控制当前的中心点x
        y2: current2.y, // 控制当前的中心点y
        z2: current2.z // 控制当前的中心点z
      });
      this.cameraTween.to({
        x1: target1.x, // 新的相机位置x
        y1: target1.y, // 新的相机位置y
        z1: target1.z, // 新的相机位置z
        x2: target2.x, // 新的控制中心点位置x
        y2: target2.y, // 新的控制中心点位置x
        z2: target2.z // 新的控制中心点位置x
      }, 1000);
      this.cameraTween.onUpdate(function(val) {
        self.camera.position.x = val.x1;
        self.camera.position.y = val.y1;
        self.camera.position.z = val.z1;
        self.controls.target.x = val.x2;
        self.controls.target.y = val.y2;
        self.controls.target.z = val.z2;
        self.camera.lookAt(lookAt)
      })
      // http://zuoben.top/#4-10
      this.cameraTween.easing(TWEEN.Easing.Cubic.InOut);
      this.cameraTween.start();
    }
  },
};
</script>

<style lang="less" scoped>
.p3 {
  width: 100vw;
  height: 100vh;
  position: relative;
  .charts{
    position: fixed;
    top: 0;
    left: 0;
    background: #ddd;
    width:180px;
    height:150px;
    opacity: 0.75;
  }
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
