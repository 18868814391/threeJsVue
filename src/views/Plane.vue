<template>
  <div id="world" ref="world" class="world"></div>
</template>
<script>
import * as THREE from "three";
import Stats from "./stats.js";
export default {
  data() {
    return {
      fieldOfView: "",
      aspectRatio: "",
      nearPlane: "",
      farPlane: "",
      HEIGHT: "",
      WIDTH: "",
      Ocean: "",
      Sky: "",
      Airplane: "",
      mousePos: { x: 0, y: 0 },
      ambersPos: [{ x: 0, y: 0 }],
      Colors: {
        red: 0xf25346,
        white: 0xd8d0d1,
        brown: 0x59332e,
        pink: 0xf5986e,
        brownDark: 0x23190f,
        blue: 0x68c3c0,
        glod: 0xffd700,
      },
      stats: "",
    };
  },
  mounted() {
    this.scene = "";
    this.camera = "";
    this.renderer = "";
    this.hemisphereLight = "";
    this.shadowLight = "";
    this.container = "";
    this.stats = new Stats();
    this.$refs.world.appendChild(this.stats.dom);
    this.initWorld();
  },
  methods: {
    initWorld() {
      const self = this;
      this.createScene();
      this.createLights();
      this.createSea();
      self.scene.add(self.Ocean);
      this.createSky();
      self.scene.add(self.Sky);
      this.createPlane();
      self.scene.add(self.Airplane);
      let amber = this.createAmber();
      self.scene.add(amber);

      this.renderer.render(self.scene, self.camera);

      document.addEventListener("mousemove", this.handleMouseMove, false);

      this.animaLoop();
    },
    createScene() {
      const self = this;
      // 获得屏幕的宽和高，
      // 用它们设置相机的纵横比
      // 还有渲染器的大小
      this.HEIGHT = window.innerHeight;
      this.WIDTH = window.innerWidth;
      this.scene = new THREE.Scene();
      // 在场景中添加雾的效果；样式上使用和背景一样的颜色
      // this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
      // 创建相机
      this.aspectRatio = this.WIDTH / this.HEIGHT;
      this.fieldOfView = 60;
      this.nearPlane = 1;
      this.farPlane = 10000;
      this.camera = new THREE.PerspectiveCamera(
        self.fieldOfView,
        self.aspectRatio,
        self.nearPlane,
        self.farPlane
      );
      // 设置相机的位置
      this.camera.position.x = 0; // 0
      this.camera.position.z = 200; // 200
      this.camera.position.y = 100; // 100
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({
        // 在 css 中设置背景色透明显示渐变色
        alpha: true,
        // 开启抗锯齿，但这样会降低性能。
        // 不过，由于我们的项目基于低多边形的，那还好 :)
        antialias: true,
      });
      // 定义渲染器的尺寸；在这里它会填满整个屏幕
      this.renderer.setSize(this.WIDTH, this.HEIGHT);
      // 打开渲染器的阴影地图
      this.renderer.shadowMap.enabled = true;
      // 在 HTML 创建的容器中添加渲染器的 DOM 元素
      this.container = document.getElementById("world");
      this.container.appendChild(self.renderer.domElement);
      // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
      window.addEventListener("resize", self.handleWindowResize, false);
    },
    handleWindowResize() {
      const self = this;
      // 更新渲染器的高度和宽度以及相机的纵横比
      this.HEIGHT = window.innerHeight;
      this.WIDTH = window.innerWidth;
      this.renderer.setSize(self.WIDTH, self.HEIGHT);
      this.camera.aspect = self.WIDTH / self.HEIGHT;
      this.camera.updateProjectionMatrix();
    },
    createLights() {
      const self = this;
      // 半球光就是渐变的光；
      // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
      this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
      // 方向光是从一个特定的方向的照射
      // 类似太阳，即所有光源是平行的
      // 第一个参数是关系颜色，第二个参数是光源强度
      this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
      // 设置光源的方向。
      // 位置不同，方向光作用于物体的面也不同，看到的颜色也不同
      this.shadowLight.position.set(150, 350, 350);
      // 开启光源投影
      this.shadowLight.castShadow = true;
      // 定义可见域的投射阴影
      this.shadowLight.shadow.camera.left = -400;
      this.shadowLight.shadow.camera.right = 400;
      this.shadowLight.shadow.camera.top = 400;
      this.shadowLight.shadow.camera.bottom = -400;
      this.shadowLight.shadow.camera.near = 1;
      this.shadowLight.shadow.camera.far = 1000;
      // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
      this.shadowLight.shadow.mapSize.width = 2048;
      this.shadowLight.shadow.mapSize.height = 2048;
      // 为了使这些光源呈现效果，只需要将它们添加到场景中
      this.scene.add(self.hemisphereLight);
      this.scene.add(self.shadowLight);
    },
    createSea() {
      const self = this;
      // 创建一个圆柱几何体
      // 参数为：顶面半径，底面半径，高度，半径分段，高度分段
      let geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10, false);
      // 在 x 轴旋转几何体
      geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      // 创建材质
      let mat = new THREE.MeshPhongMaterial({
        color: self.Colors.blue,
        transparent: true,
        opacity: 0.6,
        flatShading: THREE.FlatShading,
      });
      this.Ocean = new THREE.Mesh(geom, mat);
      this.Ocean.receiveShadow = true;
      this.Ocean.position.y = -600;
    },
    createCloud() {
      const self = this;
      // 创建一个空的容器放置不同形状的云
      let mesh = new THREE.Group();
      // 创建一个正方体
      // 这个形状会被复制创建云
      let geom = new THREE.BoxGeometry(20, 20, 20);
      // 创建材质；一个简单的白色材质就可以达到效果
      let mat = new THREE.MeshPhongMaterial({
        color: self.Colors.white,
      });
      // 随机多次复制几何体
      let nBlocs = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < nBlocs; i++) {
        // 通过复制几何体创建网格
        let m = new THREE.Mesh(geom, mat);
        // 随机设置每个正方体的位置和旋转角度
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;
        // 随机设置正方体的大小
        let s = 0.1 + Math.random() * 0.9;
        m.scale.set(s, s, s);
        // 允许每个正方体生成投影和接收阴影
        m.castShadow = true;
        m.receiveShadow = true;
        // 将正方体添加至开始时我们创建的容器中
        mesh.add(m);
      }
      return mesh;
    },
    createSky() {
      // 创建一个空的容器
      let mesh = new THREE.Group();
      // 选取若干朵云散布在天空中
      let nClouds = 20;
      // 把云均匀地散布
      // 我们需要根据统一的角度放置它们
      let stepAngle = (Math.PI * 2) / nClouds;
      // 创建云对象
      for (let i = 0; i < nClouds; i++) {
        let c = this.createCloud();
        // 设置每朵云的旋转角度和位置
        // 因此我们使用了一点三角函数
        let a = stepAngle * i; // 这是云的最终角度
        let h = 750 + Math.random() * 100 + 100; // 这是轴的中心和云本身之间的距离
        // 三角函数！！！希望你还记得数学学过的东西 :)
        // 假如你不记得:
        // 我们简单地把极坐标转换成笛卡坐标
        c.position.y = Math.sin(a) * h;
        c.position.x = Math.cos(a) * h;
        // 根据云的位置旋转它
        c.rotation.z = a + Math.PI / 2;
        // 为了有更好的效果，我们把云放置在场景中的随机深度位置
        c.position.z = -400 - Math.random() * 400;
        // 而且我们为每朵云设置一个随机大小
        let s = 1 + Math.random() * 2;
        c.scale.set(s, s, s);
        // 不要忘记将每朵云的网格添加到场景中
        mesh.add(c);
      }
      this.Sky = mesh;
      this.Sky.position.y = -700;
    },
    createPlane() {
      const self = this;
      // 创建一个空的容器
      let mesh = new THREE.Group();
      // 创建机舱
      let geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1);
      let matCockpit = new THREE.MeshPhongMaterial({
        color: self.Colors.red,
        flatShading: THREE.FlatShading,
      });
      let cockPit = new THREE.Mesh(geomCockpit, matCockpit);
      cockPit.castShadow = true;
      cockPit.receiveShadow = true;
      mesh.add(cockPit);
      // 创建引擎
      let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
      let matEngine = new THREE.MeshPhongMaterial({
        color: self.Colors.white,
        flatShading: THREE.FlatShading,
      });
      let engine = new THREE.Mesh(geomEngine, matEngine);
      engine.position.x = 40;
      engine.castShadow = true;
      engine.receiveShadow = true;
      mesh.add(engine);
      // 创建机尾
      let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
      let matTailPlane = new THREE.MeshPhongMaterial({
        color: self.Colors.red,
        flatShading: THREE.FlatShading,
      });
      let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
      tailPlane.position.set(-35, 25, 0);
      tailPlane.castShadow = true;
      tailPlane.receiveShadow = true;
      mesh.add(tailPlane);
      // 创建机翼
      let geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
      let matSideWing = new THREE.MeshPhongMaterial({
        color: self.Colors.red,
        flatShading: THREE.FlatShading,
      });
      let sideWing = new THREE.Mesh(geomSideWing, matSideWing);
      sideWing.castShadow = true;
      sideWing.receiveShadow = true;
      mesh.add(sideWing);
      // 创建螺旋桨
      let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
      let matPropeller = new THREE.MeshPhongMaterial({
        color: self.Colors.brown,
        flatShading: THREE.FlatShading,
      });
      let propeller = new THREE.Mesh(geomPropeller, matPropeller);
      propeller.castShadow = true;
      propeller.receiveShadow = true;
      // 创建螺旋桨桨叶
      let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
      let matBlade = new THREE.MeshPhongMaterial({
        color: self.Colors.brownDark,
        flatShading: THREE.FlatShading,
      });
      let blade = new THREE.Mesh(geomBlade, matBlade);
      blade.position.set(8, 0, 0);
      blade.castShadow = true;
      blade.receiveShadow = true;

      propeller.add(blade);
      propeller.position.set(50, 0, 0);
      mesh.add(propeller);
      mesh.scale.set(0.25, 0.25, 0.25);
      mesh.position.y = 100;
      this.Airplane = mesh;
    },
    animaLoop() {
      // 整体旋转
      this.stats.begin();
      const self = this;
      this.Airplane.children[4].rotation.x += 0.3;
      this.Ocean.rotation.z += 0.005;
      this.Sky.rotation.z += 0.01;
      this.movePlane();
      this.renderer.render(self.scene, self.camera);
      this.stats.end();
      requestAnimationFrame(this.animaLoop);
    },
    handleMouseMove(event) {
      // 这里我把接收到的鼠标位置的值转换成归一化值，在-1与1之间变化
      let tx = -1 + (event.clientX / this.WIDTH) * 2;
      // 对于 y 轴，我们需要一个逆公式
      // 因为 2D 的 y 轴与 3D 的 y 轴方向相反
      let ty = 1 - (event.clientY / this.HEIGHT) * 2;
      this.mousePos = { x: tx, y: ty };
    },
    movePlane() {
      const self = this;
      // 在x轴上-100至100之间和y轴25至175之间移动飞机
      // 根据鼠标的位置在-1与1之间的范围，使用的 normalize 函数实现（如下）
      let targetX = this.normalize(self.mousePos.x, -0.75, 0.75, -100, 100);
      let targetY = this.normalize(self.mousePos.y, -0.75, 0.75, 25, 175);
      // 更新飞机的位置
      // this.Airplane.position.y = targetY;
      // this.Airplane.position.x = targetX;

      // 在每帧通过添加剩余距离的一小部分值移动飞机
      this.Airplane.position.y += (targetY - this.Airplane.position.y) * 0.1;
      this.Airplane.position.x += (targetX - this.Airplane.position.x) * 0.1;
      // 剩余距离按比例转动飞机
      this.Airplane.rotation.z = (targetY - this.Airplane.position.y) * 0.0128;
      this.Airplane.rotation.x = (this.Airplane.position.y - targetY) * 0.0064;
    },
    normalize(v, vmin, vmax, tmin, tmax) {
      let nv = Math.max(Math.min(v, vmax), vmin);
      let dv = vmax - vmin;
      let pc = (nv - vmin) / dv;
      let dt = tmax - tmin;
      let tv = tmin + pc * dt;
      return tv;
    },
    createAmber() {
      const self = this;
      // 呈一串分布
      let mesh = new THREE.Group();
      let geom = new THREE.BoxGeometry(10, 10, 10);
      let mat = new THREE.MeshPhongMaterial({ color: self.Colors.glod });
      let randomSum = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < randomSum; i++) {
        let m = new THREE.Mesh(geom, mat);
        m.rotation.x = 0.12 * Math.PI * 2;
        m.rotation.y = 0.12 * Math.PI * 2;
        m.position.x = i * 15 + Math.random() * 15;
        m.rotation.y = 15 + Math.random() * 15;
        m.scale.set(0.5, 0.5, 0.5);
        m.castShadow = true;
        m.receiveShadow = true;
        mesh.add(m);
      }
      return mesh;
    },
  },
};
</script>
<style lang="less" scoped>
.world {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(#e4e0ba, #f7d9aa);
}
</style>
