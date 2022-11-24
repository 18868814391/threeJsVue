import * as THREE from "three";
const segments = 30
const w = 256
const h = 256
let createPalette = () => {
  //颜色条的颜色分布
  let colorStops = {
      1.0: "#f00",
      0.8: "#e2fa00",
      0.6: "#33f900",
      0.3: "#0349df",
      0.0: "#fff"
  }

  //颜色条的大小
  let width = 256, height = 10

  // 创建canvas
  let paletteCanvas = document.createElement("canvas")
  paletteCanvas.width = width
  paletteCanvas.height = height
  paletteCanvas.style.position = 'absolute'
  paletteCanvas.style.top = '-20'
  paletteCanvas.style.right = '-500'
  let ctx = paletteCanvas.getContext("2d")

  // 创建线性渐变色
  let linearGradient = ctx.createLinearGradient(0, 0, width, 0)
  for (const key in colorStops) {
      linearGradient.addColorStop(key, colorStops[key])
  }

  // 绘制渐变色条
  ctx.fillStyle = linearGradient
  ctx.fillRect(0, 0, width, height)

  let imageData = ctx.getImageData(0, 0, width, height).data

  return {
      canvas: paletteCanvas,
      pickColor: function (position) {
          return imageData.slice(position * 4, position * 4 + 3)
      }
  }
}
// 随机给出温度值 储存在2维数组
let getTemperature = ()=> {
  var  temperatureArray=new Array()
  for(let i = 0; i < segments; i++) {
      temperatureArray[i] = parseInt(Math.random() * 25 + 10)
  }
  return temperatureArray
}

// 绘制辐射圆
let drawCircular = (context,opts) => {
  let {x, y, radius, weight} = opts
  radius = parseInt(radius * weight)

  // 创建圆设置填充色
  let rGradient = context.createRadialGradient(x, y, 0, x, y, radius)
  rGradient.addColorStop(0, "rgba(255, 0, 0, 1)")
  rGradient.addColorStop(1, "rgba(0, 255, 0, 0)")
  context.fillStyle = rGradient

  // 设置globalAlpha
  context.globalAlpha = weight
  context.beginPath()
  context.arc(x, y, radius, 0, 2 * Math.PI)
  context.closePath()

  context.fill()
}

let getHeatMapTexture = (width,height) => {
  let canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  let context = canvas.getContext("2d")

  // 随机生成温度
  let tenperature = getTemperature()

  // 绘制透明度阶梯图
  for(let i = 0; i < segments; i++) {

      // 计算出当前温度占标准温度的权值
      let weight = tenperature[i] / 35

      drawCircular(context,{
          x: Math.random() * w,
          y: Math.random() * h,
          radius: 80,
          weight: weight
      })
  }

  let imageData = context.getImageData(0, 0, width, height)
  let data = imageData.data

  // 温度调色板
  let palette = createPalette()
  document.body.appendChild(palette.canvas)

  // 在温度调色板中进行颜色采样
  for (let i = 3; i < data.length; i += 4) {
      let alpha = data[i]
      let color = palette.pickColor(alpha)
      data[i - 3] = color[0]
      data[i - 2] = color[1]
      data[i - 1] = color[2]
  }

  context.putImageData(imageData, 0, 0)

  let heatMapTexture = new THREE.Texture(canvas)
  heatMapTexture.needsUpdate = true
  return heatMapTexture
}

let giveMap=()=>{
  let heatMapGeo = new THREE.PlaneBufferGeometry(20, 20)
  let heatMapTexture = getHeatMapTexture(w, h)
  let heatMapMaterial = new THREE.MeshBasicMaterial({
      map: heatMapTexture,
      transparent: true
  })
  //设置needsUpdate 重新编译材质
  heatMapMaterial.map.needsUpdate = true
  let heatMapPlane = new THREE.Mesh(heatMapGeo, heatMapMaterial)
  heatMapPlane.position.set(0,0.6, 0)
  let axis=new THREE.Vector3(1,0,0);
  heatMapPlane.rotateOnAxis(axis, -Math.PI / 2); // 绕axis轴旋转π/8
  return heatMapPlane
}
export{
  giveMap
}