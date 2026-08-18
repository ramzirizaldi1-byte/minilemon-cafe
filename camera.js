import * as THREE from 'three'

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(32, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 11)
  return camera
}
