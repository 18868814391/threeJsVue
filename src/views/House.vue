<template>
  <div ref="house"></div>
</template>

<script>
import * as THREE from "three";
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
      const self = this;
      this.scene = new THREE.Scene();

      const texture = new THREE.TextureLoader().load(
        "https://qhyxpicoss.kujiale.com/r/2019/07/01/L3D137S8ENDIADDWAYUI5L7GLUF3P3WS888_3000x4000.jpg?x-oss-process=image/resize,m_fill,w_1600,h_920/format,webp"
      );
      const geometry = new THREE.SphereGeometry(50, 256, 256);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      material.side = THREE.DoubleSide;
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);

      // 平行光源
      this.lightDirect = new THREE.DirectionalLight(0xf2f2f2, 0.8);

      this.lightDirect.position.set(0, 500, 0);
      this.lightDirect.shadow.camera.near = 0.5; // 产生阴影的最近距离
      this.lightDirect.shadow.camera.far = 1000; // 产生阴影的最远距离
      // 这两个值决定使用多少像素生成阴影 默认512
      this.lightDirect.shadow.mapSize.height = 512;
      this.lightDirect.shadow.mapSize.width = 512;

      this.lightDirect.castShadow = true; // 需要阴影
      this.scene.add(this.lightDirect);
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      this.scene.add(ambient);

      this.camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      this.camera.position.set(-0.3, 0, 0);

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
