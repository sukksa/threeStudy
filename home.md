## 创建3D场景

### Scene

**场景对象**，THREE对象都挂载在scene上。`scene.add()`

```js
const scene = new THREE.Scene()

//scene.add(mesh)
```

### Mesh

**网格模型**

1. Geometry 立方体几何对象
2. Material 材质对象

```
const geometry = new THREE.BoxGeometry(1, 1, 1); //创建一个立方体几何对象Geometry
const material = new THREE.MeshLambertMaterial({
  color: 0x0000ff
}); //材质对象Material
const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
scene.add(mesh); //网格模型添加到场景中
```

### Camera

**相机**

1. PerspectiveCamera 透视相机

   模拟人眼视角，有近大远小的透视效果，物体会随距离变形

   ```js
   const camera = new THREE.PerspectiveCamera(
     45,       // 视野角度（FOV in degrees）
     width/height, // 宽高比（Aspect Ratio）
     0.1,      // 近裁剪面（Near Plane）
     1000      // 远裁剪面（Far Plane）
   );
   ```

   

2. OrthographicCamera 正交相机

   平行投影，物体大小与距离无关， 保持物体原始比例

   ```js
   const camera = new THREE.OrthographicCamera(
     left,     // 左裁剪面
     right,    // 右裁剪面
     top,      // 上裁剪面
     bottom,   // 下裁剪面
     near,     // 近裁剪面
     far       // 远裁剪面
   );
   ```

   

```js
const width = window.innerWidth; //窗口宽度
const height = window.innerHeight; //窗口高度
const k = width / height; //窗口宽高比
const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大

//创建相机对象
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
const camera = new THREE.PerspectiveCamera(75, k)
camera.position.set(3, 3, 3); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```

### Renderer

**渲染器对象**

```js
var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

const canvas = document.querySelector('canvas.webgl') // 获取 canvas.webgl
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(width, height);//设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
//执行渲染操作   指定场景、相机作为参数
renderer.render(scene, camera);
```



## Transform Object

### 位置 position

是一个三维向量 new THREE.Vector3(0.7, -0.6, 1)

mesh.position.normalize()  归一化

mesh.position.distanceTo(camera.position)  查看mesh到camera的向量长度

```	js
 mesh.position.x = 0.7
 mesh.position.y = -0.6
 mesh.position.z = 1
 // mesh.position.set(0.7, -0.6, 1)
 mesh.position.length() // 1.3601470508735443

 // 归一化 向量长度设置为1
 mesh.position.normalize()
 mesh.position.length() // 1
```

### 坐标轴 AxesHelper

```js
const axesHeper = new THREE.AxesHelper(2)
scene.add(axesHeper)
```

### 缩放 scale

```js
mesh.scale.x = 2 // mesh的x方向长度变为原来的2倍
mesh.scale.y = 0.5 
mesh.scale.z = 0.5
// mesh.scale.set(2, 0.5, 0.5)
```

### 旋转 rotation (基于欧拉角 uhler)

旋转是围绕物体自身的坐标轴旋转的，x轴旋转后，Y轴不会向上。

mesh.rotation.reorder('YXZ') 调整旋转的顺序，调用x,y的顺序不会导致不同，默认'XYZ'。

```js
// mesh.rotation.reorder('YXZ')  // 旋转结果会不同
mesh.rotation.y = Math.PI * 0.25 // mesh 绕自身y轴旋转45°， 2PI一周
mesh.rotation.x = Math.PI * 0.25
```

### 旋转 quaternion 四元数

### LookAt

调整摄像机对准目标，参数为三维向量，默认对准场景中心。

```js
camera.lookAt(new THREE.Vector3(0, 0, 0)) // 默认，场景中心
camera.lookAt(mesh.position)
```

### 创建组 new THREE.Group()

同时transform多个对象

```js
const group = new THREE.Group()
group.position.y = 1
group.scale.y = 0.5
group.rotation.y = Math.PI * 1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff0000
    }))
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    }))
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x0000ff
    }))
cube3.position.x = 2
group.add(cube3)
```

## Animations

本质并不是动画效果，只是在下一帧再次调用函数。对于刷新率不同的显示器每秒调用次数也不同。60fps为60次，120fps为120次

### 利用帧间隔 getDelta

deltaTime 为两帧之间的时间间隔，60fps帧间隔为16ms，每秒调用60次，1s旋转60x16x0.01=9.6。120fps帧间隔为8ms，每秒调用120次，1s旋转120x8x0.01=9.6。

deltaTime相当于clock.getDelta()

```js
let time = Date.now()
const tick = () => {
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime
    
    mesh.rotation.y += 0.01 * deltaTime
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
```

### Clock.getElapsedTime()

getElapsedTime() 时clock初始化时从0开始计时（单位：s）

elapsedTime时累计时间，意味着mesh每秒旋转一周

```js
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y = elapsedTime * Math.PI * 2
    
    // mesh绕圆柱旋转
    // mesh.position.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
```

### GSAP库

## Cameras

### ![img](http://www.webgl3d.cn/upload/threejs60%E6%8A%95%E5%BD%B1.jpg)

### PerspectiveCamera

透视相机，PerspectiveCamera( fov, aspect, near, far )

```js
PerspectiveCamera(fov, aspect, near, far)
```

| 参数   | 含义                                                         | 默认值                               |
| :----- | :----------------------------------------------------------- | :----------------------------------- |
| fov    | fov表示视场，所谓视场就是能够看到的角度范围，人的眼睛大约能够看到180度的视场，视角大小设置要根据具体应用，一般游戏会设置60~90度 | 45                                   |
| aspect | aspect表示渲染窗口的长宽比，如果一个网页上只有一个全屏的canvas画布且画布上只有一个窗口，那么aspect的值就是网页窗口客户区的宽高比 | window.innerWidth/window.innerHeight |
| near   | near属性表示的是从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 | 0.1                                  |
| far    | far属性表示的是距离相机多远的位置截止渲染，如果设置的值偏小，会有部分场景看不到 | 1000                                 |

