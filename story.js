import { STORY_TIMELINE } from '../data/content.js' 
 
export function renderStory() { 
  const listEl = document.getElementById('timeline-list') 
 
  listEl.innerHTML = STORY_TIMELINE.map( 
    (item) => ` 
    <li class="timeline-item"> 
      <span class="timeline-dot" aria-hidden="true"></span> 
      <span class="timeline-year">${item.year}</span> 
      <h3 class="timeline-title">${item.title}</h3> 
      <p class="timeline-text">${item.text}</p> 
    </li>` 
  ).join('') 
 
  const items = listEl.querySelectorAll('.timeline-item') 
  const io = new IntersectionObserver( 
    (entries) => { 
      entries.forEach((entry) => { 
        if (entry.isIntersecting) { 
          entry.target.classList.add('is-visible') 
          io.unobserve(entry.target) 
        } 
      }) 
    }, 
    { threshold: 0.3 } 
  ) 
  items.forEach((el) => io.observe(el)) 
 
  return { items } 
}
