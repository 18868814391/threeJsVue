<template>
  <div ref="house"></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  data() {
    return {};
  },
  mounted() {
    this.render = "";
    this.scene = "";
    this.camera = "";
    this.controls = "";
    this.initWorld();
    this.animation();
  },
  methods: {
    initWorld() {
      this.scene = new THREE.Scene();
      let axesHelper = new THREE.AxesHelper(500);
      // 网格辅助器
      let gridHelper = new THREE.GridHelper(100, 100);
      this.scene.add(axesHelper);
      this.scene.add(gridHelper);
      this.initLight();
      this.initCamera();
      this.loadGltf();
      this.initRender();
    },
    loadGltf() {
      const self = this;
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/gltf/");
      dracoLoader.setDecoderConfig({ type: "js" });
      dracoLoader.preload();
      loader.setDRACOLoader(dracoLoader);
      let model = "";
      loader.load("/module/chair.glb", function (gltf) {
        console.log("gltf", gltf);
        model = gltf.scene;
        self.scene.add(model);
        self.initRender();
      });
    },
    initLight() {
      // 平行光源
      this.lightDirect = new THREE.DirectionalLight(0xf2f2f2, 0.8);
      this.lightDirect.position.set(0, 500, 0);
      this.scene.add(this.lightDirect);
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      this.scene.add(ambient);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      this.camera.position.set(100, 100, 100);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    initRender() {
      const self = this;
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
      this.$refs.house.appendChild(self.renderer.domElement);
      this.renderer.render(self.scene, self.camera); // 执行渲染操作
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 创建控件对象
      this.controls.minDistance = 1;
      this.controls.maxDistance = 2;
      this.controls.addEventListener("change", () => {
        this.renderer.render(this.scene, this.camera);
      }); // 监听鼠标、键盘事件
    },
    animation() {
      requestAnimationFrame(this.animation);
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style></style>
