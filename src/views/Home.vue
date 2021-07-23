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
      laneTypes: ["car", "truck", "forest"],
      laneSpeeds: [2, 2.5, 3],
      threeHeights: [20, 45, 60],
      initialCameraPositionY: "",
      initialCameraPositionX: "",

      carFrontTexture: "",
      carBackTexture: "",
      carRightSideTexture: "",
      carLeftSideTexture: "",
      truckFrontTexture: "",
      truckRightSideTexture: "",
      truckLeftSideTexture: "",

      roads: [0, 1, 2, 3, 4, 5],

      lanes: [],
      currentLane: "",
      currentColumn: "",

      previousTimestamp: "",
      startMoving: "",
      moves: [],
      stepStartTimestamp: "",
    };
  },
  mounted() {
    this.scene = "";
    this.camera = "";
    this.renderer = "";
    this.chicken = "";
    this.init();
  },
  methods: {
    init() {
      // var self = this;
      this.scene = new THREE.Scene(); // 创建场景
      this.initTexture();
      this.initCamera();
      this.initLight();

      this.chicken = this.Chicken();
      this.scene.add(this.chicken);
      this.initaliseValues();

      // let Car = this.Car();
      // Car.position.z = 100;
      // this.scene.add(Car);

      // let Truck = this.Truck();
      // Truck.position.z = -150;
      // this.scene.add(Truck);

      // let Road = this.Road();
      // Road.position.z = -150;
      // this.scene.add(Road);

      // let Grass = this.Grass();
      // this.scene.add(Grass);

      // let Tree = this.Tree();
      // Tree.position.z = 200;
      // this.scene.add(Tree);

      this.initRender();
      this.listenMove();
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
      this.initialCameraPositionY = initialCameraPositionY;
      const initialCameraPositionX =
        Math.tan(this.camera.rotation.y) *
        Math.sqrt(this.distance ** 2 + initialCameraPositionY ** 2);
      this.initialCameraPositionX = initialCameraPositionX;
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
      wheel.position.z = 6 * this.zoom;
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
      const frontWheel = this.Wheel();
      frontWheel.position.x = -18 * this.zoom;
      car.add(frontWheel);
      const backWheel = this.Wheel();
      backWheel.position.x = 18 * this.zoom;
      car.add(backWheel);
      car.castShadow = true;
      car.receiveShadow = false;
      return car;
    },
    Truck() {
      const self = this;
      const truck = new THREE.Group();
      const color =
        this.vechicleColors[
          Math.floor(Math.random() * this.vechicleColors.length)
        ];

      const base = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          100 * self.zoom,
          25 * self.zoom,
          5 * self.zoom
        ),
        new THREE.MeshLambertMaterial({ color: 0xb4c6fc })
      );
      base.position.z = 10 * self.zoom;
      truck.add(base);

      const cargo = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          75 * self.zoom,
          35 * self.zoom,
          40 * self.zoom
        ),
        new THREE.MeshPhongMaterial({ color: 0xb4c6fc })
      );
      cargo.position.x = 15 * self.zoom;
      cargo.position.z = 30 * self.zoom;
      cargo.castShadow = true;
      cargo.receiveShadow = true;
      truck.add(cargo);

      const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          25 * self.zoom,
          30 * self.zoom,
          30 * self.zoom
        ),
        [
          new THREE.MeshPhongMaterial({ color }), // back
          new THREE.MeshPhongMaterial({ color, map: self.truckFrontTexture }),
          new THREE.MeshPhongMaterial({
            color,
            map: self.truckRightSideTexture,
          }),
          new THREE.MeshPhongMaterial({
            color,
            map: self.truckLeftSideTexture,
          }),
          new THREE.MeshPhongMaterial({ color }), // top
          new THREE.MeshPhongMaterial({ color }), // bottom
        ]
      );
      cabin.position.x = -40 * this.zoom;
      cabin.position.z = 20 * this.zoom;
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      truck.add(cabin);

      const frontWheel = this.Wheel();
      frontWheel.position.x = -38 * this.zoom;
      truck.add(frontWheel);

      const middleWheel = this.Wheel();
      middleWheel.position.x = -10 * this.zoom;
      truck.add(middleWheel);

      const backWheel = this.Wheel();
      backWheel.position.x = 30 * this.zoom;
      truck.add(backWheel);

      return truck;
    },
    Road() {
      const self = this;
      const road = new THREE.Group();

      const createSection = (color) =>
        new THREE.Mesh(
          new THREE.PlaneBufferGeometry(
            self.boardWidth * self.zoom,
            self.positionWidth * self.zoom
          ),
          new THREE.MeshPhongMaterial({ color })
        );

      const middle = createSection(0x454a59);
      middle.receiveShadow = true;
      road.add(middle);

      const left = createSection(0x393d49);
      left.position.x = -self.boardWidth * self.zoom;
      road.add(left);

      const right = createSection(0x393d49);
      right.position.x = self.boardWidth * self.zoom;
      road.add(right);

      return road;
    },
    Grass() {
      const self = this;
      const grass = new THREE.Group();
      const createSection = (color) =>
        new THREE.Mesh(
          new THREE.BoxBufferGeometry(
            self.boardWidth * self.zoom,
            self.positionWidth * self.zoom,
            3 * self.zoom
          ),
          new THREE.MeshPhongMaterial({ color })
        );
      const middle = createSection(0xbaf455);
      middle.receiveShadow = true;
      grass.add(middle);
      const left = createSection(0x99c846);
      left.position.x = -this.boardWidth * this.zoom;
      grass.add(left);
      const right = createSection(0x99c846);
      right.position.x = this.boardWidth * this.zoom;
      grass.add(right);
      grass.position.z = 1.5 * this.zoom;
      return grass;
    },
    Tree() {
      const self = this;
      const tree = new THREE.Group();

      const stump = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          15 * self.zoom,
          15 * self.zoom,
          20 * self.zoom
        ),
        new THREE.MeshPhongMaterial({ color: 0x4d2926 })
      );
      stump.position.z = 10 * self.zoom;
      stump.castShadow = true;
      stump.receiveShadow = true;
      tree.add(stump);

      let height =
        this.threeHeights[Math.floor(Math.random() * self.threeHeights.length)];

      const crown = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          30 * self.zoom,
          30 * self.zoom,
          height * self.zoom
        ),
        new THREE.MeshLambertMaterial({ color: 0x7aa21d })
      );
      crown.position.z = (height / 2 + 20) * self.zoom;
      crown.castShadow = true;
      crown.receiveShadow = false;
      tree.add(crown);

      return tree;
    },
    Lane(index) {
      // const self = this;
      let proto = { mesh: "0", index: "", type: "" };
      proto.index = index;
      proto.type =
        index <= 0
          ? "field"
          : this.laneTypes[Math.floor(Math.random() * this.laneTypes.length)];

      switch (proto.type) {
        case "field": {
          proto.type = "field";
          proto.mesh = this.Grass();
          return proto;
        }
        case "forest": {
          proto.mesh = this.Grass();

          proto.occupiedPositions = new Set();
          proto.trees = [1, 2, 3, 4].map(() => {
            const tree = this.Tree();
            let position;
            do {
              position = Math.floor(Math.random() * this.columns);
            } while (proto.occupiedPositions.has(position));
            proto.occupiedPositions.add(position);
            tree.position.x =
              (position * this.positionWidth + this.positionWidth / 2) *
                this.zoom -
              (this.boardWidth * this.zoom) / 2;
            proto.mesh.add(tree);
            return tree;
          });
          return proto;
        }
        case "car": {
          proto.mesh = this.Road();
          proto.direction = Math.random() >= 0.5;

          const occupiedPositions = new Set();
          proto.vechicles = [1, 2, 3].map(() => {
            const vechicle = this.Car();
            let position;
            do {
              position = Math.floor((Math.random() * this.columns) / 2);
            } while (occupiedPositions.has(position));
            occupiedPositions.add(position);
            vechicle.position.x =
              (position * this.positionWidth * 2 + this.positionWidth / 2) *
                this.zoom -
              (this.boardWidth * this.zoom) / 2;
            if (!proto.direction) vechicle.rotation.z = Math.PI;
            proto.mesh.add(vechicle);
            return vechicle;
          });

          proto.speed =
            this.laneSpeeds[Math.floor(Math.random() * this.laneSpeeds.length)];
          return proto;
        }
        case "truck": {
          proto.mesh = this.Road();
          proto.direction = Math.random() >= 0.5;

          const occupiedPositions = new Set();
          proto.vechicles = [1, 2].map(() => {
            const vechicle = this.Truck();
            let position;
            do {
              position = Math.floor((Math.random() * this.columns) / 3);
            } while (occupiedPositions.has(position));
            occupiedPositions.add(position);
            vechicle.position.x =
              (position * this.positionWidth * 3 + this.positionWidth / 2) *
                this.zoom -
              (this.boardWidth * this.zoom) / 2;
            if (!proto.direction) vechicle.rotation.z = Math.PI;
            proto.mesh.add(vechicle);
            return vechicle;
          });

          proto.speed =
            this.laneSpeeds[Math.floor(Math.random() * this.laneSpeeds.length)];
          return proto;
        }
      }
    },
    generateLanes() {
      [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map((index) => {
          const lane = this.Lane(index);
          lane.mesh.position.y = index * this.positionWidth * this.zoom;
          this.scene.add(lane.mesh);
          return lane;
        })
        .filter((lane) => lane.index >= 0);
    },
    addLane() {
      const index = this.lanes.length;
      const lane = this.Lane(index);
      lane.mesh.position.y = index * this.positionWidth * this.zoom;
      this.scene.add(lane.mesh);
      this.lanes.push(lane);
    },
    initaliseValues() {
      this.lanes = this.generateLanes();

      console.log("this.lanesggg", this.lanes);
      this.currentLane = 0;
      this.currentColumn = Math.floor(this.columns / 2);

      this.previousTimestamp = null;

      this.startMoving = false;
      this.moves = [];
      this.stepStartTimestamp;

      this.chicken.position.x = 0;
      this.chicken.position.y = 0;

      this.camera.position.y = this.initialCameraPositionY;
      this.camera.position.x = this.initialCameraPositionX;
    },
    move(direction) {
      const finalPositions = this.moves.reduce(
        (position, move) => {
          if (move === "forward")
            return { lane: position.lane + 1, column: position.column };
          if (move === "backward")
            return { lane: position.lane - 1, column: position.column };
          if (move === "left")
            return { lane: position.lane, column: position.column - 1 };
          if (move === "right")
            return { lane: position.lane, column: position.column + 1 };
        },
        { lane: this.currentLane, column: this.currentColumn }
      );

      if (direction === "forward") {
        if (
          this.lanes[finalPositions.lane + 1].type === "forest" &&
          this.lanes[finalPositions.lane + 1].occupiedPositions.has(
            finalPositions.column
          )
        )
          return;
        if (!this.stepStartTimestamp) this.startMoving = true;
        this.addLane();
      } else if (direction === "backward") {
        if (finalPositions.lane === 0) return;
        if (
          this.lanes[finalPositions.lane - 1].type === "forest" &&
          this.lanes[finalPositions.lane - 1].occupiedPositions.has(
            finalPositions.column
          )
        )
          return;
        if (!this.stepStartTimestamp) this.startMoving = true;
      } else if (direction === "left") {
        if (finalPositions.column === 0) return;
        console.log(123);
        console.log("this.lanes", this.lanes);
        console.log("finalPositions.lane", finalPositions.lane);
        console.log(this.lanes[finalPositions.lane]);
        if (
          this.lanes[finalPositions.lane].type === "forest" &&
          this.lanes[finalPositions.lane].occupiedPositions.has(
            finalPositions.column - 1
          )
        )
          return;
        if (!this.stepStartTimestamp) this.startMoving = true;
      } else if (direction === "right") {
        if (finalPositions.column === this.columns - 1) return;
        if (
          this.lanes[finalPositions.lane].type === "forest" &&
          this.lanes[finalPositions.lane].occupiedPositions.has(
            finalPositions.column + 1
          )
        )
          return;
        if (!this.stepStartTimestamp) this.startMoving = true;
      }
      this.moves.push(direction);
    },
    listenMove() {
      window.addEventListener("keydown", (event) => {
        if (event.keyCode == "38" || event.keyCode == "87") {
          // up arrow
          this.move("forward");
        } else if (event.keyCode == "40" || event.keyCode == "83") {
          // down arrow
          this.move("backward");
        } else if (event.keyCode == "37" || event.keyCode == "65") {
          // left arrow
          this.move("left");
        } else if (event.keyCode == "39" || event.keyCode == "68") {
          // right arrow
          this.move("right");
        }
      });
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
