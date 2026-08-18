/** Cheap WebGL support probe shared by every Three.js scene in this project. */
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch (e) {
    return false
  }
}
