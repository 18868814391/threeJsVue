<template>
  <div>
    <div id="container" ref="container"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  name: "ThreeTest",
  data() {
    return {
      // camera: null,
      // scene: null,
      // renderer: null,
      // mesh: null,
    };
  },
  mounted() {
    this.scene = "";
    this.geometry = "";
    this.material = "";
    this.mesh = "";
    this.geometry2 = "";
    this.material2 = "";
    this.mesh2 = "";
    this.lightDirect = "";
    this.ambient = "";
    this.width = "";
    this.height = "";
    this.k = "";
    this.s = "";
    this.camera = "";
    this.renderer = "";
    this.controls = "";
    this.init();
  },
  methods: {
    init: function () {
      this.scene = new THREE.Scene(); // 创建场景

      this.geometry = new THREE.BoxGeometry(500, 10, 500); // 创建一个立方体几何对象Geometry
      this.material = new THREE.MeshLambertMaterial({
        color: 0xdddddd,
      }); // 材质对象Material
      this.mesh = new THREE.Mesh(this.geometry, this.material); // 网格模型对象Mesh
      this.mesh.receiveShadow = true; // 需要接受阴影
      this.scene.add(this.mesh); // 网格模型添加到场景中

      this.geometry2 = new THREE.SphereGeometry(10, 10, 10);
      this.material2 = new THREE.MeshLambertMaterial({
        color: 0xff00ff,
      });
      this.mesh2 = new THREE.Mesh(this.geometry2, this.material2); // 网格模型对象Mesh
      this.mesh2.position.set(0, 100, 0);
      this.mesh2.castShadow = true; // 需要投射阴影
      this.scene.add(this.mesh2);

      // 平行光源
      this.lightDirect = new THREE.DirectionalLight(0xf2f2f2, 0.8);

      this.lightDirect.position.set(20, 500, 20);
      this.lightDirect.shadow.camera.near = 0.5; // 产生阴影的最近距离
      this.lightDirect.shadow.camera.far = 200; // 产生阴影的最远距离
      // 这两个值决定使用多少像素生成阴影 默认512
      this.lightDirect.shadow.mapSize.height = 512;
      this.lightDirect.shadow.mapSize.width = 512;

      this.lightDirect.castShadow = true; // 需要阴影
      this.scene.add(this.lightDirect);
      // 环境光
      this.ambient = new THREE.AmbientLight(0x444444);
      this.scene.add(this.ambient);

      /**
       * 相机设置
       */
      this.width = window.innerWidth; // 窗口宽度
      this.height = window.innerHeight; // 窗口高度
      this.k = this.width / this.height; // 窗口宽高比
      this.s = 1000; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      // 创建相机对象
      this.camera = new THREE.OrthographicCamera(
        -this.s * this.k,
        this.s * this.k,
        this.s,
        -this.s,
        1,
        1000
      );
      this.camera.position.set(0, 250, 200); // 设置相机位置
      this.camera.lookAt(this.scene.position); // 设置相机方向(指向的场景对象)

      this.axesHelper = new THREE.AxesHelper(500); // 三维坐标辅助线
      this.scene.add(this.axesHelper);

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.width, this.height); // 设置渲染区域尺寸
      this.renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
      this.renderer.shadowMap.enabled = true; // 展示阴影
      document.body.appendChild(this.renderer.domElement); // body元素中插入canvas对象
      // 执行渲染操作   指定场景、相机作为参数
      this.renderer.render(this.scene, this.camera); // 执行渲染操作

      this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 创建控件对象

      this.controls.addEventListener("change", () => {
        this.renderer.render(this.scene, this.camera);
      }); // 监听鼠标、键盘事件

      this.moveCamera();
    },
    moveCamera() {
      const self = this;
      window.addEventListener("keydown", function (e) {
        self.keyDownWalk(e);
      });
    },
    keyDownWalk(e) {
      let keyCode = e.keyCode;
      let x = this.mesh2.position.x;
      let y = this.mesh2.position.y;
      let z = this.mesh2.position.z;
      switch (keyCode) {
        case 87: // w
          z -= 2;
          break;
        case 65: // a
          x -= 2;
          break;
        case 68: // d
          x += 2;
          break;
        case 83: // s
          z += 2;
          break;
        case 32: // blank
          y += 2;
          break;
        case 17: // ctr
          y -= 2;
          break;
        default:
          break;
      }
      this.mesh2.position.set(x, y, z); // 设置相机位置tion);
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>
<style scoped>
#container {
  height: 400px;
}
</style>
