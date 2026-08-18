import * as THREE from 'three'
import { createCamera } from './camera.js'
import { createLights } from './lights.js'
import { createParticles } from './particles.js'
import { buildSignatureObject, buildFragments, buildShadowBlob } from './objects.js'
import { isWebGLAvailable } from './webgl.js'

/**
 * Main hero 3D scene for MiniLemon Cafe.
 *
 * Renders the signature product (cup + soft-serve swirl + lemon garnish),
 * a soft contact shadow, orbiting citrus fragments and a sparse sparkle
 * particle field. Scroll progress (0→1 across the hero section) drives
 * object/camera motion; desktop pointer movement adds a subtle parallax
 * offset on top of that. Rendering pauses automatically when the canvas
 * is off-screen or the tab is hidden.
 */
export function createHeroScene(container) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isSmallScreen = window.innerWidth < 720
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  if (!isWebGLAvailable()) {
    container.classList.add('webgl-unavailable')
    return { setProgress() {}, destroy() {} }
  }

  const scene = new THREE.Scene()
  const camera = createCamera(container)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 2))
  container.appendChild(renderer.domElement)

  createLights(scene)

  // ---- Signature product object ----
  const product = buildSignatureObject(isSmallScreen)
  const baseX = isSmallScreen ? 0 : 3.6
  const baseY = isSmallScreen ? 3.4 : 0.6
  const baseZ = isSmallScreen ? -3.5 : -1.5
  product.position.set(baseX, baseY, baseZ)
  const baseScale = isSmallScreen ? 0.5 : 0.72
  product.scale.setScalar(baseScale)
  scene.add(product)

  const shadowBlob = buildShadowBlob()
  shadowBlob.position.set(baseX, baseY - 1.35, baseZ)
  shadowBlob.scale.setScalar(baseScale)
  scene.add(shadowBlob)

  const fragments = buildFragments(isSmallScreen)
  fragments.forEach((f) => scene.add(f))

  const particles = createParticles(prefersReducedMotion ? 0 : isSmallScreen ? 18 : 46)
  if (particles) scene.add(particles.points)

  // ---- Scroll-driven progress (0 -> 1 across the hero section) ----
  let progress = 0
  let targetProgress = 0
  function setProgress(p) {
    targetProgress = THREE.MathUtils.clamp(p, 0, 1)
  }

  // ---- Desktop mouse parallax (disabled on touch / reduced motion) ----
  const mouseEnabled = hasFinePointer && !isSmallScreen && !prefersReducedMotion
  let mouseTarget = { x: 0, y: 0 }
  let mouseCurrent = { x: 0, y: 0 }
  function handlePointerMove(e) {
    mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseTarget.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  if (mouseEnabled) window.addEventListener('pointermove', handlePointerMove, { passive: true })

  // ---- Visibility-based pause (perf: skip work when off-screen / tab hidden) ----
  let isVisible = true
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => { isVisible = entry.isIntersecting })
    },
    { threshold: 0 }
  )
  intersectionObserver.observe(container)

  let isPageVisible = !document.hidden
  function handleVisibilityChange() { isPageVisible = !document.hidden }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // ---- Resize ----
  function handleResize() {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)

  // ---- Animation loop ----
  let rafId = null
  const clock = new THREE.Clock()

  function tick() {
    rafId = requestAnimationFrame(tick)
    const dt = Math.min(clock.getDelta(), 0.05)
    if (!isVisible || !isPageVisible) return

    progress += (targetProgress - progress) * Math.min(dt * 6, 1)
    if (mouseEnabled) {
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * Math.min(dt * 3, 1)
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * Math.min(dt * 3, 1)
    }

    const t = clock.elapsedTime
    const idleSpin = prefersReducedMotion ? 0 : t * 0.05
    const floatY = prefersReducedMotion ? 0 : Math.sin(t * 0.6) * 0.08

    product.rotation.y = progress * Math.PI * 2.4 + idleSpin + mouseCurrent.x * 0.18
    product.rotation.x = progress * 0.6 + mouseCurrent.y * -0.08
    product.rotation.z = mouseCurrent.x * 0.03
    product.position.y = baseY - progress * 1.1 + floatY + mouseCurrent.y * 0.06
    product.position.x = baseX - progress * 1.4 + mouseCurrent.x * 0.12
    product.scale.setScalar(baseScale * (1 - progress * 0.3))

    shadowBlob.position.x = product.position.x
    shadowBlob.position.y = baseY - 1.35 - progress * 1.1
    shadowBlob.material.opacity = Math.max(0, 0.85 - progress * 0.6) * (0.4 + Math.sin(t * 0.6) * -0.05)
    shadowBlob.scale.setScalar(baseScale * (1 - progress * 0.3) * (1 - Math.abs(floatY) * 0.6))

    camera.position.x = Math.sin(progress * 0.8) * 0.6 + (mouseEnabled ? mouseCurrent.x * 0.15 : 0)
    camera.position.y = mouseEnabled ? mouseCurrent.y * -0.1 : 0
    camera.position.z = 11 - progress * 1.5
    camera.lookAt(0, -progress * 0.6, 0)

    fragments.forEach((f, i) => {
      const a = f.userData.baseAngle + progress * 1.2 + (prefersReducedMotion ? 0 : t * 0.08)
      f.position.x = Math.cos(a) * 3.4
      f.position.y = Math.sin(a) * 1.6
      f.rotation.z = a
    })

    if (particles) particles.update(dt)

    renderer.render(scene, camera)
  }
  tick()

  function destroy() {
    cancelAnimationFrame(rafId)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    if (mouseEnabled) window.removeEventListener('pointermove', handlePointerMove)
    if (particles) particles.dispose()
    if (shadowBlob.userData.dispose) shadowBlob.userData.dispose()
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    })
    renderer.dispose()
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
  }

  return { setProgress, destroy }
}

/**
 * Small, self-contained accent scene reused wherever the signature product
 * needs to reappear on its own — currently the Contact section's cinematic
 * ending ("3D MiniLemon object kembali terlihat"). Gently auto-rotating,
 * no scroll/mouse coupling. Pauses rendering via IntersectionObserver when
 * scrolled out of view.
 */
export function createMiniProductScene(container) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isWebGLAvailable()) {
    container.classList.add('webgl-unavailable')
    return { destroy() {} }
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, container.clientWidth / container.clientHeight, 0.1, 20)
  camera.position.set(0, 0.2, 5.4)
  camera.lookAt(0, 0.2, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  container.appendChild(renderer.domElement)

  createLights(scene)
  const product = buildSignatureObject(true)
  product.scale.setScalar(0.85)
  scene.add(product)

  const shadowBlob = buildShadowBlob()
  shadowBlob.position.y = -1.55
  shadowBlob.scale.setScalar(0.7)
  scene.add(shadowBlob)

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
  function tick() {
    rafId = requestAnimationFrame(tick)
    const dt = Math.min(clock.getDelta(), 0.05)
    if (!isVisible) return
    if (!prefersReducedMotion) {
      product.rotation.y += dt * 0.35
      product.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.1
    }
    renderer.render(scene, camera)
  }
  tick()

  function destroy() {
    cancelAnimationFrame(rafId)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    if (shadowBlob.userData.dispose) shadowBlob.userData.dispose()
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    })
    renderer.dispose()
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
  }

  return { destroy }
}
