import { MENU_CATEGORIES, MENU_ITEMS } from '../data/content.js'

export function renderMenu() {
  const tabsEl = document.getElementById('menu-tabs')
  const gridEl = document.getElementById('menu-grid')

  const allTabs = ['Semua', ...MENU_CATEGORIES]
  tabsEl.innerHTML = allTabs
    .map(
      (cat, i) =>
        `<button class="menu-tab${i === 0 ? ' active' : ''}" role="tab" aria-selected="${i === 0}" data-cat="${cat}">${cat}</button>`
    )
    .join('')

  function renderCards(category) {
    const items = category === 'Semua' ? MENU_ITEMS : MENU_ITEMS.filter((m) => m.category === category)
    gridEl.innerHTML = items
      .map(
        (item) => `
        <article class="menu-card">
          <div class="menu-card-media" aria-hidden="true">${
            item.image
              ? `<img src="${item.image}" alt="${item.name}" loading="lazy" />`
              : '[FOTO MENU]'
          }</div>
          <div class="menu-card-body">
            <h3 class="menu-card-name">${item.name}</h3>
            <p class="menu-card-desc">${item.desc}</p>
            <p class="menu-card-price">${item.price}</p>
          </div>
        </article>`
      )
      .join('')
    return gridEl.querySelectorAll('.menu-card')
  }

  let cards = renderCards('Semua')
  observeCards(cards)

  tabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-tab')
    if (!btn) return
    tabsEl.querySelectorAll('.menu-tab').forEach((t) => {
      t.classList.remove('active')
      t.setAttribute('aria-selected', 'false')
    })
    btn.classList.add('active')
    btn.setAttribute('aria-selected', 'true')
    cards = renderCards(btn.dataset.cat)
    observeCards(cards)
  })

  function observeCards(nodeList) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), i * 60)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    nodeList.forEach((card) => io.observe(card))
  }
}
