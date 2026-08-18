import * as THREE from 'three'

/**
 * Premium, cafe-warm lighting rig. No shadow maps (kept cheap on purpose —
 * the contact-shadow blob in objects.js fakes grounding instead).
 */
export function createLights(scene) {
  const hemi = new THREE.HemisphereLight(0xfff6dc, 0x3c281c, 0.55)
  scene.add(hemi)

  const key = new THREE.DirectionalLight(0xfff6dc, 1.3)
  key.position.set(4, 6, 5)
  scene.add(key)

  const rim = new THREE.DirectionalLight(0x8fb56a, 0.4)
  rim.position.set(-5, -2, -4)
  scene.add(rim)

  // Warm point light near the object for a soft specular highlight / glow
  const glow = new THREE.PointLight(0xffe8a3, 0.7, 9, 2)
  glow.position.set(1.6, 1.1, 2.6)
  scene.add(glow)

  return { hemi, key, rim, glow }
}
