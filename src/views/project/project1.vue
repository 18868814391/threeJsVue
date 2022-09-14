<template>
  <div id="shanghai" ref="shanghai" class="shanghai"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../stats.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import makeCuboid from "../components/Cuboid.js";
import makeConvex from "../components/Convex.js"
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
      let axesHelper = new THREE.AxesHelper(1500);
      // 网格辅助器
      let gridHelper = new THREE.GridHelper(100, 100);
      this.scene.add(axesHelper);
      this.scene.add(gridHelper);
      this.initLight(1.2);
      this.initCamera();
      // this.addBox();
      // this.addConvex()
      this.loadGltf();
      this.loadMyGltf();
      // this.loadFBXL()
      this.initRender();
    },
    initLight(intensity) {
      // 生成光源
      let ambLight = new THREE.AmbientLight(0x66ffffff);
      this.scene.add(ambLight);

      let light = new THREE.PointLight(0xffffff, intensity);
      light.castShadow = true;
      light.receiveShadow = true;

      light.shadow.bias = 0.001;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.position.set(1000, 1000, 1000);
      this.scene.add(light);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(250, 250, 800);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    // loadFBXL(){
    //   const self = this;
    //   let texturePlante = THREE.ImageUtils.loadTexture("/module/abc186f2-554f-4e7e-b7bb-38beaac46b81.png",null,function(t){});
    //   const loader = new FBXLoader()
    //   loader.load("/module/untitled.fbx",function(object){
    //     object.traverse(function (child) {
    //       var material = new THREE.MeshPhongMaterial({
    //             map:texturePlante
    //         });
    //         child.material=material;
    //         if (child.isMesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //         }
    //     });
    //     object.position.set(0, -0.15, 0.3);
    //     self.scene.add(object);
    //     self.renderer.render(self.scene, self.camera);
    //   })
    // },
    loadMyGltf(){
      const self = this;
      const loader = new GLTFLoader();
      let model = "";
      loader.load("/module/car.gltf", function (gltf) {
        console.log("gltf11", gltf);
        model = gltf.scene;
        // model.scale.set(0.1, 0.1, 0.1);
        model.position.set(10, 10, 10);
        self.scene.add(model);
        self.renderer.render(self.scene, self.camera);
      });      
    },
    loadGltf() {
      const self = this;
      const loader = new GLTFLoader();
      // const dracoLoader = new DRACOLoader();
      // dracoLoader.setDecoderPath("/gltf/");
      // dracoLoader.setDecoderConfig({ type: "js" });
      // dracoLoader.preload();
      // loader.setDRACOLoader(dracoLoader);
      let model = "";
      loader.load("/module/Horse.glb", function (gltf) {
        console.log("gltf22", gltf);
        model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, 0, 0);
        self.scene.add(model);
        self.renderer.render(self.scene, self.camera);
      });
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
    addBox() {
      let globalFinancialCenter = makeCuboid(10, 5, 2);
      globalFinancialCenter.position.set(10, 10, 10); // 位置
      this.scene.add(globalFinancialCenter);
    },
    addConvex(){
      // const points = this.generatePoints()
      // // 使用 THREE.ConvexGeometry 生成几何体
      // const convexMaterial = new THREE.MeshPhongMaterial({
      //   color: "#666",
      // })  
      // const convexGeometry = new ConvexGeometry(points)
      // const convexMesh = new THREE.Mesh(convexGeometry, convexMaterial)
      let d=makeConvex([0, 0, 0,5, 0, 0,5, 0, 5,0, 0, 5,3, 5, 3])
      this.scene.add(d[0]);   
      this.scene.add(d[1]); 
    },
    // 随机生成20个点
    generatePoints () {
        // const points = []
        // for (let i = 0; i < 20; i ++) {
        //   const x = -15 + Math.round(Math.random() * 30)
        //   const y = -15 + Math.round(Math.random() * 30)
        //   const z = -15 + Math.round(Math.random() * 30)
        //   points.push(new THREE.Vector3(x, y, z))
        // }
        const points = [new THREE.Vector3(0, 0, 0),new THREE.Vector3(5, 0, 0),new THREE.Vector3(5, 0, 5),new THREE.Vector3(0, 0, 5),new THREE.Vector3(3, 5, 3)]
        const spGroup = new THREE.Object3D()
        const material = new THREE.MeshBasicMaterial({
          'color': 'red' // 材质颜色
        })
        points.forEach(point => {
          const spGeom = new THREE.SphereGeometry(0.2)
          const spMesh = new THREE.Mesh(spGeom, material)
          spMesh.position.copy(point)
          spGroup.add(spMesh)
        })
        this.scene.add(spGroup)
        return points
    }
  },
};
</script>

<style lang="less" scoped>
.shanghai {
  width: 100vw;
  height: 100vh;
}
</style>