![img](http://www.webgl3d.cn/upload/threejs60PerspectiveCamera.png)

### OrthographicCamera

正交相机。无透视，物体不缩放。左右边界的距离与上下边界的距离比值与画布的渲染窗口的宽高比例要一致，否则三维模型的显示效果会被单方向不等比例拉伸

```js
OrthographicCamera(left, right, top, bottom, near, far)
```

| 参数(属性) | 含义                                                         |
| :--------- | :----------------------------------------------------------- |
| left       | 渲染空间的左边界                                             |
| right      | 渲染空间的右边界                                             |
| top        | 渲染空间的上边界                                             |
| bottom     | 渲染空间的下边界                                             |
| near       | near属性表示的是从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 默认值0.1 |
| far        | far属性表示的是距离相机多远的位置截止渲染，如果设置的值偏小小，会有部分场景看不到。 默认值1000 |

![img](http://www.webgl3d.cn/upload/threejs60OrthographicCamera.png)

```js
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(-1 * aspectRatio,
    1 * aspectRatio,
    1,
    -1,
    0.1, 100)
```

### 鼠标控制旋转

```js
// 获取鼠标坐标(-0.5, 0.5), 画面中央为原点
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = -(event.clientY / window.innerHeight - 0.5)
})

const tick = () => {
    // 水平方向旋转一周
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)
    
    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()
```

## Controls

[FlyControls](https://threejs.org/docs/examples/en/controls/FlyControls.html) 像控制飞船一样旋转镜头

[FirstPersonControls](https://threejs.org/docs/examples/en/controls/FirstPersonControls.html) 与 FlyControls 类似，但无法操控Y轴

[PointerLockControls](https://threejs.org/docs/examples/en/controls/PointerLockControls.html) 让鼠标消失，只能旋转方向，类似第一人称游戏。键盘操作距离

[OrbitControls](https://threejs.org/docs/examples/en/controls/OrbitControls.html) 轨道控制，左键旋转，右键移动，中键放大

```js
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // 启用阻尼（惯性）
```

[TrackballControls](https://threejs.org/docs/examples/en/controls/TrackballControls.html) 类似OrbitControls, 但是没有视角限制，可以无休止的旋转

[TransformControls](https://threejs.org/docs/examples/en/controls/TransformControls.html) 变换控件，可以移动物体

[DragControls](https://threejs.org/docs/examples/en/controls/DragControls.html) 类似TransformControls可以拖动物体

## Fullscreen and Resize

### Resize

```css
.webgl{
  position: fixed; 	// 固定canvas
  top: 0;
  left: 0;
  outline: none;  // 去除边框
}
html, body{
  overflow: hidden; // 去除滚动事件
}
```

```js
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// 添加 resize 事件，监听窗口变化。
window.addEventListener('resize', () => {
    // 更新sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
	// 更新camera
    camera.aspect = sizes.width / sizes.height // 宽高比
    camera.updateProjectionMatrix() // 提醒相机更新投影矩阵
  	// 渲染
    renderer.setSize(sizes.width, sizes.height)
})
```

### Pixel ratio

设备像素比，屏幕上的一个物理像素单位相对于软件中的一个像素单位。`window.devicePixelRatio`

2 的像素比意味着需要渲染 4 倍的像素（4个物理像素对应1个逻辑像素），3 的像素比意味着需要渲染 9 倍的像素。

防止在高像素比的设备出现性能问题。可以放在resize事件中，如果用户使用两块屏幕并且像素比不同时，确保更好的渲染质量

```js
// Pixel ratio 最大设为 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```

### Fullscreen

`document.fullscreenElement` 是否全屏

`canvas.requestFullscreen() `将某个dom全屏，只显示那一个dom

`document.exitFullscreen()` 退出全屏，退出是文档级的，所以用

但是在 Safari 上无效

```js
// 双击进入全屏，退出
window.addEventListener('dblclick', () => {

    if (!document.fullscreenElement) {
        console.log('go fullscreen')
        canvas.requestFullscreen()
    } else {
        console.log('leave fullscreen')
        document.exitFullscreen()
    }
})
```

```js
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen()) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen()) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen()) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen()) {
            document.webkitExitFullscreen()
        }
    }
})
```

## Geometry

### 几何体

几何体是由顶点构成，每个顶点都有位置数据（position, UV, normal, ...），3个顶点连接成三角形，再构成面

- [BoxGeometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry) 立方体
- [PlaneGeometry](https://threejs.org/docs/#api/en/geometries/PlaneGeometry) 平面
- [CircleGeometry](https://threejs.org/docs/#api/en/geometries/CircleGeometry) 圆面
- [ConeGeometry](https://threejs.org/docs/#api/en/geometries/ConeGeometry) 圆锥
- [CylinderGeometry](https://threejs.org/docs/#api/en/geometries/CylinderGeometry) 圆柱
- [RingGeometry](https://threejs.org/docs/#api/en/geometries/RingGeometry) 环
- [TorusGeometry](https://threejs.org/docs/#api/en/geometries/TorusGeometry) 3d环（戒指）
- [TorusKnotGeometry](https://threejs.org/docs/#api/en/geometries/TorusKnotGeometry) 环面结
- [DodecahedronGeometry](https://threejs.org/docs/#api/en/geometries/DodecahedronGeometry) 十二面体
- [OctahedronGeometry](https://threejs.org/docs/#api/en/geometries/OctahedronGeometry) 八面体
- [TetrahedronGeometry](https://threejs.org/docs/#api/en/geometries/TetrahedronGeometry) 四面体
- [IcosahedronGeometry](https://threejs.org/docs/#api/en/geometries/IcosahedronGeometry) 二十面体
- [SphereGeometry](https://threejs.org/docs/#api/en/geometries/SphereGeometry) 球
- [ShapeGeometry](https://threejs.org/docs/#api/en/geometries/ShapeGeometry) 心形（平面）
- [TubeGeometry](https://threejs.org/docs/#api/en/geometries/TubeGeometry) 管道
- [ExtrudeGeometry](https://threejs.org/docs/#api/en/geometries/ExtrudeGeometry) 
- [LatheGeometry](https://threejs.org/docs/#api/en/geometries/LatheGeometry) 车床？
- [TextGeometry](https://threejs.org/docs/?q=textge#examples/en/geometries/TextGeometry) 3d文字

### BoxGeometry

以`BoxGeometry`为例，

```js
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
```

- `width`: `x`轴的尺寸
- `height`:`y`轴的尺寸
- `depth`: `z`轴的尺寸
- `widthSegments`: `x`轴上的分段
- `heightSegments`:  `y` 轴上的分段
- `depthSegments`:  `z` 轴上的分段

分段对应于构成面部的三角形数量认情况下，它是 `1`，这意味着每个面只有 2 个三角形。如果将细分设置为 `2`，则每个面最终将有 8 个三角形。`2*Math.pow(n)`。更多的分段意味着可以做出更平滑的面，或者不同高度的地形

将 `wireframe： true` 添加到材质中。线框将显示分隔每个三角形的线条：

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
```

BufferGeometry

创建自定义的几何体，通过类型化数组创建

```js
const positionsArray = new Float32Array([
    0, 0, 0, // Vertex 1 x, y, z
    0, 1, 0, // Vertex 2
    1, 0, 0 // Vertex 3
])
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', positionsAttribute)
```

```js
const geometry = new THREE.BufferGeometry() // 创建一个空的几何体对象
const count = 50 // 三角形数量
const positionsArray = new Float32Array(count * 3 * 3) // 创建位置数组 150个点 3个数字为一个顶点
for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = Math.random() - 0.5
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3) // 每个顶点接受3个数字
geometry.setAttribute('position', positionsAttribute) // 将位置数据添加到几何体对象
// 三角会共享顶点，通过setIndex优化
geometry.dispose(); // 移除几何体
```

## Debug UI

用于调试参数，以`dat.gui`为例

```js
npm i --save dat.gui

import * as dat from 'dat.gui'
const gui = new dat.GUI() // 实例化dat.gui
```

通过`gui.add()`添加需要控制的对象属性，必须接受一个对象

- **Range** 数值范围

  ```js
  const params = { size: 10 };
  // 基础用法
  gui.add(params, 'size'); 
  // 带范围限制的滑块
  gui.add(params, 'size', 0, 100, 1); // min=0, max=100, step=1
  ```

- **Checkbox** 复选框 (`true` or `false`)

  ```js
  const params = { visible: true };
  gui.add(params, 'visible'); // 生成复选框
  ```

- **Text** 文本框

  ```js
  const params = { name: 'Cube' };
  gui.add(params, 'name'); // 生成文本框
  ```

- **Select** 下拉选框

  ```js
  const params = { type: 'sphere' };
  
  // 传入选项数组
  gui.add(params, 'type', ['sphere', 'cube', 'cylinder']); // 生成下拉菜单
  ```

- **Color** 颜色选择

  ```js
  const params = { color: '#ff0000' };
  // 需使用 addColor 方法
  gui.addColor(params, 'color'); // 生成颜色选择器
  ```

- **Button** 点击按钮

  ```js
  import gsap from 'gsap'
  let debugObject = {
      spin: () => {
          gsap.to(mesh.rotation, {
              duration: 1,
              y: mesh.rotation.y + Math.PI * 2 // mesh 绕Y轴旋转一周 2PI
          })
      }
  }
  gui.add(debugObject, 'spin') // 添加一个按钮，点击后执行spin方法
  ```

- **Folder** 文件

基本用法

```js
import * as dat from 'dat.gui'
const gui = new dat.GUI() // 实例化dat.gui
gui.add(mesh.position, 'y', -3, 3, 0.01) // 添加一个y轴的控制器，范围是-3到3，步长是0.01
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y轴') // 与上面的代码等价，并取别名

gui.add(mesh, 'visible') // 控制mesh的可见性，自动识别出现checkbox
gui.add(material, 'wireframe') // 控制材质的wireframe(线框)属性
```

通过`onChange(...)`监听控制器变化，` material.color.set(...)`修改材质的颜色

```js
let debugObject = {
    color: 0xff0000,
}
gui.addColor(debugObject, 'color').onChange(() => {
    material.color.set(debugObject.color)
})
```

## Texture

[poliigon](https://www.poliigon.com/) [3dtextures](https://3dtextures.me/) [arroway-textures](https://www.arroway-textures.ch/)

纹理

### PBR (Physically Based Rendering)

PBR是基于物理的渲染，偏向现实中的物体，主要是金属感`metalness`和粗糙度`roughness`

### TextureLoader

```js
const texture = new THREE.TextureLoader().load(
  url,          // 图像路径（必填）
  onLoad,       // 加载成功回调（可选）
  onProgress,   // 加载进度回调（可选）
  onError       // 加载失败回调（可选）
);
```

| 参数             | 类型       | 说明                                                         |
| :--------------- | :--------- | :----------------------------------------------------------- |
| **`url`**        | `string`   | 图像资源的 URL 路径（支持相对/绝对路径）                     |
| **`onLoad`**     | `Function` | 加载成功时触发，参数为加载完成的 `THREE.Texture` 对象        |
| **`onProgress`** | `Function` | 加载进度回调，参数为 `XMLHttpRequest` 实例（含 `loaded` 和 `total` 字节） |
| **`onError`**    | `Function` | 加载失败时触发，参数为错误信息                               |

```js
const loader = new THREE.TextureLoader();

const texture = loader.load(
  'textures/metal.png',
  (texture) => { 
    console.log('纹理加载完成', texture); 
    material.needsUpdate = true; // 若动态加载需手动更新材质
  },
  (xhr) => {
    console.log(`${(xhr.loaded / xhr.total * 100)}% 已加载`);
  },
  (err) => {
    console.error('加载失败:', err);
  }
);
// 将纹理应用到材质
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(new THREE.BoxGeometry(), material);
scene.add(cube);
```

对纹理进行操作

```js
textrue.repeat.x = 2 // 水平方向重复两次
textrue.repeat.y = 3 // 垂直方向重复三次
textrue.wrapS = THREE.RepeatWrapping // 水平方向重复
textrue.wrapT = THREE.MirroredRepeatWrapping // 垂直方向镜像重复 

textrue.offset.x = 0.5 // x轴偏移0.5
textrue.offset.y = 0.5 // y轴偏移0.5

textrue.rotation = Math.PI / 4 // 旋转45度
// 旋转中心点 默认(0,0) 左下角
textrue.center.x = 0.5 
textrue.center.y = 0.5 
```

### Texture Mapping

纹理映射，GPU会生成从原本大小的纹理到宽高为1/2,1/4，直到`1x1`大小的映射图（总大小为原来的2倍）。GPU会根据缩放程度，选择加载合适的纹理图

| **过滤类型**             | **触发场景**                                                 | **典型问题**                       |
| :----------------------- | :----------------------------------------------------------- | :--------------------------------- |
| **Minification Filter**  | 当纹理被**缩小**（纹理分辨率 > 屏幕像素分辨率）时使用。 （例如：远距离观察高分辨率贴图） | 锯齿（Aliasing）、闪烁（Moire）    |
| **Magnification Filter** | 当纹理被**放大**（纹理分辨率 < 屏幕像素像素分辨率）时使用。 （例如：近距离观察低分辨率贴图） | 模糊（Blur）、马赛克（Pixelation） |

```js
const texture = new THREE.TextureLoader().load('texture.jpg');

// 缩小过滤器配置（解决远处纹理问题）
texture.minFilter = THREE.LinearMipmapLinearFilter; // 三线性过滤（默认值）
// texture.minFilter = THREE.NearestFilter; // 高性能，低质量

// 放大过滤器配置（解决近处纹理问题）
texture.magFilter = THREE.LinearFilter; // 双线性过滤（默认值）
// texture.magFilter = THREE.NearestFilter; // 锐利边缘（如像素风格）

texture.needsUpdate = true; // 使配置生效
```

为了节约资源，无需缩放的贴图，可以不生成mipmaps

```js
Texture.generateMipmaps = false // 不生成mipmaps
```

## Material

### **材质对比**

| 材质类型                 | 光照模型            | 主要特性                                                     | 性能消耗 | 适用场景                           |
| :----------------------- | :------------------ | :----------------------------------------------------------- | :------- | :--------------------------------- |
| **MeshBasicMaterial**    | 无光照              | - 仅显示颜色/贴图 - 不支持光照和阴影 - 简单且高性能          | 最低     | 无光照物体、线框模式、背景元素     |
| **MeshNormalMaterial**   | 法线向量            | - 将法线向量转换为 RGB 颜色 - **无需光照**                   | 低       | 调试法线方向、风格化视觉效果       |
| **MeshMatcapMaterial**   | Matcap 贴图         | - 通过预烘焙的 Matcap 贴图模拟光照 - 无需实际光源            | 低       | 卡通风格、快速展示、低性能设备     |
| **MeshDepthMaterial**    | 深度值              | - 将深度信息渲染为颜色 - 用于后处理效果（如雾、景深）        | 低       | 阴影映射、深度可视化               |
| **MeshLambertMaterial**  | Lambert (漫反射)    | - 支持漫反射光照 - **无镜面高光** - 性能较好                 | 低       | 哑光材质（布料、纸张、无光泽物体） |
| **MeshPhongMaterial**    | Phong (漫反射+镜面) | - 支持漫反射和镜面高光 - 可设置 `specular` 和 `shininess`    | 中       | 反光材质（塑料、陶瓷、金属）       |
| **MeshToonMaterial**     | 卡通渲染            | - 使用渐变纹理实现色块化（cel-shading）效果 - 支持高光（风格化） | 中低     | 卡通风格、非写实渲染               |
| **MeshStandardMaterial** | PBR (物理渲染)      | - 基于物理的渲染（金属度/粗糙度） - 支持环境贴图、法线贴图、AO 贴图等 | 高       | 真实感材质（汽车、石材、皮肤）     |
| **MeshPhysicalMaterial** | PBR (扩展)          | - 继承自 `StandardMaterial` - 支持透射（`transmission`）、清漆层等 | 最高     | 复杂物理效果（玻璃、液体、宝石）   |

### MeshBasicMaterial

一种基础材质，它不考虑光照影响，直接以纯色或贴图渲染物体表面。

| 参数名            | 类型            | 默认值      | 说明                                                         |
| :---------------- | :-------------- | :---------- | :----------------------------------------------------------- |
| **`color`**       | `THREE.Color`   | `0xffffff`  | 材质颜色（十六进制值或CSS颜色字符串）                        |
| **`wireframe`**   | `boolean`       | `false`     | 是否以线框模式渲染（显示为网格线）                           |
| **`opacity`**     | `number`        | `1`         | 透明度（0.0 完全透明 ~ 1.0 不透明），需设置 `transparent: true` 生效 |
| **`transparent`** | `boolean`       | `false`     | 是否启用透明度                                               |
| **`map`**         | `THREE.Texture` | `null`      | 表面贴图（漫反射颜色纹理）                                   |
| **`alphaMap`**    | `THREE.Texture` | `null`      | 透明度贴图（控制各区域透明度，需开启 `transparent`）         |
| **`side`**        | `THREE.Side`    | `FrontSide` | 渲染面：`FrontSide`（前）、`BackSide`（后）、`DoubleSide`（双面） |
| **`fog`**         | `boolean`       | `true`      | 是否受场景雾效影响                                           |
| **`depthTest`**   | `boolean`       | `true`      | 是否启用深度测试（避免被其他物体遮挡）                       |
| **`depthWrite`**  | `boolean`       | `true`      | 是否写入深度缓冲区                                           |
| **`visible`**     | `boolean`       | `true`      | 材质是否可见                                                 |

- side

  ```js
  // 设置内外哪面可见
  material.side = THREE.FrontSide // 默认
  material.side = THREE.BackSide	// 仅渲染背面（适用于镜面效果）
  material.side = THREE.DoubleSide // 两面可见, 双面渲染（适用于透明物体）
  ```

- transparent

  是否透明，`opacity` `alphaMap `需要设为`true`

  ```js
  material.transparent = true 
  material.opacity = 0.5
  material.alphaMap = doorColorTexture
  ```

### MeshNormalMaterial

一种基于物体表面法线方向（Normal）进行颜色映射的材质，常用于调试模型或实现特定的视觉效果。物体颜色由法线决定

法线是垂直于顶点向外的向量

| 参数              | 类型      | 默认值      | 说明                                                         |
| :---------------- | :-------- | :---------- | :----------------------------------------------------------- |
| **`wireframe`**   | `boolean` | `false`     | 线框模式显示模型结构                                         |
| **`flatShading`** | `boolean` | `false`     | 平面着色（每个面的法线相同）vs 平滑着色（顶点法线插值）      |
| **`opacity`**     | `number`  | `1`         | 透明度（0.0 完全透明 ~ 1.0 不透明）                          |
| **`transparent`** | `boolean` | `false`     | 是否允许透明（需与 `opacity` 配合使用）                      |
| **`side`**        | `enum`    | `FrontSide` | 定义渲染的面：`THREE.FrontSide`（前）、`BackSide`（后）、`DoubleSide`（双面） |

- **`flatShading: true`**

  - **法线来源**：每个三角形面片的法线（Face Normal）
  - **计算方式**：取三角形三个顶点的平均法线，整个面片使用同一法线值
  - **颜色表现**：面片内部颜色一致，面与面交界处颜色突变

- **`flatShading: false`**

  - **法线来源**：顶点的法线（Vertex Normal）
  - **计算方式**：在三角形内部插值顶点法线，每个像素的法线独立计算
  - **颜色表现**：颜色平滑过渡，隐藏面片边界

  ```js
  material.flatShading = true
  ```

### MeshMatcapMaterial

一种基于 **预渲染环境光照（Material Capture，Matcap）** 的材质，它通过纹理贴图模拟复杂的光照和材质反射效果，无需实际光源即可实现立体感。

| 参数                    | 类型            | 默认值     | 说明                                           |
| :---------------------- | :-------------- | :--------- | :--------------------------------------------- |
| **`matcap`**            | `THREE.Texture` | `null`     | Matcap 贴图（必须提供）                        |
| **`color`**             | `THREE.Color`   | `0xffffff` | 材质基础颜色，与 Matcap 颜色相乘               |
| **`bumpMap`**           | `THREE.Texture` | `null`     | 凹凸贴图（灰度图，影响表面凹凸感）             |
| **`bumpScale`**         | `number`        | `1`        | 凹凸强度（正负值控制凹凸方向）                 |
| **`normalMap`**         | `THREE.Texture` | `null`     | 法线贴图（影响表面细节光照方向）               |
| **`normalScale`**       | `THREE.Vector2` | `(1,1)`    | 法线贴图强度（x/y 对应 UV 方向）               |
| **`displacementMap`**   | `THREE.Texture` | `null`     | 置换贴图（实际改变顶点位置，需足够细分几何体） |
| **`displacementScale`** | `number`        | `1`        | 置换强度                                       |
| **`flatShading`**       | `boolean`       | `false`    | 是否启用平面着色（面片法线 vs 顶点法线插值）   |

- matcp

  将模型法线方向映射到 Matcap 贴图的 UV 坐标，通过贴图像素颜色模拟光照反射。贴图通常为 **圆形渐变色图**，中心代表法线朝向摄像机（Z+方向），边缘代表法线朝向侧面。

### MeshDepthMaterial

一种基于物体到相机距离（深度）渲染的材质，其颜色由物体表面相对于相机的远近决定。它常用于 **深度可视化**、**阴影映射** 和 **后处理效果**（如 SSAO）。

**近点白色，远点是黑色。用于制作雾效和预处理**

| 参数                    | 类型/枚举            | 默认值             | 说明                                                         |
| :---------------------- | :------------------- | :----------------- | :----------------------------------------------------------- |
| **`depthPacking`**      | `THREE.DepthPacking` | `RGBADepthPacking` | 深度数据编码方式： `BasicDepthPacking`（32位）或 `RGBADepthPacking`（RGBA四通道8位存储） |
| **`alphaTest`**         | `number`             | `0`                | 透明度测试阈值（0.0~1.0），低于此值的像素被丢弃              |
| **`displacementMap`**   | `THREE.Texture`      | `null`             | 置换贴图（灰度图，实际修改顶点位置）                         |
| **`displacementScale`** | `number`             | `1`                | 置换强度（正负值控制凹凸方向）                               |
| **`displacementBias`**  | `number`             | `0`                | 置换基准偏移量                                               |
| **`wireframe`**         | `boolean`            | `false`            | 是否以线框模式渲染                                           |

```js
const geometry = new THREE.SphereGeometry(2, 32, 16);
const material = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
  wireframe: false
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

### MeshLambertMaterial

一种基于 **Lambert 光照模型** 的材质，适用于表现**非光泽表面**的物体（如木材、布料、哑光塑料等）。漫反射，确保场景添加了光源才能显示

| 参数          | 类型            | 作用                                           |
| :------------ | :-------------- | :--------------------------------------------- |
| `color`       | `THREE.Color`   | 材质的基础颜色（默认 `0xffffff`，白色）        |
| `map`         | `THREE.Texture` | 漫反射贴图，覆盖基础颜色                       |
| `emissive`    | `THREE.Color`   | 自发光颜色（使物体在无光源时可见）             |
| `emissiveMap` | `THREE.Texture` | 自发光贴图                                     |
| `envMap`      | `THREE.Texture` | 环境贴图（模拟反射周围环境，但不同于镜面反射） |
| `wireframe`   | `Boolean`       | 是否以线框模式渲染（默认 `false`）             |

```js
// 1. 创建材质
const material = new THREE.MeshLambertMaterial({
  color: 0x00ff00,     // 基础颜色（十六进制）
  map: textureLoader.load('path/to/diffuse.jpg'), // 漫反射贴图
  emissive: 0x444444,  // 自发光颜色
  wireframe: false      // 是否显示为线框
});

// 2. 创建几何体并应用材质
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  material
);

// 3. 确保场景中添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 环境光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 平行光
scene.add(ambientLight, directionalLight);
```

### MeshPhongMaterial

一种基于 **Phong 光照模型** 的材质，支持高光，适用于表现**光泽表面**的物体（如塑料、金属、玻璃等）。

| 参数          | 类型            | 作用                                                |
| :------------ | :-------------- | :-------------------------------------------------- |
| `specular`    | `THREE.Color`   | 镜面高光的颜色（默认 `0x111111`，暗灰色）           |
| `shininess`   | `Number`        | 高光强度，值越大高光范围越小、亮度越高（默认 `30`） |
| `specularMap` | `THREE.Texture` | 高光贴图（控制不同区域的高光强度）                  |
| `normalMap`   | `THREE.Texture` | 法线贴图（模拟表面凹凸细节）                        |
| `envMap`      | `THREE.Texture` | 环境贴图（模拟环境反射，需设置 `combine` 属性）     |

```js
import * as THREE from 'three';

// 1. 创建材质
const material = new THREE.MeshPhongMaterial({
  color: 0x00ff00,       // 基础颜色
  specular: 0xffffff,    // 高光颜色（默认白色）
  shininess: 100,        // 高光强度（范围 0-1000，默认 30）
  map: textureLoader.load('path/to/diffuse.jpg'), // 漫反射贴图
  normalMap: textureLoader.load('path/to/normal.jpg') // 法线贴图
});

// 2. 创建几何体并应用材质
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  material
);

// 3. 添加光源（必须）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
```

### MeshToonMaterial

一种专为 **卡通风格渲染（Toon Shading/Cel Shading）** 设计的材质，通过色阶化的光照效果模拟手绘或动画风格。

| **参数名**               | **类型**        | **默认值**        | **说明**                                                     |
| :----------------------- | :-------------- | :---------------- | :----------------------------------------------------------- |
| **`color`**              | `THREE.Color`   | `0xffffff`        | 基础颜色（十六进制或 CSS 颜色字符串）                        |
| **`gradientMap`**        | `THREE.Texture` | `null`            | 渐变贴图（定义颜色阶跃，通常为 3-4 色阶的横向渐变色带）      |
| **`shininess`**          | `number`        | `30`              | 高光区域大小（仅在与 `specular` 结合时生效）                 |
| **`specular`**           | `THREE.Color`   | `0x111111`        | 高光颜色（需设置 `shininess` > 0）                           |
| **`map`**                | `THREE.Texture` | `null`            | 基础颜色贴图（覆盖 `color`）                                 |
| **`normalMap`**          | `THREE.Texture` | `null`            | 法线贴图（模拟表面凹凸细节）                                 |
| **`normalScale`**        | `THREE.Vector2` | `(1, 1)`          | 法线贴图强度（控制凹凸效果）                                 |
| **`alphaMap`**           | `THREE.Texture` | `null`            | 透明度贴图（灰度图，需开启 `transparent`）                   |
| **`transparent`**        | `boolean`       | `false`           | 是否启用透明度（需与 `alphaMap` 或 `opacity` 配合）          |
| **`opacity`**            | `number`        | `1.0`             | 整体透明度（`0.0` 完全透明 ~ `1.0` 不透明）                  |
| **`wireframe`**          | `boolean`       | `false`           | 是否以线框模式渲染                                           |
| **`wireframeLinewidth`** | `number`        | `1`               | 线宽（可能受硬件限制）                                       |
| **`side`**               | `THREE.Side`    | `THREE.FrontSide` | 渲染面：`FrontSide`（仅正面）、`BackSide`（仅背面）、`DoubleSide`（双面） |

### MeshStandardMaterial

一种基于物理渲染（PBR）的材质，它通过 **金属度（Metalness）** 和 **粗糙度（Roughness）** 参数模拟真实世界的光照反射行为，能够实现高度逼真的材质效果。

| **参数名**              | **类型**        | **默认值**        | **说明**                                                     |
| :---------------------- | :-------------- | :---------------- | :----------------------------------------------------------- |
| **`color`**             | `THREE.Color`   | `0xffffff`        | 基础颜色（十六进制或 CSS 颜色字符串），与 `map` 贴图颜色相乘 |
| **`metalness`**         | `number`        | `0.5`             | 金属度（`0.0` 非金属，`1.0` 全金属），金属材质反射环境光，非金属漫反射 |
| **`roughness`**         | `number`        | `0.5`             | 粗糙度（`0.0` 镜面光滑，`1.0` 完全漫反射），控制表面光泽度   |
| **`envMap`**            | `THREE.Texture` | `null`            | 环境贴图（立方体贴图或 HDR 贴图），用于模拟环境反射和间接光照 |
| **`map`**               | `THREE.Texture` | `null`            | 漫反射贴图（Albedo），定义表面基础颜色纹理                   |
| **`metalnessMap`**      | `THREE.Texture` | `null`            | 金属度贴图（灰度图，白色区域为金属，黑色为非金属）           |
| **`roughnessMap`**      | `THREE.Texture` | `null`            | 粗糙度贴图（灰度图，白色区域更粗糙，黑色更光滑）             |
| **`normalMap`**         | `THREE.Texture` | `null`            | 法线贴图（RGB 编码法线方向），模拟表面凹凸细节               |
| **`normalScale`**       | `THREE.Vector2` | `(1, 1)`          | 法线贴图强度（`x` 和 `y` 分量分别控制 UV 方向的凹凸强度）    |
| **`aoMap`**             | `THREE.Texture` | `null`            | 环境光遮蔽贴图（灰度图，白色无遮蔽，黑色强遮蔽），增强角落阴影。**必须加上环境光** |
| **`aoMapIntensity`**    | `number`        | `1.0`             | AO 贴图强度，值越大遮蔽效果越明显                            |
| **`displacementMap`**   | `THREE.Texture` | `null`            | 置换贴图（灰度图），通过顶点位移模拟几何凹凸（需细分几何体） |
| **`displacementScale`** | `number`        | `1`               | 置换强度，正值凸起，负值凹陷                                 |
| **`displacementBias`**  | `number`        | `0`               | 置换基准偏移量，控制整体位移基准                             |
| **`emissive`**          | `THREE.Color`   | `0x000000`        | 自发光颜色（物体主动发出的光色），不受场景光照影响           |
| **`emissiveIntensity`** | `number`        | `1.0`             | 自发光强度，值越大发光越亮                                   |
| **`emissiveMap`**       | `THREE.Texture` | `null`            | 自发光贴图（定义各区域发光颜色和强度）                       |
| **`alphaMap`**          | `THREE.Texture` | `null`            | 透明度贴图（灰度图，黑色完全透明，白色不透明），需开启 `transparent` |
| **`transparent`**       | `boolean`       | `false`           | 是否启用透明度，需与 `opacity` 或 `alphaMap` 配合使用        |
| **`opacity`**           | `number`        | `1.0`             | 整体透明度（`0.0` 透明 ~ `1.0` 不透明），需开启 `transparent` |
| **`side`**              | `THREE.Side`    | `THREE.FrontSide` | 渲染面：`FrontSide`（仅正面）、`BackSide`（仅背面）、`DoubleSide`（双面） |

**PBR 参数控制逻辑**

**1. 金属度（Metalness）**

- **`0.0`**：非金属（如塑料、木材），漫反射为主
- **`1.0`**：金属（如黄金、铝材），镜面反射为主
- **中间值**：模拟合金或表面氧化效果

**2. 粗糙度（Roughness）**

- **`0.0`**：镜面反射（光滑表面，如抛光金属）
- **`1.0`**：完全漫反射（粗糙表面，如混凝土）

**3. 环境贴图（EnvMap）**

- **必须项**：金属材质需要环境贴图才能正确显示反射

- **加载方式**：

  ```js
  new THREE.CubeTextureLoader()
    .setPath('textures/cubemap/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'], (envMap) => {
      material.envMap = envMap;
    });
  ```

**贴图类型与作用**

| 贴图类型           | 作用                                                         | 示例用途               |
| :----------------- | :----------------------------------------------------------- | :--------------------- |
| **`map`**          | 基础颜色（Albedo）                                           | 物体表面颜色纹理       |
| **`metalnessMap`** | 控制各区域金属度（灰度图，白=金属区）                        | 锈蚀金属的局部金属效果 |
| **`roughnessMap`** | 控制各区域粗糙度（灰度图，白=粗糙区）                        | 磨损表面的粗糙变化     |
| **`normalMap`**    | 通过法线向量模拟表面凹凸，添加细节，而又不用细分时           | 砖墙、织物纹理细节     |
| **`aoMap`**        | 模拟环境光遮蔽（Ambient Occlusion）增强角落阴影（**必须加上环境光**） | 提升场景立体感         |

- aoMap

  ```js
  // aoMap  环境遮挡贴图，增加缝隙的阴影，增加细节，必须加上环境光
  material.aoMap = ambientTexture
  material.aoMapIntensity = 1 // 环境遮挡贴图强度
  plane.geometry.setAttribute('uv2',
      new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  ```

- displacementMap 

  需要设置多的顶点数量

  ```js
  const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1,100,100),
      material
  )
  ```

- normalMap

  添加细节，不用大量分段时

  ```js
  material.normalMap = doorNormalTexture
  material.normalScale.set(0.5, 0.5)
  ```

### MeshPhysicalMaterial

比MeshStandardMaterial 更贴近现实，性能消耗更高

### PointsMaterial

粒子特效

## Environment Map

[HDRIHaven](https://polyhaven.com/) 环境贴图素材

[matheowis](https://matheowis.github.io/HDRI-to-CubeMap/) 切分环境贴图

环境贴图是反映场景周围的图像。可以提供场景外的图像，可以用于折射和反射，也能为mesh提供照明

只支持立方体环境贴图

| 参数             | 类型       | 说明                                                    |
| :--------------- | :--------- | :------------------------------------------------------ |
| **`urls`**       | `Array`    | **6个URL的数组**，顺序为： `[+x, -x, +y, -y, +z, -z]`   |
| **`onLoad`**     | `Function` | 加载成功时触发，参数为 `THREE.CubeTexture` 实例         |
| **`onProgress`** | `Function` | 进度回调，参数为 `event`（含 `loaded` 和 `total` 计数） |
| **`onError`**    | `Function` | 失败时触发，参数为错误信息                              |

- urls

  | 面名   | 方向           | 对应图片位置         |
  | :----- | :------------- | :------------------- |
  | **+X** | 右面（Right）  | 立方体右侧正对观察者 |
  | **-X** | 左面（Left）   | 立方体左侧正对观察者 |
  | **+Y** | 顶面（Top）    | 立方体顶部正对观察者 |
  | **-Y** | 底面（Bottom） | 立方体底部正对观察者 |
  | **+Z** | 后面（Back）   | 立方体背面正对观察者 |
  | **-Z** | 前面（Front）  | 立方体正面正对观察者 |

```js
// 1. 定义六个面的图片路径（顺序必须正确）
const urls = [
  'textures/cubemap/px.png', // +X 右面
  'textures/cubemap/nx.png', // -X 左面
  'textures/cubemap/py.png', // +Y 顶面
  'textures/cubemap/ny.png', // -Y 底面
  'textures/cubemap/pz.png', // +Z 后面
  'textures/cubemap/nz.png'  // -Z 前面
];

// 2. 创建加载器并加载
const loader = new THREE.CubeTextureLoader();
const texture = loader.load(urls, (cubeTexture) => {
  // 3. 将立方体贴图设置为场景背景
  scene.background = cubeTexture;

  // 4. 或用于材质环境反射（如金属球）
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.9,
    roughness: 0.1,
    envMap: cubeTexture // 应用环境贴图
  });
}, undefined, (err) => {
  console.error('立方体贴图加载失败:', err);
});

scene.background = cubeTexture // 添加到场景
```

HDR贴图

```js
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
const hdrLoader = new RGBELoader();
const hdrTextrue = hdrLoader.load(
    'textures/environmentMap/2k.hdr',
    (texture) => {
        // 设置映射模式（必须！）
        texture.mapping = THREE.EquirectangularReflectionMapping;

        // 设置为场景环境贴图（影响所有PBR材质）
        scene.environment = texture;

        // 可选：设置为背景
        scene.background = texture;
    },
    (progress) => {
        console.log(`加载进度: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
    },
    (error) => {
        console.error('HDR 加载失败:', error);
    }
);
// 或者单独作用
material.envMap = hdrTextrue
```

## 3D TEXT

### FontLoader

**`FontLoader`** 用于加载 **JSON 格式的字体文件**，并生成可用于创建 3D 文字的几何体（`TextGeometry`）。ttf转换json [Facetype.js](https://gero3.github.io/facetype.js/)

```js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
const loader = new FontLoader();

loader.load(
  'fonts/helvetiker_regular.typeface.json', // 字体文件路径
  (font) => {
    // 字体加载成功后的回调
    createText(font);
  },
  (progress) => {
    console.log(`加载进度: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
  },
  (error) => {
    console.error('字体加载失败:', error);
  }
);
```

### TextGeometry

**`TextGeometry`** 用于生成 **3D 文字几何体**，需配合 `FontLoader` 加载的字体文件。

| **参数**             | **类型**  | **默认值** | **说明**                                       |
| :------------------- | :-------- | :--------- | :--------------------------------------------- |
| **`font`**           | `Font`    | 必填       | 通过 `FontLoader` 加载的字体对象               |
| **`size`**           | `number`  | `100`      | 字号大小（非像素单位，基于场景比例）           |
| **`height`**         | `number`  | `50`       | 文字厚度（Z轴方向的深度）                      |
| **`curveSegments`**  | `number`  | `12`       | 曲线分段数（值越高，圆角越平滑，性能消耗越大） |
| **`bevelEnabled`**   | `boolean` | `false`    | 是否启用倒角（文字边缘斜切效果）               |
| **`bevelThickness`** | `number`  | `10`       | 倒角深度（从正面到背面的延伸距离）             |
| **`bevelSize`**      | `number`  | `8`        | 倒角宽度（从边缘向内/外的扩展距离）            |
| **`bevelOffset`**    | `number`  | `0`        | 倒角起始偏移量（正值向外，负值向内）           |
| **`bevelSegments`**  | `number`  | `3`        | 倒角分段数（控制倒角平滑度）                   |

```js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// 1. 加载字体
const loader = new FontLoader();
loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  
  // 2. 创建文本几何体
  const geometry = new TextGeometry('Hello World', {
    font: font,            // 字体对象
    size: 5,               // 字号大小（单位：Three.js 单位）
    height: 2,             // 文字厚度（深度）
    curveSegments: 12,     // 曲线细分段数
    bevelEnabled: true,    // 启用倒角
    bevelThickness: 0.5,   // 倒角深度
    bevelSize: 0.2         // 倒角大小
  });
    textGeometry.center()

    // 因为有bevel，所以不是准确的中心
    textGeometry.translate(
        -(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
        -(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
        -(textGeometry.boundingBox.max.z - bevelThickness) * 0.5
    )
    console.log(textGeometry.boundingBox); // Box3
    
  // 3. 创建材质
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

  // 4. 生成网格并添加到场景
  const textMesh = new THREE.Mesh(geometry, material);
  scene.add(textMesh);
});
```

- BoundingBox

  像一个盒子罩住物体，用来描述物体的位置、边界

  实现居中 

  ```js
  textGeometry.center()
  //或 因为有bevel，所以不是准确的中心
  textGeometry.translate(
      -(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
      -(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
      -(textGeometry.boundingBox.max.z - bevelThickness) * 0.5
  )
  console.log(textGeometry.boundingBox); // Box3
  ```

  

## GO Live

将three项目托管到网络上

- Vercel 
- Netlify 
- GitHub Pages

### Vercel

[vercel](https://vercel.com/) 在package.json添加一个名为 `“deploy”` 的新脚本，执行 `“vercel --prod”` 
通过 `npm run deploy` 运行

```javascript
{
  "scripts": {
    // ...
    "deploy": "vercel --prod"
  },
}
```

### GitHub Pages

## Light

### 光源对比

| 光源类型             | 光照方式                  | 阴影支持 | 衰减 | 性能消耗 |
| :------------------- | :------------------------ | :------- | :--- | :------- |
| **AmbientLight**     | 环境光（均匀无方向）      | ❌        | ❌    | 最低     |
| **DirectionalLight** | 平行光（类似太阳光）      | ✅        | ❌    | 中       |
| **HemisphereLight**  | 半球光（天空+地面环境光） | ❌        | ❌    | 低       |
| **PointLight**       | 点光源（向四周发射）      | ✅        | ✅    | 高       |
| **RectAreaLight**    | 矩形区域光（平面均匀光）  | ✅        | ❌    | 高       |
| **SpotLight**        | 聚光灯（锥形光束）        | ✅        | ✅    | 最高     |
| **LightProbe**       | 环境探针（基于图像照明）  | ❌        | ❌    | 中       |

### AmientLight 

**`AmbientLight`（环境光）** 是一种全局均匀的光源，用于为整个场景提供基础照明。

环境光会从各个方向照射，因此得到均匀的结果。每个部位都是一样的，没有阴影。可以用于模拟光线的反射，看清物体的背面

| 参数名          | 类型          | 默认值     | 说明                                                         |
| :-------------- | :------------ | :--------- | :----------------------------------------------------------- |
| **`color`**     | `THREE.Color` | `0xffffff` | 光色（十六进制或CSS颜色字符串，如 `'#ff0000'` 或 `'rgb(255,0,0)'`） |
| **`intensity`** | `number`      | `1`        | 光照强度（`0.0` 无光 ~ `1.0` 最大强度）                      |

```js
// 创建白色环境光，强度为0.5
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);	
```

### DirectionalLight

**`DirectionalLight`（平行光）** 是一种模拟无限远处平行光源（如太阳光）的照明方式，能够投射清晰的阴影和产生明确的明暗对比。

光线从同一个方向来，光线也是平行的。照射到模型上，只会照亮特定的部分。默认会照向场景中心

| **参数/属性**        | **类型**                   | **默认值**             | **说明**                                                    |
| :------------------- | :------------------------- | :--------------------- | :---------------------------------------------------------- |
| **`color`**          | `THREE.Color`              | `0xffffff`             | 光色（十六进制或 CSS 颜色）                                 |
| **`intensity`**      | `number`                   | `1`                    | 光照强度（`0.0` 无光 ~ `1.0` 最大强度）                     |
| **`position`**       | `THREE.Vector3`            | `(0, 0, 0)`            | 光源位置（世界坐标系）                                      |
| **`target`**         | `THREE.Object3D`           | `new THREE.Object3D()` | 光线照射目标（默认指向原点）                                |
| **`shadow.camera`**  | `THREE.OrthographicCamera` | -                      | 控制阴影渲染范围的正交相机                                  |
| **`shadow.mapSize`** | `{width, height}`          | `512x512`              | 阴影贴图分辨率（值越高越清晰，性能消耗越大）                |
| **`shadow.radius`**  | `number`                   | `1`                    | 阴影边缘模糊半径（需开启 `renderer.shadowMap.soft = true`） |

```js
const sunLight = new THREE.DirectionalLight(0xffeedd, 0.8);
sunLight.position.set(50, 50, 50); // 模拟太阳高角度照射
sunLight.target.position.set(0, 0, 0); // 照射场景中心
scene.add(sunLight);
scene.add(sunLight.target);
```

directionalLightHelper

```js
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)
```



### HemisphereLight

**`HemisphereLight`（半球光）** 是一种模拟自然环境中 **天空与地面颜色渐变** 的全局光源，特别适合户外场景的照明。

光线像环境光从各个方向来，顶部为一个颜色，底部另一个颜色，中间部分为混合颜色。

| **参数/属性**     | **类型**        | **默认值**  | **说明**                                 |
| :---------------- | :-------------- | :---------- | :--------------------------------------- |
| **`skyColor`**    | `THREE.Color`   | `0xffffff`  | 天空颜色（来自上方的光照色）             |
| **`groundColor`** | `THREE.Color`   | `0xffffff`  | 地面颜色（来自下方的反射色）             |
| **`intensity`**   | `number`        | `1`         | 光照强度（`0.0` 无光 ~ `1.0` 最大强度）  |
| **`position`**    | `THREE.Vector3` | `(0, 0, 0)` | 光源位置（对光照方向无影响，仅用于调试） |

```js
// 天花板白光 + 地板暖光
const roomLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFE4C4, 0.5);
scene.add(roomLight);
```

hemisphereLightHelper

```js
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)
```



### PointLight

**`PointLight`（点光源）** 是一种模拟从一个点向所有方向均匀发散的光源（如灯泡、蜡烛或爆炸效果），支持动态阴影和光线衰减。

| **参数/属性**        | **类型**                  | **默认值**  | **说明**                                                     |
| :------------------- | :------------------------ | :---------- | :----------------------------------------------------------- |
| **`color`**          | `THREE.Color`             | `0xffffff`  | 光色（十六进制或 CSS 颜色）                                  |
| **`intensity`**      | `number`                  | `1`         | 光照强度（`0.0` 无光 ~ `1.0` 最大强度）                      |
| **`distance`**       | `number`                  | `0`         | 光线照射的最大距离（`0` 表示无限远）                         |
| **`decay`**          | `number`                  | `2`         | 衰减系数（`0` 无衰减，`1` 物理正确衰减，`2` 默认快速衰减）   |
| **`position`**       | `THREE.Vector3`           | `(0, 0, 0)` | 光源位置（世界坐标系）                                       |
| **`shadow.camera`**  | `THREE.PerspectiveCamera` | -           | 控制阴影渲染范围的透视相机                                   |
| **`shadow.mapSize`** | `{width, height}`         | `512x512`   | 阴影贴图分辨率（建议设为 2 的幂次方，如 512x512、1024x1024） |
| **`shadow.radius`**  | `number`                  | `1`         | 阴影边缘模糊半径（需开启 `renderer.shadowMap.soft = true`）  |

- 光线衰减公式

  光照强度随距离 `d` 的衰减公式：
  **`intensity = (light.intensity) / (1 + light.decay * d)`**
  当 `distance > 0` 时，超过该距离后光照强度为 `0`。

灯泡效果

```js
const bulbLight = new THREE.PointLight(0xffffee, 1, 20, 1);
bulbLight.position.set(0, 3, 0);
bulbLight.castShadow = true;
scene.add(bulbLight);

// 添加灯泡模型（可选）
const bulbGeometry = new THREE.SphereGeometry(0.2, 16, 8);
const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffee });
const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
bulbLight.add(bulbMesh); // 将灯泡模型附加到光源
```

pointLightHepler

```js
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)
```



### RectAreaLight

**`RectAreaLight`（矩形区域光）** 是一种模拟 **平面矩形区域均匀发光** 的光源（如 LED 面板、窗户透光或软灯箱），能够产生柔和的阴影和自然的光照衰减。像摄影棚里的一样，一个平面朝一个方向照射

不支持阴影，只支持 MeshStandardMaterial 和 MeshPhysicalMaterial 两种材质

| **参数/属性**   | **类型**        | **默认值**            | **说明**                                       |
| :-------------- | :-------------- | :-------------------- | :--------------------------------------------- |
| **`color`**     | `THREE.Color`   | `0xffffff`            | 光色（十六进制或 CSS 颜色）                    |
| **`intensity`** | `number`        | `1`                   | 光照强度（通常需要较高值，如 `5~10`）          |
| **`width`**     | `number`        | `10`                  | 光源宽度（沿 X 轴）                            |
| **`height`**    | `number`        | `10`                  | 光源高度（沿 Y 轴）                            |
| **`position`**  | `THREE.Vector3` | `(0, 0, 0)`           | 光源位置（矩形中心点）                         |
| **`rotation`**  | `THREE.Euler`   | `(0, 0, 0)`           | 光源旋转角度（调整发光方向）                   |
| **`power`**     | `number`        | 根据 `intensity` 计算 | 光源总功率（流明），修改时自动更新 `intensity` |

```js
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0))
```



rectAreaLightHelper

```js
import {
    RectAreaLightHelper
} from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
```



### SpotLight

**`SpotLight`（聚光灯）** 是一种模拟 **定向锥形光束** 的光源（如舞台聚光灯、手电筒或车灯），支持动态阴影和光线衰减。像手电筒一样

| **参数/属性**       | **类型**                  | **默认值**             | **说明**                                                   |
| :------------------ | :------------------------ | :--------------------- | :--------------------------------------------------------- |
| **`color`**         | `THREE.Color`             | `0xffffff`             | 光色（十六进制或 CSS 颜色）                                |
| **`intensity`**     | `number`                  | `1`                    | 光照强度（`0.0` 无光 ~ `1.0` 最大强度）                    |
| **`distance`**      | `number`                  | `0`                    | 光线照射的最大距离（`0` 表示无限远）                       |
| **`angle`**         | `number`                  | `Math.PI/3`            | 光束锥角（弧度制，如 `Math.PI/6` = 30度）                  |
| **`penumbra`**      | `number`                  | `0`                    | 边缘衰减系数（`0` 锐利边缘，`1` 完全柔和）                 |
| **`decay`**         | `number`                  | `2`                    | 衰减系数（`0` 无衰减，`1` 物理正确衰减，`2` 默认快速衰减） |
| **`position`**      | `THREE.Vector3`           | `(0, 0, 0)`            | 光源位置（世界坐标系）                                     |
| **`target`**        | `THREE.Object3D`          | `new THREE.Object3D()` | 光线照射目标（默认指向原点）                               |
| **`shadow.camera`** | `THREE.PerspectiveCamera` | -                      | 控制阴影渲染范围的透视相机                                 |

```js
// 参数：颜色，强度，照射距离，锥角（弧度），边缘衰减
const light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI/6, 0.5, 1);
light.position.set(5, 5, 5);   // 光源位置
light.target.position.set(0, 0, 0); // 照射目标
scene.add(light);
scene.add(light.target);       // 必须将 target 加入场景
```

spotLightHelper

```js
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
```

### baking

光照烘焙，将光线添加到贴图中

LightHelper

## Shadow

当执行一次渲染时，Three.js 将首先为应该投射阴影的每个光源执行一次渲染。这些渲染将模拟光线所看到的，就好像它是摄像机一样。在这些光源渲染期间，[MeshDepthMaterial](https://threejs.org/docs/index.html#api/en/materials/MeshDepthMaterial) 会替换所有网格材质。结果将存储为纹理和命名阴影贴图。您不会直接看到这些阴影贴图，但它们将用于应该接收阴影并投影到几何体上的每种材质上。 [examples](https://threejs.org/examples/webgl_shadowmap_viewer.html)

只有三种光源支持阴影效果 `PointLight` `DirectionalLight` `SpotLight`

```js
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;       // 启用阴影
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 阴影类型（柔和边缘）
```

shadowMap.type

- `THREE.BasicShadowMap`：基础阴影（锯齿明显，性能最好）。
- `THREE.PCFShadowMap`：抗锯齿阴影（边缘稍柔和）（默认）。
- `THREE.PCFSoftShadowMap`：更柔和的抗锯齿阴影（推荐）。

### DirectionalLightShadow



### SpotLightShadow



### PointLightShadow



### Baking Shadow

雪の進軍　氷を踏んで
何處が河やら　道さへ知れず
馬は斃れる　捨ててもおけず
此處は何處ぞ　皆敵の国
儘よ大膽　一服やれば
頼み少なや　莨が二本