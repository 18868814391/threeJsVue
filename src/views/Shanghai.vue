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
      this.getShanghaiTower()
      this.getGlobalFinancialCenterBottom()
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
      // 基座1.2
      let base = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 1),
        material
      );
      base.position.y = 0;
      tower.add(base);
      let base2 = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 1), material);
      base2.position.y = 1;
      tower.add(base2);
      // 底面立柱1 2 3
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
      // 底部大球
      let ball1 = new THREE.Mesh(new THREE.SphereGeometry(7, 10, 10), material);
      ball1.position.y = 20;
      ball1.position.x = 0;
      ball1.position.z = 0;
      tower.add(ball1);
      // 底面圆环
      let circleGround = new THREE.Mesh(
        new THREE.TorusGeometry(4, 1, 25, 80),
        material
      );
      let axis_bc = new THREE.Vector3(1, 0, 0); // 向量axis
      circleGround.rotateOnAxis(axis_bc, Math.PI / 2); // 绕axis轴旋转π/8
      circleGround.position.set(0, 9, 0);
      tower.add(circleGround);      
      // 底面斜柱1 2 3
      let pillar_1 = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 30),
        material
      );
      let pillar_2 = pillar_1.clone();
      let pillar_3 = pillar_1.clone();
      pillar_1.position.set(3.5, 12, -3.5/Math.cos(Math.PI/ 3));
      let axis = new THREE.Vector3(1*Math.cos(Math.PI / 6), 0, 1*Math.sin(Math.PI / 6)); // 向量axis
      pillar_1.rotateOnAxis(axis, Math.PI / 6); // 绕axis轴旋转π/8
      pillar_2.position.set(3.5, 12, 3.5/Math.cos(Math.PI / 3));
      let axis2 = new THREE.Vector3(1*Math.cos(Math.PI / 6), 0, -1*Math.sin(Math.PI / 6)); // 向量axis
      pillar_2.rotateOnAxis(axis2, -Math.PI / 6); // 绕axis轴旋转π/8
      pillar_3.position.set(-3.5/Math.cos(Math.PI / 3), 12, 0);
      let axis3 = new THREE.Vector3(0, 0, 1); // 向量axis
      pillar_3.rotateOnAxis(axis3, -Math.PI / 6); // 绕axis轴旋转π/8
      tower.add(pillar_1);
      tower.add(pillar_2);
      tower.add(pillar_3);
      // 底面斜支撑柱
      let bt_pillar1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 12),
        material
      );
      let bt_pillar2 = bt_pillar1.clone();
      let bt_pillar3 = bt_pillar1.clone();
      bt_pillar1.position.set(-6, 3, 0);  
      let axis_btp1 = new THREE.Vector3(0, 0, 1); // 向量axis
      bt_pillar1.rotateOnAxis(axis_btp1, Math.PI / 4); // 绕axis轴旋转π/8          
      bt_pillar2.position.set(6*Math.cos(Math.PI / 3), 3,-6*Math.sin(Math.PI / 3) );
      let axis_btp2 = new THREE.Vector3(-1.2*Math.cos(Math.PI / 6), 0, -1*Math.sin(Math.PI / 6)); // 向量axis
      bt_pillar2.rotateOnAxis(axis_btp2, Math.PI / 4); // 绕axis轴旋转π/8          
      bt_pillar3.position.set(6*Math.cos(Math.PI / 3), 3,6*Math.sin(Math.PI / 3) );
      let axis_btp3 = new THREE.Vector3(1.2*Math.cos(Math.PI / 6), 0, -1*Math.sin(Math.PI / 6)); // 向量axis
      bt_pillar3.rotateOnAxis(axis_btp3, Math.PI / 4); // 绕axis轴旋转π/8           
      tower.add(bt_pillar1);
      tower.add(bt_pillar2);
      tower.add(bt_pillar3);
      // 中层立柱1 2 3
      let pillar1_m = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.75, 53),
        material
      );
      pillar1_m.position.set(2.5,35,0)
      let pillar2_m = pillar1_m.clone();
      pillar2_m.position.set(-Math.cos(Math.PI / 2.5) * 3,35,-Math.sin(Math.PI / 2.5) * 3)
      let pillar3_m = pillar1_m.clone();
      pillar3_m.position.set(-Math.cos(Math.PI / 2.5) * 3,35,Math.sin(Math.PI / 2.5) * 3)
      tower.add(pillar1_m);
      tower.add(pillar2_m);
      tower.add(pillar3_m);
        // 中层圆环
      let circleGround_m1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.5, 0.75, 25, 80),
        material
      );
      let axis_bc_m1 = new THREE.Vector3(1, 0, 0); // 向量axis
      circleGround_m1.rotateOnAxis(axis_bc_m1, Math.PI / 2); // 绕axis轴旋转π/8
      circleGround_m1.position.set(0, 33, 0);
      let circleGround_m2 = circleGround_m1.clone();
      circleGround_m2.position.set(0, 40, 0);
      let circleGround_m3 = circleGround_m1.clone();
      circleGround_m3.position.set(0, 47, 0);
      let circleGround_m4 = circleGround_m1.clone();
      circleGround_m4.position.set(0, 54, 0);
      tower.add(circleGround_m1);
      tower.add(circleGround_m2);
      tower.add(circleGround_m3);
      tower.add(circleGround_m4);
      // 中层圆厅
      let ball_m1 = new THREE.Mesh(new THREE.SphereGeometry(2.5, 10, 10), material);
      ball_m1.position.set(0,33,0)
      let ball_m2=ball_m1.clone();
      ball_m2.position.set(0,40,0)
      let ball_m3=ball_m1.clone();
      ball_m3.position.set(0,47,0)
      let ball_m4=ball_m1.clone();
      ball_m4.position.set(0,54,0)      
      tower.add(ball_m1);      
      tower.add(ball_m2);
      tower.add(ball_m3);  
      tower.add(ball_m4); 
      // 中层大球
      let ball2 = new THREE.Mesh(new THREE.SphereGeometry(4.5, 10, 10), material);
      ball2.position.set(0,63,0)      
      tower.add(ball2); 
      // 三层立柱
      let pillar_top = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 10),
        material
      );
      pillar_top.position.set(0,70,0)      
      tower.add(pillar_top); 
      // 顶部小球
      let ball3 = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), material);
      ball3.position.set(0,75,0)      
      tower.add(ball3); 
      // 最顶部立柱
      let pillar_ttop = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 10, 250, 5, 5),
        material
      );
      pillar_ttop.scale.set(0.1,0.1,0.1)
      pillar_ttop.position.set(0,85,0)
      tower.add(pillar_ttop); 
      tower.scale.set(0.3,0.3,0.3)
      this.scene.add(tower);
    },
    getShanghaiTower() {
    // 1. 通过 THREE.CylinderGeometry 生成一个圆柱体 注意参数
      let _geometry = new THREE.CylinderGeometry(2, 3, 18, 7, 50);
    // 2. 操作该圆柱的顶点， 通过正弦函数规律性的变化 使其网格发生变化
      // _geometry.vertices.forEach((vertex, ind) => {
      //   // 正弦函数规律性的改变顶点坐标的x轴和z轴
      //   vertex.z = vertex.z + Math.sin((vertex.y + ind) * 0.015);
      //   vertex.x = vertex.x + Math.sin((vertex.y + ind) * 0.01) * 1;
      //   if (vertex.y >= 8.5) {
      //     // 3. 这里做了一个斜塔尖 
      //     vertex.y -= vertex.x * 0.2;
      //   }
      // });
    // 4. 改变顶点后别忘记了让网格的verticesNeedUpdate等于true
      // _geometry.verticesNeedUpdate = true;
      let len=_geometry.attributes.position.count
      let arr=_geometry.attributes.position.array
      for(let i=0;i<len;i++){
        let x=arr[i*3]
        let y=arr[i*3+1]
        let z=arr[i*3+2]
        _geometry.attributes.position.setXYZ( i, x + Math.sin((y + i) * 0.01) * 1, y,z + Math.sin((y + i) * 0.015));
      }
      _geometry.attributes.position.needsUpdate = true;  

      let _material = new THREE.MeshPhongMaterial({
        color: "rgb(120, 120, 120)"
        // wireframe: true
      });
      let tower = new THREE.Mesh(_geometry, _material);
      tower.position.set(10, 17, -8); // 位置
      tower.scale.set(1, 2, 0.5); // 缩放
      this.scene.add(tower);
    },
    getGlobalFinancialCenterBottom() {
    // 1. 手写几何体的每个顶点坐标 
      let vertices = [
        // 底部
        new THREE.Vector3(3, 0, 3), // 下标0
        new THREE.Vector3(3, 0, -3), // 下标1
        new THREE.Vector3(-3, 0, 3), // 下标2
        // 中部
        new THREE.Vector3(-3, 0, -3), // 下标3
        new THREE.Vector3(3, 10, 3), // 下标4
        new THREE.Vector3(-3, 20, -3), // 下标5
        // 上部
        new THREE.Vector3(-1.5, 30, 3), // 下标6
        new THREE.Vector3(3, 30, -1.5), // 下标7
        new THREE.Vector3(3, 30, -3), // 下标8
        new THREE.Vector3(1.5, 30, -3), // 下标9
        new THREE.Vector3(-3, 30, 1.5), // 下标10
        new THREE.Vector3(-3, 30, 3) // 下标11
      ]; // 顶点坐标，一共8个顶点

      // let faces = [
      //   // 底部2个三角形
      //   new THREE.Face3(0, 1, 2),
      //   new THREE.Face3(3, 2, 1),
      //   // 每个面的 3个三角形
      //   // 1.
      //   new THREE.Face3(6, 2, 0),
      //   new THREE.Face3(0, 4, 6),
      //   new THREE.Face3(11, 2, 6),
      //   // 2.
      //   new THREE.Face3(0, 1, 7),
      //   new THREE.Face3(7, 4, 0),
      //   new THREE.Face3(8, 7, 1),
      //   // 3.
      //   new THREE.Face3(1, 3, 9),
      //   new THREE.Face3(9, 8, 1),
      //   new THREE.Face3(3, 5, 9),
      //   // 4.
      //   new THREE.Face3(10, 3, 2),
      //   new THREE.Face3(11, 10, 2),
      //   new THREE.Face3(10, 5, 3),
      //   // 顶部4个三角形
      //   new THREE.Face3(6, 10, 11),
      //   new THREE.Face3(7, 8, 9),
      //   new THREE.Face3(6, 7, 10),
      //   new THREE.Face3(7, 9, 10),
      //   // 两个剖面 三角形
      //   new THREE.Face3(7, 6, 4),
      //   new THREE.Face3(10, 9, 5)
      // ]; // 顶点索引，每一个面都会根据顶点索引的顺序去绘制线条
      // let globalGeometry_bottom = new THREE.Geometry();
      // globalGeometry_bottom.vertices = vertices;
      let globalGeometry_bottom = new THREE.BufferGeometry()
      globalGeometry_bottom.computeFaceNormals(); // 计算法向量，会对光照产生影响
      globalGeometry_bottom.setFromPoints(vertices)
      // globalGeometry_bottom.faces = faces;
      globalGeometry_bottom.computeFaceNormals(); // 计算法向量，会对光照产生影响
      let _material = new THREE.MeshPhongMaterial({
        color: "rgb(120, 120, 120)",
        side: THREE.DoubleSide // 双面渲染
        // wireframe: true // 线框
      });
      let globalFinancialCenter = new THREE.Mesh(globalGeometry_bottom, _material);
      globalFinancialCenter.position.set(0, 0, 0); // 位置
      this.scene.add(globalFinancialCenter);
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
