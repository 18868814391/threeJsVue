<template>
  <div id="shanghai" ref="shanghai" class="shanghai"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "./stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
      // 网格辅助器
      let gridHelper = new THREE.GridHelper(100, 100);
      this.scene.add(axesHelper);
      this.scene.add(gridHelper);
      this.initLight(1.2);
      this.initCamera();
      this.groundBehind();
      this.groundFront();
      this.tower();
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
      this.camera.position.set(0, 30, 90);
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
    groundBehind() {
      // 地面2 后半部分
      let shape = new THREE.Shape();
      shape.moveTo(45, 100); // moveTo( x, y )
      shape.lineTo(50, 100); // lineTo( x, y ) - 线
      shape.lineTo(50, 0); // lineTo( x, y ) - 线
      shape.lineTo(-50, 0); // lineTo( x, y ) - 线
      shape.lineTo(-50, 60); // lineTo( x, y ) - 线
      // 贝塞尔曲线
      shape.bezierCurveTo(5, 15, 15, 5, 45, 100);

      let extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: 3,
        steps: 2,
        bevelThickness: 0,
        bevelSize: 1,
      });

      let material = new THREE.MeshLambertMaterial({ color: "gray" });

      let mesh = new THREE.Mesh(extrudeGeometry, material);

      mesh.receiveShadow = true;
      mesh.rotation.x = Math.PI + Math.PI / 2; // 地面旋转180度
      mesh.rotation.y = Math.PI; // 地面旋转180度

      mesh.position.set(0, 0, 50);
      this.scene.add(mesh);
    },
    groundFront() {
      // 地面1 前半部分
      let shape = new THREE.Shape();
      shape.moveTo(50, 0); // moveTo( x, y )
      shape.lineTo(-25, 0); // lineTo( x, y ) - 线
      shape.quadraticCurveTo(-10, 107, 50, 15); // 二次曲线

      let extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: 3,
        steps: 2,
        bevelThickness: 0,
        bevelSize: 1,
      });

      let material = new THREE.MeshLambertMaterial({ color: "#666" });

      let mesh = new THREE.Mesh(extrudeGeometry, material);

      mesh.receiveShadow = true;
      mesh.rotation.x = Math.PI / 2; // 地面旋转90度
      mesh.position.set(0, 0, -50);
      this.scene.add(mesh);
    },
    tower() {
      // const self=this;
      let tower = new THREE.Group();
      let material = new THREE.MeshLambertMaterial({ color: "#666" });
      let base = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 1),
        material
      );
      base.position.y = 0;
      tower.add(base);
      let base2 = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 1), material);
      base2.position.y = 1;
      tower.add(base2);

      let pillar1 = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 15),
        material
      );
      pillar1.position.y = 9;
      pillar1.position.x = 4;
      pillar1.position.z = 0;
      let pillar2 = pillar1.clone();
      pillar2.position.y = 9;
      pillar2.position.x = -Math.cos((Math.PI * 2) / 6) * 4;
      pillar2.position.z = -Math.sin((Math.PI * 2) / 6) * 4;
      let pillar3 = pillar1.clone();
      pillar3.position.y = 9;
      pillar3.position.x = -Math.cos((Math.PI * 2) / 6) * 4;
      pillar3.position.z = Math.sin((Math.PI * 2) / 6) * 4;
      tower.add(pillar1);
      tower.add(pillar2);
      tower.add(pillar3);
      let ball1 = new THREE.Mesh(new THREE.SphereGeometry(7, 10, 10), material);
      ball1.position.y = 20;
      ball1.position.x = 0;
      ball1.position.z = 0;
      tower.add(ball1);
      let pillar_1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 30),
        material
      );
      let axis = new THREE.Vector3(0, 1, 0); // 向量axis
      pillar_1.rotateOnAxis(axis, Math.PI / 8); // 绕axis轴旋转π/8
      // pillar_1.rotation.set((30 * Math.PI) / 180, 0, 0);
      pillar_1.position.set(3.5, 12, -7);
      let pillar_2 = pillar_1.clone();
      pillar_2.rotation.set(
        -(15 * Math.PI) / 180,
        -(30 * Math.PI) / 180,
        (10 * Math.PI) / 180
      );
      pillar_2.position.set(3.5, 12, 7);

      let pillar_3 = pillar_1.clone();
      pillar_3.rotation.set(0, 0, -(30 * Math.PI) / 180);
      pillar_3.position.set(-7, 12, 0);

      tower.add(pillar_1);
      tower.add(pillar_2);
      tower.add(pillar_3);
      this.scene.add(tower);
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
