<template>
  <div ref="bowling" class="bowling"></div>
</template>

<script>
import * as THREE from "three";
import * as CANNON from "cannon";
import Stats from "../stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// cannon.js
export default {
  data() {
    return {
      MATERIAL_COLOR: "rgb(120, 120, 120)",
      stats: "",
      clock: "",
      colors: [0xa52523, 0xbdb638, 0x78b14b],
    };
  },
  mounted() {
    this.scene = "";
    this.light = "";
    this.camera = "";
    this.renderer = "";
    this.controls = "";
    this.ground = "";
    this.world = "";
    this.stats = new Stats();
    this.$refs.bowling.appendChild(this.stats.dom);
    this.initWorld();
    this.createBottle();
    this.hitBall();
    // setInterval(() => {
    //   this.createBox();
    // }, 2000);
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
      this.groundFront();
      this.initCannon();
      this.initRender();
      this.animation();
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
      this.$refs.bowling.appendChild(self.renderer.domElement);
      this.renderer.render(this.scene, this.camera);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 创建控件对象
      this.controls.addEventListener("change", () => {
        this.renderer.render(this.scene, this.camera);
      }); // 监听鼠标、键盘事件
    },
    groundFront() {
      const self = this;
      // 地面1 前半部分
      let geometry = new THREE.BoxGeometry(40, 0.2, 40); // 创建一个立方体几何对象Geometry
      let material = new THREE.MeshLambertMaterial({
        color: 0xdddddd,
      }); // 材质对象Material
      this.ground = new THREE.Mesh(geometry, material); // 网格模型对象Mesh
      this.ground.receiveShadow = true; // 需要接受阴影
      this.scene.add(self.ground);
    },
    initCannon() {
      this.world = new CANNON.World(); // 该方法初始化物理世界，里面包含着物理世界的相关数据（如刚体数据，世界中所受外力等等）
      this.world.gravity.set(0, -9.8, 0); // 设置物理世界的重力为沿y轴向上-9.8米每二次方秒
      this.world.broadphase = new CANNON.NaiveBroadphase(); // NaiveBroadphase是默认的碰撞检测方式，该碰撞检测速度比较高
      this.world.solver.iterations = 5; // 解算器的迭代次数，更高的迭代次数意味着更加精确同时性能将会降低

      let bodyGround = new CANNON.Body({
        // 创建一个刚体（物理世界的刚体数据）
        mass: 0, // 刚体的质量，这里单位为kg
        position: new CANNON.Vec3(0, -0.1, 0), // 刚体的位置，单位是米
        shape: new CANNON.Box(new CANNON.Vec3(20, 0.1, 20)), // 刚体的形状（这里是立方体，立方体的参数是一个包含半长、半宽、半高的三维向量，具体我们以后会说）
        material: new CANNON.Material({ friction: 0.05, restitution: 0 }), // 材质数据，里面规定了摩擦系数和弹性系数
      });
      this.ground.userData = bodyGround; // 将刚体的数据赋值给地面网格的userData属性
      this.world.addBody(bodyGround); // 物理世界添加地面刚体
    },
    createBottle() {
      const self = this;
      const posArr = [
        { x: 0, y: 2.5, z: 5 },
        { x: 2.5, y: 2.5, z: 7.5 },
        { x: -2.5, y: 2.5, z: 7.5 },
        { x: -5, y: 2.5, z: 10 },
        { x: 5, y: 2.5, z: 10 },
        { x: 0, y: 2.5, z: 10 },
      ];
      for (let i = 0; i < posArr.length; i++) {
        let geometry = new THREE.CylinderGeometry(1.5, 1.5, 5);
        let material = new THREE.MeshLambertMaterial({
          color: self.colors[Math.floor(Math.random() * self.colors.length)],
        });
        let bottle = new THREE.Mesh(geometry, material);
        bottle.position.set(posArr[i].x, posArr[i].y, posArr[i].z);
        this.scene.add(bottle);

        let bodyBox = new CANNON.Body({
          mass: 1,
          position: new CANNON.Vec3(posArr[i].x, posArr[i].y, posArr[i].z),
          shape: new CANNON.Box(new CANNON.Vec3(0.75, 2.5, 0.75)),
          material: new CANNON.Material({ friction: 0.1, restitution: 0 }),
        }); // 创建一个质量为1kg，位置为（x,20,z），形状为halfSize为1,1,1的正方形刚体，材质中摩擦系数为0.1，弹性系数为0。
        bottle.userData = bodyBox; // 给box的userData属性添加刚体数据
        this.world.addBody(bodyBox); // 在物理世界中添加该刚体
      }
    },
    hitBall() {
      const self = this;
      let geometry = new THREE.SphereGeometry(5, 5, 5);
      let material = new THREE.MeshLambertMaterial({
        color: self.colors[Math.floor(Math.random() * self.colors.length)],
      });
      let bottle = new THREE.Mesh(geometry, material);
      bottle.position.set(0, 2.5, -15);
      this.scene.add(bottle);

      let bodyBox = new CANNON.Body({
        mass: 2,
        position: new CANNON.Vec3(0, 2.5, -15),
        shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3)),
        material: new CANNON.Material({ friction: 0.1, restitution: 0 }),
      }); // 创建一个质量为1kg，位置为（x,20,z），形状为halfSize为1,1,1的正方形刚体，材质中摩擦系数为0.1，弹性系数为0。
      bodyBox.velocity.set(0, 0, 80); // 这里要注意velocity属性可以刚体带有出速度
      bottle.userData = bodyBox; // 给box的userData属性添加刚体数据
      this.world.addBody(bodyBox); // 在物理世界中添加该刚体
    },
    createBox() {
      const self = this;
      let x = Math.random() * 10 - 5;
      let z = Math.random() * 10 - 5;
      let geometry = new THREE.CylinderGeometry(3, 3, 3); // 创建一个立方体几何对象Geometry
      let material = new THREE.MeshLambertMaterial({
        color: self.colors[Math.floor(Math.random() * self.colors.length)],
      }); // 材质对象Material
      let box = new THREE.Mesh(geometry, material); // createRandomMaterial创建随机颜色的材质
      box.position.set(x, 20, z);
      this.scene.add(box); // 创建box，并添加到场景

      let bodyBox = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(x, 20, z),
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
        material: new CANNON.Material({ friction: 0.1, restitution: 0 }),
      }); // 创建一个质量为1kg，位置为（x,20,z），形状为halfSize为1,1,1的正方形刚体，材质中摩擦系数为0.1，弹性系数为0。
      box.userData = bodyBox; // 给box的userData属性添加刚体数据
      this.world.addBody(bodyBox); // 在物理世界中添加该刚体

      setTimeout(() => {
        // 10秒钟之后在场景中移除box，并在物理世界中移除该刚体
        this.scene.remove(box);
        box.material.dispose();
        box.geometry.dispose();
        this.world.removeBody(bodyBox);
      }, 10000);
    },
    animation() {
      // requestAnimationFrame动画中调用render方法
      this.globalID = requestAnimationFrame(this.animation);
      this.render();
    },
    render() {
      // 更新性能插件，根据物理引擎数据更新网格数据，最后渲染场景
      this.updatePhysics();
      this.renderer.render(this.scene, this.camera);
    },
    updatePhysics() {
      // world.step
      this.world.step(1 / 60); // 第一个参数是以固定步长更新物理世界参数（详情请看api）
      this.scene.children.forEach((d) => {
        // 遍历场景中的子对象，如果对象的isMesh属性为true，我们就将更新改对象的position和quaternion属性（他们对应的刚体数据存在对应的userData中）。
        if (d.isMesh == true) {
          d.position.copy(d.userData.position);
          d.quaternion.copy(d.userData.quaternion);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bowling {
  width: 100vw;
  height: 100vh;
}
</style>
