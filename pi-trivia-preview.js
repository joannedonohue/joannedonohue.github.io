document.querySelectorAll('.trivia-choices button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.trivia-choices button').forEach(option => {
      option.classList.remove('is-correct', 'is-incorrect');
      option.setAttribute('aria-pressed', String(option === button));
    });
    document.querySelector('[data-choice="A"]').classList.add('is-correct');
    if (button.dataset.choice !== 'A') button.classList.add('is-incorrect');
    document.querySelector('.trivia-feedback').textContent = button.dataset.choice === 'A' ? 'Correct! The Bluth banana stand.' : 'The answer is A: the Bluth banana stand.';
  });
});
