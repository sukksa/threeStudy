import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'
import {
    TextGeometry
} from 'three/examples/jsm/geometries/TextGeometry.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

// fonts
const fontLoader = new FontLoader()
const font = fontLoader.load('/fonts/FZFW ZhuZi MinchoS B_Regular.json', (font) => {
    console.log('font loaded');
    const textGeometry = new TextGeometry(
        'にんげんになりたいですわ', {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 1,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 1,

        }
    )

    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     -textGeometry.boundingBox.max.x * 0.5,
    //     -textGeometry.boundingBox.max.y * 0.5,
    //     -textGeometry.boundingBox.max.z * 0.5
    // )
    textGeometry.center()
    // 因为有bevel，所以不是准确的中心
    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
    //     -(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
    //     -(textGeometry.boundingBox.max.z - bevelThickness) * 0.5
    // )


    console.log(textGeometry.boundingBox); // Box3
    // const textMaterial = new THREE.MeshBasicMaterial({
    //     // wireframe: true,
    //     // map: matcapTexture,
    //     map: matcapTexture,

    // })
    const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
    })
    const text = new THREE.Mesh(
        textGeometry,
        material
    )
    scene.add(text)
    console.time('donut')
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    // 使用相同的材质
    for (let i = 0; i < 200; i++) {

        const donut = new THREE.Mesh(donutGeometry, material)
        scene.add(donut)
        donut.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        let scale = Math.random()
        donut.scale.set(scale, scale, scale)
    }
    console.timeEnd('donut')
})

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)
const axesHeper = new THREE.AxesHelper()
// scene.add(axesHeper)
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()