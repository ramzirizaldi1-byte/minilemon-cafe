import * as THREE from 'three'

function makeSparkleTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,251,230,1)')
  grad.addColorStop(0.4, 'rgba(255,241,180,0.55)')
  grad.addColorStop(1, 'rgba(255,241,180,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

/**
 * Slow-drifting "lemon zest / sparkle" dust. Kept intentionally sparse —
 * this is a texture-forward performance trick (few particles, additive
 * blending, radial-gradient sprite), not a full GPU particle system.
 */
export function createParticles(count) {
  if (!count || count <= 0) return null

  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1
    speeds[i] = 0.08 + Math.random() * 0.16
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const tex = makeSparkleTexture()
  const mat = new THREE.PointsMaterial({
    size: 0.11,
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.75,
  })
  const points = new THREE.Points(geo, mat)

  function update(dt) {
    const pos = geo.attributes.position
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * dt
      if (y > 3) y = -3
      pos.setY(i, y)
    }
    pos.needsUpdate = true
  }

  function dispose() {
    geo.dispose()
    mat.dispose()
    tex.dispose()
  }

  return { points, update, dispose }
}
