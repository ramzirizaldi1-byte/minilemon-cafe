import { PARTNERSHIP, LOCATION, CONTACT } from '../data/content.js'

export function renderPartnership() {
  const el = document.getElementById('partnership-points')
  el.innerHTML = PARTNERSHIP.points
    .map(
      (p) => `
      <div class="partnership-point" data-reveal>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </div>`
    )
    .join('')
}

export function renderLocation() {
  document.getElementById('location-address').textContent = LOCATION.address
  document.getElementById('location-hours').textContent = `Jam operasional: ${LOCATION.hours}`
  const link = document.getElementById('maps-link')
  link.href = LOCATION.mapsUrl
}

export function renderContact() {
  const grid = document.getElementById('contact-grid')
  const entries = [
    { label: 'Instagram', value: CONTACT.instagram },
    { label: 'WhatsApp', value: CONTACT.whatsapp },
    { label: 'Email', value: CONTACT.email },
    { label: 'Google Maps', value: 'Lihat lokasi', href: document.getElementById('maps-link')?.href },
  ]
  grid.innerHTML = entries
    .map(
      (e) => `
      <a class="contact-item" href="${e.href || '#location'}" ${e.href ? 'target="_blank" rel="noopener"' : ''}>
        <span class="contact-item-label">${e.label}</span>
        <span class="contact-item-value">${e.value}</span>
      </a>`
    )
    .join('')
  document.getElementById('year').textContent = new Date().getFullYear()
}
