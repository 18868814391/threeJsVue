<template>
  <div id="p1" ref="p1" class="p1">
    <div class="btns">
      <button @click="openMesh()">展开</button>
      <button style="margin-left:50px" @click="closeMesh()">组合</button>
    </div>
    <div id="name-box" v-show="name" :style="{top:name_top+'px',left:name_left+'px'}">{{name}}</div>
  </div>
</template>

<script>
import * as THREE from "three";
import Stats from "../stats.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'

// outline postprocessing
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

import makeCuboid from "../components/Cuboid.js";
import makeConvex from "../components/Convex.js"

export default {
  data() {
    return {
      MATERIAL_COLOR: "rgb(120, 120, 120)",
      stats: "",
      itemList: [], // 存放raycaster检测对象
      name:'',
      name_top:'',
      name_left:'',
    };
  },
  mounted() {
    this.scene = "";
    this.light = "";
    this.camera = "";
    this.renderer = "";
    this.controls = "";
    this.composer='';
    this.outlinePass='';
    this.raycaster='';
    this.mouse='';
    this.mousePosition='';
    this.stats = new Stats();
    this.$refs.p1.appendChild(this.stats.dom);
    this.initWorld();
  },
  methods: {
    initWorld() {
      this.scene = new THREE.Scene();
      // 坐标轴辅助器
      let axesHelper = new THREE.AxesHelper(1500);
      // 网格辅助器
      let gridHelper = new THREE.GridHelper(100, 100);
      this.scene.add(axesHelper);
      this.scene.add(gridHelper);
      this.initLight(1.2);
      this.initCamera();
      this.loadMyGltf();
      this.initRender();
      this.initComposer();
      this.initMouse();
    },
    initLight(intensity) {
      // 生成光源
      let ambLight = new THREE.AmbientLight(0x66ffffff);
      this.scene.add(ambLight);

      let light = new THREE.PointLight(0xffffff, intensity);
      light.castShadow = true;
      light.receiveShadow = true;

      light.shadow.bias = 0.001;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.position.set(1000, 1000, 1000);
      this.scene.add(light);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(-15, 15,16);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    loadMyGltf(){
      const self = this;
      const loader = new GLTFLoader();
      let model = "";
      loader.load("/module/a-dismantling.glb", function (gltf) {
        console.log("gltf11", gltf);
        model = gltf.scene;
        model.position.set(0, 5, 0);
        self.scene.add(model);
        self.scene.traverse(item=>{
          self.itemList.push(item);
        });      
        self.animate();  
        // self.renderer.render(self.scene, self.camera);
      });      
    },
    initRender() {
      // 3.渲染器
      const self = this;
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(self.MATERIAL_COLOR);
      this.renderer.shadowMap.enabled = true; // 开启渲染器的阴影功能
      this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCF阴影类型
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.p1.appendChild(self.renderer.domElement);
      this.renderer.render(this.scene, this.camera);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 创建控件对象
      this.controls.addEventListener("change", () => {
        this.renderer.render(this.scene, this.camera);
      }); // 监听鼠标、键盘事件
    },
    initComposer(){
      const self=this
      this.composer=new EffectComposer( self.renderer );
      const renderPass = new RenderPass( self.scene, self.camera );
      this.composer.addPass( renderPass );

      this.outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), self.scene, self.camera );
      this.outlinePass.edgeStrength = 5;
      this.outlinePass.edgeGlow = 1;
      this.outlinePass.pulsePeriod = 2;
      this.outlinePass.visibleEdgeColor.set("#35f2d1");
      this.outlinePass.hiddenEdgeColor.set("#00ffff");
      this.composer.addPass( self.outlinePass );

      const effectFXAA = new ShaderPass( FXAAShader );
      effectFXAA.uniforms[ "resolution" ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
      this.composer.addPass( effectFXAA );
    },
    move(obj,position) { // 移动函数
      new TWEEN.Tween(obj.position)
          .to(position, 1000)
          .onUpdate(function (val) {
            obj.position.set(val.x || 0, val.y || 0, val.z || 0);
          })
          .start();
    },
    openMesh(){
      const self=this
      this.move(self.scene.getObjectByName("Object_7"),{x:-2.5,y:1});
      this.move(self.scene.getObjectByName("Object_18"),{x:-5,y:-1});

      this.move(self.scene.getObjectByName("Object_10"),{x:2.5});
      this.move(self.scene.getObjectByName("Object_11"),{x:2.5});
    
      this.move(self.scene.getObjectByName("Object_17"),{x:2.5});

      this.move(self.scene.getObjectByName("Object_27"),{z:2.5});
      this.move(self.scene.getObjectByName("Object_29"),{z:2.5});

      this.move(self.scene.getObjectByName("Object_12"),{x:-5});
      this.move(self.scene.getObjectByName("Object_14"),{z:-5});
      this.move(self.scene.getObjectByName("Object_16"),{z:-5});
    },
    closeMesh(){
      const self=this
      this.move(self.scene.getObjectByName("Object_7"),{x:0,y:0});
      this.move(self.scene.getObjectByName("Object_18"),{x:0,y:0});

      this.move(self.scene.getObjectByName("Object_10"),{x:0});
      this.move(self.scene.getObjectByName("Object_11"),{x:0});
    
      this.move(self.scene.getObjectByName("Object_17"),{x:0});

      this.move(self.scene.getObjectByName("Object_27"),{z:0});
      this.move(self.scene.getObjectByName("Object_29"),{z:0});

      this.move(self.scene.getObjectByName("Object_12"),{x:0});
      this.move(self.scene.getObjectByName("Object_14"),{z:0});
      this.move(self.scene.getObjectByName("Object_16"),{z:0});
    },
    initMouse(){
      // 选中高亮并显示名称
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2( 1, 1 );
      this.mousePosition = {x:0,y:0};
      document.addEventListener( "mousemove", this.onMouseMove, false );
    },
    onMouseMove(event){
      event.preventDefault();
      this.mousePosition.x =event.clientX;
      this.mousePosition.y =event.clientY;
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, 
    animate(){
      const self=this
      TWEEN.update();
      this.raycaster.setFromCamera(self.mouse, self.camera);
      const intersection = this.raycaster.intersectObjects( self.itemList );
      if(intersection.length>0){
        // 给选中的物体 设置outline效果
        this.outlinePass.selectedObjects = [intersection[0].object];
        // 名称提示
        this.name=intersection[0].object.name.replace("Object_","零件");
        this.name_top=this.mousePosition.y; // 跟随鼠标的位置
        this.name_left=this.mousePosition.x + 30;   
        console.log()     
      }else{
        this.outlinePass.selectedObjects = [];
        nameBox.style.display = "none";
      }
      this.composer.render();
      requestAnimationFrame( this.animate );
    },
  },
};
</script>

<style lang="less" scoped>
.p1 {
  width: 100vw;
  height: 100vh;
  position:relative;
}
#name-box{
	position:absolute;
  z-index:1;
	color: white;
	background-color: rgba(15, 15, 200, 0.774);
	font-size: 32px;
	font-weight: 600;
	pointer-events: none;
	padding: 15px;
	border-radius: 10px;
}
.btns{
  width:100%;
  display:flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  position: absolute;
  z-index: 1;
  top: 0;
  left:50%;
  transform: translateX(-50%);
}
</style>
