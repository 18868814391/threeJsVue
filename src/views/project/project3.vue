<template>
  <div id="p3" ref="p3" class="p3"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { groundAdd } from './js/wall.js'
import { cabinetAdd } from './js/cabinet.js'
import makeCuboid from "../components/Cuboid.js";
import makeConvex from "../components/Convex.js"
import vc from "../components/normalVector.js"
// import { Face3 } from "three/examples/jsm/deprecated/Geometry";
export default {
  data() {
    return {
      MATERIAL_COLOR: "rgb(120, 120, 120)",
      stats: "",
      clock: "",
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
      // this.groundAdd();
      this.initRender();
    },
    initLight(intensity) {
      // 生成光源
      let light = new THREE.PointLight(0xffffff, intensity);
      light.castShadow = true;
      light.receiveShadow = true;

      light.shadow.bias = 0.001;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.position.set(100, 100, 80);
      this.scene.add(light);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,1000);
      this.camera.position.set(40, 120, 120);
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
      this.scene.add(wall)
      let cabinet=cabinetAdd()
      this.scene.add(cabinet)
    }   
  },
};
</script>

<style lang="less" scoped>
.p3 {
  width: 100vw;
  height: 100vh;
}
</style>
