import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Nav swaps to light-on-dark styling while a dark section is in view. */
function initDarkNav() {
  const nav = document.getElementById('site-nav')
  const darkSections = document.querySelectorAll('.partnership, .contact')
  darkSections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top+=80',
      end: 'bottom top+=80',
      onEnter: () => nav.classList.add('on-dark'),
      onEnterBack: () => nav.classList.add('on-dark'),
      onLeave: () => nav.classList.remove('on-dark'),
      onLeaveBack: () => nav.classList.remove('on-dark'),
    })
  })
}

/** Generic [data-reveal] fade/scale-in, once per element. */
function initRevealObserver() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('is-visible'),
    })
  })
}

/**
 * Hero, pinned: the hero section stays in place for an extra ~1.2 viewport
 * heights of scroll while the 3D scene runs through its full journey —
 * camera drifting in, product rotating/scaling/sliding out of frame. The
 * copy and scroll-cue fade early; the canvas itself blurs/fades in the
 * final stretch as a cinematic wipe into "Tentang". This is what makes the
 * hero feel like scrolling *through* a scene instead of past a banner.
 */
function initHeroSceneTrigger(heroScene) {
  const heroContent = document.querySelector('.hero-content')
  const scrollCue = document.querySelector('.scroll-cue')
  const heroCanvas = document.querySelector('.hero-canvas')

  if (prefersReducedMotion) {
    // Keep the pin (still gives the 3D object time to be seen) but skip
    // the extra blur/fade choreography — motion stays minimal.
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: '+=40%',
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => heroScene.setProgress(self.progress),
    })
    return
  }

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: '+=120%',
    pin: true,
    pinSpacing: true,
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress
      heroScene.setProgress(p)

      const fadeP = Math.min(p / 0.55, 1)
      gsap.set(heroContent, { opacity: 1 - fadeP, y: -60 * fadeP })
      gsap.set(scrollCue, { opacity: 1 - Math.min(p / 0.2, 1) })

      const exitP = Math.max(0, (p - 0.72) / 0.28)
      gsap.set(heroCanvas, { filter: `blur(${exitP * 16}px)`, opacity: 1 - exitP * 0.92 })
    },
  })
}

/** Hero title: staggered cinematic entrance on load. */
function initHeroTitleEntrance() {
  document.querySelectorAll('.hero-title .line').forEach((line, i) => {
    gsap.from(line, {
      y: prefersReducedMotion ? 0 : 60,
      opacity: 0,
      duration: prefersReducedMotion ? 0.01 : 1,
      delay: prefersReducedMotion ? 0 : 0.15 * i,
      ease: 'power3.out',
    })
  })
}

/** About: parallax + a slight 3D tilt on the visual frame for depth. */
function initAboutParallax() {
  gsap.to('.about-visual-frame', {
    y: prefersReducedMotion ? 0 : -40,
    scale: prefersReducedMotion ? 1 : 1.04,
    rotateY: prefersReducedMotion ? 0 : -6,
    rotateX: prefersReducedMotion ? 0 : 2,
    transformPerspective: 900,
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true },
  })
  gsap.to('.about-visual-deco', {
    y: prefersReducedMotion ? 0 : 60,
    rotate: prefersReducedMotion ? 0 : 25,
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true },
  })
}

/** Story: fill the connecting line as the timeline is read. */
function initStoryTimelineFill() {
  gsap.to('#timeline-fill', {
    height: '100%',
    ease: 'none',
    scrollTrigger: { trigger: '#timeline', start: 'top 60%', end: 'bottom 70%', scrub: true },
  })
}

/**
 * Menu: ties the 3D showcase carousel's rotation to how far the user has
 * scrolled through the whole Menu section — one full lap of the carousel
 * per section scroll, so each product visibly takes its turn front-and-
 * center as scrolling continues.
 */
