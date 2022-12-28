<template>
  <div class="p4" id="p4" ref="p4">p4</div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  data(){
    return{

    }
  },
  mounted(){
    this.scene = "";
    this.light = "";
    this.camera = "";
    this.renderer = "";
    this.controls = "";
    this.krq = new THREE.Object3D();
    this.textureLoader = new THREE.TextureLoader();
    this.group3 = new THREE.Group();
    this.initWorld();    
  },
  methods:{
    initWorld(){
      const self=this
      this.scene = new THREE.Scene();
      let urls=[
        './p4/statics/posx.jpg',
        './p4/statics/negx.jpg',
        './p4/statics/posy.jpg',
        './p4/statics/negy.jpg',
        './p4/statics/posz.jpg',
        './p4/statics/negz.jpg',
      ]
      let cubeLoader = new THREE.CubeTextureLoader();
      this.scene.background = cubeLoader.load(urls);
      this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 20000);
				// 将摄像机对准场景的中心
			this.camera.position.x = 180;
			this.camera.position.y = 80;
			this.camera.position.z = 90;
			this.camera.lookAt(self.scene.position);

      this.renderer = new THREE.WebGLRenderer({
					antialias: true,
					logarithmicDepthBuffer: true,
				});
      this.renderer.setClearColor(new THREE.Color(0x121A39));
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.light = new THREE.AmbientLight("#ffffff", 1);
			this.light.name = "aLight";
			this.scene.add(self.light);
      this.renderer.render(self.scene, self.camera);
    }
  }
}
</script>

<style lang="less" scoped>
.p4{
  width: 100vw;
  height: 100vh;
}
</style>