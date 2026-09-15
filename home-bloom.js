(() => {
  const button = document.querySelector('#bloom-motion');
  const primary = document.querySelector('#motion');
  if (!button || !primary) return;
  const sync = () => {
    const isPaused = document.documentElement.classList.contains('paused');
    const label = isPaused ? 'Play animations' : 'Pause animations';
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(isPaused));
    button.title = label;
    button.innerHTML = primary.innerHTML;
  };
  button.addEventListener('click', () => primary.click());
  new MutationObserver(sync).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  sync();
})();
