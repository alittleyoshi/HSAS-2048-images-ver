// All teacher imagery and ordering are preserved from the original HSAS edition.
for (var n=0;n<16;n++) {
  var cell=document.createElement('div');
  cell.className='grid-cell';
  document.querySelector('.grid-container').appendChild(cell);
}
for (var value=2;value<=2048;value*=2) {
  var figure=document.createElement('figure');
  figure.className='portrait';
  figure.dataset.value=value;
  var image=document.createElement('img');
  image.src='tile-sets/hsas/'+value+'.jpg';
  image.alt=value+' 分教师图片（沿用原作）';
  image.width=100; image.height=100;
  var caption=document.createElement('figcaption');
  caption.textContent=value;
  caption.appendChild(document.createElement('span'));
  figure.append(image,caption);
  document.querySelector('.collection-grid').appendChild(figure);
}
window.requestAnimationFrame(function () {
  var game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  var toggle = document.querySelector('.numbers-button');
  var enabled = game.storageManager.storage.getItem('hsasNumbers') === 'true';
  function renderNumbers() {
    document.body.classList.toggle('show-numbers', enabled);
    toggle.setAttribute('aria-pressed', String(enabled));
  }
  renderNumbers();
  toggle.addEventListener('click', function () {
    enabled = !enabled;
    renderNumbers();
    game.storageManager.storage.setItem('hsasNumbers', String(enabled));
  });
  if (!game.storageManager.persistent) {
    document.querySelector('.save-note').textContent='当前浏览器无法存档，本局仍可正常游玩';
  }
});
