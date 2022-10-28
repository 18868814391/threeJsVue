<template>
  <div id="shanghai" ref="shanghai" class="shanghai"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
    this.$refs.shanghai.appendChild(this.stats.dom);
    this.initWorld();
  },
  methods: {
    initWorld() {
      this.scene = new THREE.Scene();
      // 坐标轴辅助器
      let axesHelper = new THREE.AxesHelper(500);
      this.scene.add(axesHelper);
      // 网格辅助器
      // let gridHelper = new THREE.GridHelper(100, 100);
      // this.scene.add(gridHelper);
      this.initLight(1.2);
      this.initCamera();
      this.groundAdd();
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
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
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
      this.$refs.shanghai.appendChild(self.renderer.domElement);
      this.renderer.render(this.scene, this.camera);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 创建控件对象
      this.controls.addEventListener("change", () => {
        this.renderer.render(this.scene, this.camera);
      }); // 监听鼠标、键盘事件
    },
    groundAdd() {
      const self=this
      let groundGeom = new THREE.BoxBufferGeometry(100, 0.2, 100);
      let groundMate = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        map: this.loadGround(),
      });
      let ground = new THREE.Mesh(groundGeom, groundMate);
      ground.position.y = 0.1;
      ground.receiveShadow = true;
      this.scene.add(ground);
      let wall1=new THREE.BoxBufferGeometry(100, 30, 3);
      let wall_material=new THREE.MeshPhongMaterial({color: 0xdddddd})
      let wallMesh=new THREE.Mesh(wall1, wall_material);
      wallMesh.receiveShadow = true;
      let wallMesh2=wallMesh.clone();
      wallMesh.position.y = 15;
      wallMesh.position.z = -50;
      wallMesh2.position.y = 15;
      let axis=new THREE.Vector3(0,1,0);
      wallMesh2.rotateOnAxis(axis, Math.PI / 2); // 绕axis轴旋转π/8
      wallMesh2.position.x = -50;
      this.scene.add(wallMesh);
      this.scene.add(wallMesh2);
    },
    loadGround() {
      let texture = new THREE.TextureLoader().load(
        require("../../assets/ground.png"),
        ()=>{
          this.renderer.render(this.scene, this.camera);
        }
      );
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.copy(new THREE.Vector2(20, 20));
      return texture;
    },    
  },
};
</script>

<style lang="less" scoped>
.shanghai {
  width: 100vw;
  height: 100vh;
}
</style>
