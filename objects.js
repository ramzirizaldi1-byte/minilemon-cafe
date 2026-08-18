import * as THREE from 'three'

/**
 * Builds the MiniLemon "signature" product object: a cup of soft-serve
 * ice cream with a citrus garnish on top. Built entirely from Three.js
 * primitives (cylinder, torus rings, cone, sphere) so no external
 * .glb/.gltf asset is required.
 *
 * @param {boolean} lowPoly - reduce segment counts for small screens
 */
export function buildSignatureObject(lowPoly) {
  const group = new THREE.Group()

  // ---- Cup body ----
  const cupSegments = lowPoly ? 16 : 32
  const cupGeo = new THREE.CylinderGeometry(0.95, 0.7, 1.3, cupSegments, 1, false)
  const cupMat = new THREE.MeshPhysicalMaterial({
    color: 0xfffdf8,
    roughness: 0.4,
    metalness: 0.04,
    clearcoat: lowPoly ? 0 : 0.5,
    clearcoatRoughness: 0.3,
  })
  const cup = new THREE.Mesh(cupGeo, cupMat)
  cup.position.y = -0.55
  group.add(cup)

  // ---- Brand stripe band ----
  const bandGeo = new THREE.CylinderGeometry(0.965, 0.965, 0.24, cupSegments, 1, true)
  const bandMat = new THREE.MeshStandardMaterial({
    color: 0xe7c948,
    roughness: 0.55,
    metalness: 0.02,
    side: THREE.DoubleSide,
  })
  const band = new THREE.Mesh(bandGeo, bandMat)
  band.position.y = -0.1
  group.add(band)

  // ---- Soft-serve swirl (stacked rings tapering to a tip) ----
  const swirlGroup = new THREE.Group()
  const swirlMat = new THREE.MeshStandardMaterial({ color: 0xfff9ec, roughness: 0.38, metalness: 0.02 })
  const ringCount = lowPoly ? 3 : 4
  const ringRadial = lowPoly ? 8 : 14
  const ringTubular = lowPoly ? 16 : 28
  let stackY = 0.18
  for (let i = 0; i < ringCount; i++) {
    const r = 0.76 - i * 0.15
    const torusGeo = new THREE.TorusGeometry(r, r * 0.44, ringRadial, ringTubular)
    const ring = new THREE.Mesh(torusGeo, swirlMat)
    ring.position.y = stackY
    ring.rotation.x = Math.PI / 2
    swirlGroup.add(ring)
    stackY += 0.26
  }
  const tipGeo = new THREE.ConeGeometry(0.22, 0.46, lowPoly ? 8 : 16)
  const tip = new THREE.Mesh(tipGeo, swirlMat)
  tip.position.y = stackY + 0.05
  swirlGroup.add(tip)
  group.add(swirlGroup)

  // ---- Lemon garnish ----
  const lemonGeo = new THREE.SphereGeometry(0.22, lowPoly ? 10 : 20, lowPoly ? 8 : 16)
  const lemonMat = new THREE.MeshStandardMaterial({ color: 0xe7c948, roughness: 0.42 })
  const lemon = new THREE.Mesh(lemonGeo, lemonMat)
  lemon.scale.set(1, 0.5, 1)
  lemon.position.set(0.38, stackY + 0.2, 0.16)
  group.add(lemon)

  const leafGeo = new THREE.ConeGeometry(0.13, 0.38, 8)
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x6b8f4e, roughness: 0.5 })
  const leaf = new THREE.Mesh(leafGeo, leafMat)
  leaf.position.set(0.38, stackY + 0.5, 0.16)
  leaf.rotation.z = 0.5
  group.add(leaf)

  group.userData.swirlGroup = swirlGroup
  group.userData.lemon = lemon
  return group
}

/** Faint orbiting citrus-slice fragments that drift around the hero object. */
export function buildFragments(lowPoly) {
  const mat = new THREE.MeshStandardMaterial({
    color: 0xf3ecd8,
    roughness: 0.6,
    transparent: true,
    opacity: 0.5,
  })
  const count = lowPoly ? 0 : 3
  const arr = []
  for (let i = 0; i < count; i++) {
    const geo = new THREE.CircleGeometry(0.32, 8)
    const m = new THREE.Mesh(geo, mat)
    const angle = (i / count) * Math.PI * 2
    m.position.set(Math.cos(angle) * 3.4, Math.sin(angle) * 1.6, -2 - i)
    m.userData.baseAngle = angle
    arr.push(m)
  }
  return arr
}

/** A soft blurred contact shadow beneath the object — cheaper than real-time shadow maps. */
export function buildShadowBlob() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(36,24,18,0.32)')
  grad.addColorStop(1, 'rgba(36,24,18,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  const geo = new THREE.PlaneGeometry(2.6, 2.6)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = -Math.PI / 2
  mesh.userData.dispose = () => {
    geo.dispose()
    mat.dispose()
    tex.dispose()
  }
  return mesh
}
