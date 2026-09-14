const motionButton = document.querySelector('#motion');
let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setMotion() {
  document.documentElement.classList.toggle('paused', paused);
  motionButton.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="' + (paused ? 'M4 2l10 6-10 6z' : 'M4 2h3v12H4zM9 2h3v12H9z') + '"/></svg>';
  const label = paused ? 'Play animation' : 'Pause animation';
  motionButton.setAttribute('aria-label', label);
  motionButton.title = label;
  motionButton.setAttribute('aria-pressed', String(paused));
}
motionButton.addEventListener('click', () => { paused = !paused; setMotion(); });
setMotion();
document.querySelector('#year').textContent = new Date().getFullYear();
const rail = document.querySelector('.feature-rail');
if (rail) {
  const step = () => rail.querySelector('.feature-card').getBoundingClientRect().width + 24;
  document.querySelector('.rail-prev').addEventListener('click', () => rail.scrollBy({left:-step(), behavior:paused?'instant':'smooth'}));
  document.querySelector('.rail-next').addEventListener('click', () => rail.scrollBy({left:step(), behavior:paused?'instant':'smooth'}));
  let interacting = false, lastTime = 0;
  rail.addEventListener('pointerenter', () => interacting = true);
  rail.addEventListener('pointerleave', () => interacting = false);
  rail.addEventListener('focusin', () => interacting = true);
  rail.addEventListener('focusout', () => interacting = false);
  rail.addEventListener('touchstart', () => interacting = true, {passive:true});
  const observer = new IntersectionObserver(entries => rail.dataset.visible = String(entries[0].isIntersecting));
  observer.observe(rail);
  function drift(time) {
    if(lastTime && !paused && !interacting && rail.dataset.visible === 'true' && !document.hidden) {
      const end = rail.scrollWidth - rail.clientWidth;
      if(rail.scrollLeft < end-1) rail.scrollLeft += Math.min(time-lastTime,50)*.022;
    }
    lastTime=time;requestAnimationFrame(drift);
  }
  requestAnimationFrame(drift);
}