function initMenuCarouselTrigger(menuCarouselScene) {
  if (!menuCarouselScene) return
  ScrollTrigger.create({
    trigger: '#menu',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => menuCarouselScene.setProgress(self.progress),
  })
}

/** Kemitraan: floating depth-of-field circles behind the cards (the cards themselves already use the shared [data-reveal] entrance, kept untouched so their hover lift keeps working). */
function initPartnershipDepth() {
  gsap.to('.partnership-decor-1', {
    y: prefersReducedMotion ? 0 : -90,
    x: prefersReducedMotion ? 0 : 30,
    rotate: 20,
    scrollTrigger: { trigger: '.partnership', start: 'top bottom', end: 'bottom top', scrub: true },
  })
  gsap.to('.partnership-decor-2', {
    y: prefersReducedMotion ? 0 : 70,
    x: prefersReducedMotion ? 0 : -25,
    rotate: -18,
    scrollTrigger: { trigger: '.partnership', start: 'top bottom', end: 'bottom top', scrub: true },
  })
}

/**
 * Lokasi: a pin drops in first, then the map "zooms" into place (starts
 * scaled up + blurred, settles to normal) — a cheap but convincing stand-in
 * for a camera push-in toward the marker before the address details read.
 */
function initLocationCinema() {
  gsap.fromTo(
    '.location-pin',
    { y: prefersReducedMotion ? 0 : -70, autoAlpha: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.5 },
    {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      duration: prefersReducedMotion ? 0.01 : 0.9,
      ease: 'bounce.out',
      scrollTrigger: { trigger: '.location', start: 'top 65%', toggleActions: 'play none none reverse' },
    }
  )
  gsap.fromTo(
    '.location-map-embed',
    { scale: prefersReducedMotion ? 1 : 1.22, filter: prefersReducedMotion ? 'blur(0px)' : 'blur(8px)' },
    {
      scale: 1,
      filter: 'blur(0px)',
      scrollTrigger: { trigger: '.location', start: 'top bottom', end: 'top 40%', scrub: true },
    }
  )
}

/** Kontak: the signature-product canvas eases in from an oversized, faded state — a slow "camera pulling back" reveal. */
function initContactCinema() {
  gsap.fromTo(
    '#contact-canvas',
    { scale: prefersReducedMotion ? 1 : 1.4, autoAlpha: prefersReducedMotion ? 0.32 : 0 },
    {
      scale: 1,
      autoAlpha: 0.32,
      scrollTrigger: { trigger: '.contact', start: 'top 80%', end: 'top 30%', scrub: true },
    }
  )
}

/**
 * Generic cinematic arrival for every non-hero section: a soft scale +
 * blur + fade-in as it crosses into view, once. Keeps section-to-section
 * movement from reading like a plain page jump.
 */
function initSectionCinema() {
  const selectors = ['.about', '.menu', '.story', '.partnership', '.location', '.contact']
  selectors.forEach((sel) => {
    const el = document.querySelector(sel)
    if (!el) return
    gsap.fromTo(
      el,
      {
        autoAlpha: prefersReducedMotion ? 1 : 0,
        scale: prefersReducedMotion ? 1 : 0.965,
        filter: prefersReducedMotion ? 'blur(0px)' : 'blur(10px)',
      },
      {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: prefersReducedMotion ? 0.01 : 1.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      }
    )
  })
}

export function initScrollAnimations({ heroScene, menuCarouselScene, contactScene }) {
  initDarkNav()
  initSectionCinema()
  initRevealObserver()
  if (heroScene) initHeroSceneTrigger(heroScene)
  initHeroTitleEntrance()
  initAboutParallax()
  initStoryTimelineFill()
  initMenuCarouselTrigger(menuCarouselScene)
  initPartnershipDepth()
  initLocationCinema()
  if (contactScene) initContactCinema()

  // Recalculate ScrollTrigger positions once layout/fonts settle
  window.addEventListener('load', () => ScrollTrigger.refresh())
}
