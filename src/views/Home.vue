<template>
  <div>
    <div id="container" ref="container"></div>
  </div>
</template>

<script>
import * as THREE from "three";
export default {
  name: "ThreeTest",
  data() {
    return {
      distance: 500,
      zoom: 2,
      chickenSize: 15,
      positionWidth: 42,
      columns: 17,
      boardWidth: 42 * 17,
      stepTime: 200,
      vechicleColors: [0xa52523, 0xbdb638, 0x78b14b],

      carFrontTexture: "",
      carBackTexture: "",
      carRightSideTexture: "",
      carLeftSideTexture: "",
      truckFrontTexture: "",
      truckRightSideTexture: "",
      truckLeftSideTexture: "",
    };
  },
  mounted() {
    this.scene = "";
    this.camera = "";
    this.renderer = "";
    this.init();
  },
  methods: {
    init() {
      // var self = this;
      this.scene = new THREE.Scene(); // 创建场景
      this.initTexture();
      this.initCamera();
      this.initLight();
      // let chicken = new this.Chicken();
      // this.scene.add(chicken);
      let Car = this.Car();
      this.scene.add(Car);
      this.initRender();
    },
    initCamera() {
      this.camera = new THREE.OrthographicCamera(
        window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        0.1,
        10000
      );
      this.camera.rotation.x = (50 * Math.PI) / 180;
      this.camera.rotation.y = (20 * Math.PI) / 180;
      this.camera.rotation.z = (10 * Math.PI) / 180;
      const initialCameraPositionY =
        -Math.tan(this.camera.rotation.x) * this.distance;
      const initialCameraPositionX =
        Math.tan(this.camera.rotation.y) *
        Math.sqrt(this.distance ** 2 + initialCameraPositionY ** 2);
      this.camera.position.y = initialCameraPositionY;
      this.camera.position.x = initialCameraPositionX;
      this.camera.position.z = this.distance;
    },
    initLight() {
      let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
      this.scene.add(hemiLight);
      let dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight.position.set(-100, -100, 200);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.left = -500;
      dirLight.shadow.camera.right = 500;
      dirLight.shadow.camera.top = 500;
      dirLight.shadow.camera.bottom = -500;
      this.scene.add(dirLight);
      let backLight = new THREE.DirectionalLight(0x000000, 0.4);
      backLight.position.set(200, 200, 50);
      backLight.castShadow = true;
      this.scene.add(backLight);
    },
    initRender() {
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染区域尺寸
      this.renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
      this.renderer.shadowMap.enabled = true; // 展示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.$refs.container.appendChild(this.renderer.domElement); // body元素中插入canvas对象
      // 执行渲染操作   指定场景、相机作为参数
      this.renderer.render(this.scene, this.camera); // 执行渲染操作
    },
    initTexture() {
      this.carFrontTexture = new this.Texture(40, 80, [
        { x: 0, y: 10, w: 30, h: 60 },
      ]);
      this.carBackTexture = new this.Texture(40, 80, [
        { x: 10, y: 10, w: 30, h: 60 },
      ]);
      this.carRightSideTexture = new this.Texture(110, 40, [
        { x: 10, y: 0, w: 50, h: 30 },
        { x: 70, y: 0, w: 30, h: 30 },
      ]);
      this.carLeftSideTexture = new this.Texture(110, 40, [
        { x: 10, y: 10, w: 50, h: 30 },
        { x: 70, y: 10, w: 30, h: 30 },
      ]);

      this.truckFrontTexture = new this.Texture(30, 30, [
        { x: 15, y: 0, w: 10, h: 30 },
      ]);
      this.truckRightSideTexture = new this.Texture(25, 30, [
        { x: 0, y: 15, w: 10, h: 10 },
      ]);
      this.truckLeftSideTexture = new this.Texture(25, 30, [
        { x: 0, y: 5, w: 10, h: 10 },
      ]);
    },
    Texture(width, height, rects) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(0,0,0,0.6)";
      rects.forEach((rect) => {
        context.fillRect(rect.x, rect.y, rect.w, rect.h);
      });
      return new THREE.CanvasTexture(canvas);
    },
    Chicken() {
      const self = this;
      const chicken = new THREE.Group();

      const body = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          self.chickenSize * self.zoom,
          self.chickenSize * self.zoom,
          20 * self.zoom
        ),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      );
      body.position.z = 10 * self.zoom;
      body.castShadow = true;
      body.receiveShadow = true;
      chicken.add(body);

      const rowel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          2 * self.zoom,
          4 * self.zoom,
          2 * self.zoom
        ),
        new THREE.MeshLambertMaterial({ color: 0xf0619a })
      );
      rowel.position.z = 21 * self.zoom;
      rowel.castShadow = true;
      rowel.receiveShadow = false;
      chicken.add(rowel);
      return chicken;
    },
    Wheel() {
      const self = this;
      const wheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          12 * self.zoom,
          33 * self.zoom,
          12 * self.zoom
        ),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
      );
      wheel.position.z = 6 * self.zoom;
      return wheel;
    },
    Car() {
      const self = this;
      const car = new THREE.Group();
      const color =
        this.vechicleColors[
          Math.floor(Math.random() * this.vechicleColors.length)
        ];
      const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          60 * self.zoom,
          30 * self.zoom,
          15 * self.zoom
        ),
        new THREE.MeshPhongMaterial({ color })
      );
      main.position.z = 12 * this.zoom;
      main.castShadow = true;
      main.receiveShadow = true;
      car.add(main);
      const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          33 * self.zoom,
          24 * self.zoom,
          12 * self.zoom
        ),
        [
          new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            flatShading: true,
            map: self.carBackTexture,
          }),
          new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            flatShading: true,
            map: self.carFrontTexture,
          }),
          new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            flatShading: true,
            map: self.carRightSideTexture,
          }),
          new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            flatShading: true,
            map: self.carLeftSideTexture,
          }),
          new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // top
          new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // bottom
        ]
      );
      cabin.position.x = 6 * self.zoom;
      cabin.position.z = 25.5 * self.zoom;
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      car.add(cabin);
      const frontWheel = new this.Wheel();
      frontWheel.position.x = -18 * this.zoom;
      car.add(frontWheel);
      const backWheel = new this.Wheel();
      backWheel.position.x = 18 * this.zoom;
      car.add(backWheel);
      car.castShadow = true;
      car.receiveShadow = false;
      return car;
    },
  },
};
</script>
<style scoped>
#container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
