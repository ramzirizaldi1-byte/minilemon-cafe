import * as THREE from 'three'
import { createLights } from './lights.js'
import { isWebGLAvailable } from './webgl.js'

/**
 * Menu "showcase" — a ring of textured product cards in 3D space.
 * Scroll progress through the Menu section (0→1) drives one full rotation
 * of the ring, bringing each product to the front in turn: it scales up,
 * brightens and calls back with its name so the caption underneath can
 * update — the 3D equivalent of "produk 1 muncul → rotate → produk 2
 * masuk → produk 1 mundur ke belakang → ...".
 *
 * Falls back to a hidden container (grid below still works) when WebGL
 * is unavailable or there are no items with photos to show.
 */
export function createMenuCarouselScene(container, items, { onActiveChange } = {}) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isSmallScreen = window.innerWidth < 720

  if (!isWebGLAvailable() || !items.length) {
    container.classList.add('webgl-unavailable')
    return { setProgress() {}, destroy() {} }
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 30)
  camera.position.set(0, 0.25, 7.4)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 2))
  container.appendChild(renderer.domElement)

  createLights(scene)

  const group = new THREE.Group()
  scene.add(group)

  const radius = isSmallScreen ? 2.5 : 3.3
  const cardW = isSmallScreen ? 1.75 : 2.2
  const cardH = cardW * 1.05
  const loader = new THREE.TextureLoader()

  const cards = items.map((item, i) => {
    const baseAngle = (i / items.length) * Math.PI * 2

    // Soft backing card for a bit of depth behind the photo plane.
    const backGeo = new THREE.PlaneGeometry(cardW * 1.08, cardH * 1.08)
    const backMat = new THREE.MeshStandardMaterial({ color: 0xfff8e6, roughness: 0.9 })
    const back = new THREE.Mesh(backGeo, backMat)
    back.position.z = -0.04

    const geo = new THREE.PlaneGeometry(cardW, cardH)
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.02, transparent: true })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.add(back)
    mesh.position.set(Math.sin(baseAngle) * radius, 0, Math.cos(baseAngle) * radius)
    mesh.userData.baseAngle = baseAngle
    mesh.userData.item = item
    group.add(mesh)

    loader.load(item.image, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      mat.map = tex
      mat.needsUpdate = true
    })

    return mesh
  })

  let progress = 0
  let targetProgress = 0
  function setProgress(p) {
    targetProgress = THREE.MathUtils.clamp(p, 0, 1)
  }

  let isVisible = false
  const intersectionObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => { isVisible = entry.isIntersecting }),
    { threshold: 0 }
  )
  intersectionObserver.observe(container)

  function handleResize() {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)

  let rafId = null
  const clock = new THREE.Clock()
  let lastActiveIndex = -1

  function tick() {
    rafId = requestAnimationFrame(tick)
    const dt = Math.min(clock.getDelta(), 0.05)
    if (!isVisible) return

    progress += (targetProgress - progress) * Math.min(dt * 5, 1)
    const idleSpin = prefersReducedMotion ? 0 : clock.elapsedTime * 0.035
    const rot = progress * Math.PI * 2 + idleSpin
    group.rotation.y = rot

    let bestFacing = -Infinity
    let activeIndex = 0
    cards.forEach((mesh, i) => {
      const worldAngle = mesh.userData.baseAngle + rot
      const facing = Math.cos(worldAngle) // 1 = facing camera, -1 = facing away
      const frontAmount = THREE.MathUtils.clamp((facing + 1) / 2, 0, 1)
      const scale = 0.68 + frontAmount * 0.42
      mesh.scale.setScalar(scale)
      mesh.material.opacity = 0.3 + frontAmount * 0.7
      if (facing > bestFacing) {
        bestFacing = facing
        activeIndex = i
      }
    })

    if (activeIndex !== lastActiveIndex) {
      lastActiveIndex = activeIndex
      if (onActiveChange) onActiveChange(cards[activeIndex].userData.item, activeIndex)
    }

    renderer.render(scene, camera)
  }
  tick()

  function destroy() {
    cancelAnimationFrame(rafId)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          if (m.map) m.map.dispose()
          m.dispose()
        })
      }
    })
    renderer.dispose()
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
  }

  return { setProgress, destroy }
}
