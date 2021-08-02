<template>
  <div id="ballFly" ref="ballFly"></div>
</template>

<script>
import * as THREE from "three";
import * as CANNON from "cannon";
import Stats from "../stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  data() {
    return {};
  },
  mounted() {
    this.scene = "";
    this.light = "";
    this.camera = "";
    this.renderer = "";
    this.controls = "";
    this.ground = "";
    this.world = "";
    this.boxes = [];
    this.boxMeshes = [];
    this.balls = [];
    this.ballMeshes = [];
    this.initWorld();
    this.initCannon();
    this.animate();
    this.shot();
  },
  methods: {
    initWorld() {
      const self = this;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.x = 40;
      this.camera.position.y = 52;
      this.camera.position.z = 78;
      this.camera.lookAt(0, 10, 0);
      this.scene.add(self.camera);
      this.scene.add(new THREE.AxesHelper(40));
      this.scene.add(new THREE.AmbientLight(0x888888));
      this.light = new THREE.DirectionalLight(0xffffff, 1);
      this.light.position.set(0, 50, 50);
      this.light.castShadow = true;
      this.light.receiveShadow = true;
      this.light.shadow.bias = 0.001;
      this.light.shadow.mapSize.width = 2048;
      this.light.shadow.mapSize.height = 2048;
      // let texture = new THREE.TextureLoader().load("imgs/ground.png");
      // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.copy(new THREE.Vector2(40, 40));

      let groundGeom = new THREE.BoxBufferGeometry(100, 0.2, 100);
      let groundMate = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        map: self.loadGround(),
      });
      this.ground = new THREE.Mesh(groundGeom, groundMate);
      this.ground.position.y = -0.1;
      this.ground.receiveShadow = true;
      this.scene.add(self.ground);

      // geometry = new THREE.BoxGeometry( 2, 2, 2 );
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCF阴影类型
      this.renderer.setClearColor(0xbfd1e5);
      this.$refs.ballFly.appendChild(self.renderer.domElement);
      // this.renderer.render(this.scene, this.camera);
      this.controls = new OrbitControls(self.camera, self.renderer.domElement);
      this.controls.addEventListener("change", () => {
        // this.renderer.render(this.scene, this.camera);
      }); // 监听鼠标、键盘事件
      let stats = new Stats();
      this.$refs.ballFly.appendChild(stats.dom);
    },
    loadGround() {
      let texture = new THREE.TextureLoader().load(
        require("./imgs/ground.png")
      );
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.copy(new THREE.Vector2(40, 40));
      return texture;
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    initCannon() {
      this.world = new CANNON.World();
      this.world.gravity.set(0, -9.8, 0);
      this.world.broadphase = new CANNON.NaiveBroadphase();
      this.world.solver.iterations = 5;

      let bodyGround = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, -0.1, 0),
        shape: new CANNON.Box(new CANNON.Vec3(50, 0.1, 50)),
        material: new CANNON.Material({ friction: 0.05, restitution: 0 }),
      });
      this.ground.userData = bodyGround;
      this.world.addBody(bodyGround);

      // 这里设置了一些变量，N表示组成约束体刚体的数量，space表示相邻两个刚体直接的距离间隔，mass为刚体的质量变量，width表示刚体半宽度，height表示刚体半高度，last表示上一个相连的刚体。
      let N = 20,
        space = 0.1,
        mass = 0,
        width = 10,
        hHeight = 1,
        last;
      let halfVec = new CANNON.Vec3(width, hHeight, 0.2); // 刚体的长宽高的halfSize向量
      let boxShape = new CANNON.Box(halfVec); // 定义一个长方体数据
      let boxGeometry = new THREE.BoxBufferGeometry(
        halfVec.x * 2,
        halfVec.y * 2,
        halfVec.z * 2
      ); // 定义一个长方几何体
      let boxMaterial = new THREE.MeshLambertMaterial({ color: 0xffaa00 }); // 定义几何体材质

      for (let i = 0; i < N; i++) {
        // 遍历N次，从上到下创建长方体网格和刚体，位置逐渐变低，质量逐渐变小。
        let boxBody = new CANNON.Body({
          mass: mass,
          material: new CANNON.Material({ friction: 0.05, restitution: 0 }),
        }); // 创建刚体，第一个刚体的质量设置成0（即为不动的刚体），定义材质，并设置摩擦系数和弹性系数
        boxBody.addShape(boxShape); // 为刚体添加形状
        let boxMesh = new THREE.Mesh(boxGeometry, boxMaterial); // 创建three世界的网格
        boxMesh.position.set(0, (N - i + 5) * (hHeight * 2 + space * 2), 0);
        boxBody.position.set(0, (N - i + 5) * (hHeight * 2 + space * 2), 0); // 这里设置刚体的位置，是由上倒下的顺序
        boxBody.linearDamping = 0.01; // 设置线性阻尼
        boxBody.angularDamping = 0.01; // 设置旋转阻尼
        boxMesh.userData = boxBody; // 给box的userData属性添加刚体数据
        this.world.addBody(boxBody); // 将刚体添加到物理世界中
        this.scene.add(boxMesh); // 将网格添加到three场景中
        this.boxes.push(boxBody); // 将刚体添加到数组中
        this.boxMeshes.push(boxMesh); // 将网格添加到数组中，这两步可以在更新物理世界中找到他们的对应关系，也可以添加到Mesh的userData属性中去
        if (i == 0) {
          // 当i=0时，也就是第一个刚体，在刚体创建完毕后，我们将mass变量设置成1
          mass = 1;
        } else {
          // 从第二个刚体往后都会创建两个点对点的约束
          let ptp1 = new CANNON.PointToPointConstraint(
            boxBody,
            new CANNON.Vec3(-width, hHeight + space, 0),
            last,
            new CANNON.Vec3(-width, -hHeight - space, 0),
            (N - i) / 4
          );
          let ptp2 = new CANNON.PointToPointConstraint(
            boxBody,
            new CANNON.Vec3(width, hHeight + space, 0),
            last,
            new CANNON.Vec3(width, -hHeight - space, 0),
            (N - i) / 4
          );
          this.world.addConstraint(ptp1); // 将约束添加到物理世界
          this.world.addConstraint(ptp2); // 将约束添加到物理世界
        }
        last = boxBody; // 这里将本次创建的刚体赋值给last变量，一遍下一个循环使用
      }
    },
    shot() {
      const self = this;
      document.addEventListener("click", (event) => {
        // 点击鼠标
        event.preventDefault(); // 阻止默认事件
        let x = (event.clientX / window.innerWidth) * 2 - 1; // 将鼠标点击的x值转换成[-1, 1]
        let y = -(event.clientY / window.innerHeight) * 2 + 1; // 将鼠标点击的y值转换成[-1, 1]
        let p = new THREE.Vector3(x, y, -1).unproject(self.camera); // 通过unproject方法，使用所传入的摄像机来反投影（projects）该向量，得到鼠标对应三维空间点
        let v = p.sub(self.camera.position).normalize(); // 用鼠标对应的三维空间点减去相机的位置向量，然后归一化得到小球的射出方向的单位向量
        this.createSphere(v, self.camera.position); // 把需要的两个向量传入创建小球的方法中
      });
    },
    createSphere(v, c) {
      // 创建小球
      const speed = 50;
      let geometry = new THREE.SphereBufferGeometry(1.5, 32, 16);
      let sphere = new THREE.Mesh(geometry, this.createRandomMaterial());
      sphere.position.copy(c);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      this.scene.add(sphere);
      this.ballMeshes.push(sphere);
      let sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(c.x, c.y, c.z),
        shape: new CANNON.Sphere(1.5),
        material: new CANNON.Material({ friction: 0.1, restitution: 0 }),
      });
      sphereBody.collisionResponse = 0.01;
      sphereBody.velocity.set(v.x * speed, v.y * speed, v.z * speed); // 这里要注意velocity属性可以刚体带有出速度
      this.world.addBody(sphereBody);
      this.balls.push(sphereBody);
      sphere.userData = sphereBody; // 给box的userData属性添加刚体数据
      setTimeout(() => {
        this.scene.remove(sphere);
        sphere.material.dispose();
        sphere.geometry.dispose();
        this.world.removeBody(sphereBody);
        this.balls.shift();
        this.ballMeshes.shift();
      }, 6000);
    },
    createRandomMaterial() {
      return new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
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

<style lang="less" scoped></style>
