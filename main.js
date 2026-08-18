import './style.css'
import { createHeroScene, createMiniProductScene } from './three/scene.js'
import { createMenuCarouselScene } from './three/menuCarousel.js'
import { initScrollAnimations } from './animations/scrollAnimations.js'
import { renderMenu } from './sections/menu.js'
import { renderStory } from './sections/story.js'
import { renderPartnership, renderLocation, renderContact } from './sections/misc.js'
import { MENU_ITEMS } from './data/content.js'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- Render data-driven sections ----------
renderMenu()
renderStory()
renderPartnership()
renderLocation()
renderContact()

// ---------- Nav: mobile toggle ----------
const navToggle = document.getElementById('nav-toggle')
const navMenu = document.getElementById('nav-menu')
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open')
  navToggle.setAttribute('aria-expanded', String(isOpen))
})
navMenu.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navMenu.classList.remove('is-open')
    navToggle.setAttribute('aria-expanded', 'false')
  })
)

document.getElementById('scroll-cue').addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
})

// ---------- 3D scenes ----------
const heroCanvasEl = document.getElementById('hero-canvas')
const heroScene = createHeroScene(heroCanvasEl)

// Menu: 3D product showcase — carousel rotates as the user scrolls through
// the Menu section, bringing each photographed item to the front in turn.
const menuStageEl = document.getElementById('menu-stage-canvas')
const menuStageCaptionEl = document.getElementById('menu-stage-caption')
const menuItemsWithPhoto = MENU_ITEMS.filter((item) => item.image)
const menuCarouselScene = menuStageEl
  ? createMenuCarouselScene(menuStageEl, menuItemsWithPhoto, {
      onActiveChange: (item) => {
        if (menuStageCaptionEl) menuStageCaptionEl.textContent = item.name
      },
    })
  : null

// Contact: the signature product reappears for a cinematic ending.
const contactCanvasEl = document.getElementById('contact-canvas')
const contactScene = contactCanvasEl ? createMiniProductScene(contactCanvasEl) : null

// ---------- Scroll-driven animation wiring ----------
initScrollAnimations({ heroScene, menuCarouselScene, contactScene })

// ---------- Cleanup on unload (avoids leaks during HMR / SPA nav) ----------
window.addEventListener('beforeunload', () => {
  heroScene.destroy()
  if (menuCarouselScene) menuCarouselScene.destroy()
  if (contactScene) contactScene.destroy()
})
