function KeyboardInputManager() {
  this.events = {};
  this.listen();
}
KeyboardInputManager.prototype.on = function (event, callback) {
  (this.events[event] || (this.events[event] = [])).push(callback);
};
KeyboardInputManager.prototype.emit = function (event, data) {
  (this.events[event] || []).forEach(function (callback) { callback(data); });
};
KeyboardInputManager.prototype.listen = function () {
  var self = this;
  var board = document.querySelector('.game-container');
  var restartDialog = document.querySelector('#restart-dialog');
  var helpDialog = document.querySelector('#help-dialog');
  var map = {ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3,w:0,d:1,s:2,a:3,k:0,l:1,j:2,h:3};
  document.addEventListener('keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || document.querySelector('dialog[open]')) return;
    if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
    var key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (map[key] !== undefined) { event.preventDefault(); self.emit('move', map[key]); }
    if (key === 'r') { event.preventDefault(); restartDialog.showModal(); }
    if (key === 'u') { event.preventDefault(); self.emit('undo'); }
  });
  function bind(selector, action) { document.querySelector(selector).addEventListener('click', action); }
  bind('.restart-button', function () { restartDialog.showModal(); });
  bind('.cancel-restart', function () { restartDialog.close(); });
  bind('.confirm-restart', function () { restartDialog.close(); self.emit('restart'); board.focus({preventScroll:true}); });
  bind('.retry-button', function () { self.emit('restart'); board.focus({preventScroll:true}); });
  bind('.keep-playing-button', function () { self.emit('keepPlaying'); board.focus({preventScroll:true}); });
  bind('.undo-button', function () { self.emit('undo'); });
  bind('.help-button', function () { helpDialog.showModal(); });
  bind('.dialog-close', function () { helpDialog.close(); });
  bind('.dialog-start', function () { helpDialog.close(); board.focus({preventScroll:true}); });
  var start = null;
  board.addEventListener('pointerdown', function (event) {
    if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return;
    start = {x:event.clientX, y:event.clientY, id:event.pointerId};
    board.setPointerCapture(event.pointerId);
  });
  board.addEventListener('pointerup', function (event) {
    if (!start || event.pointerId !== start.id) return;
    var dx=event.clientX-start.x, dy=event.clientY-start.y;
    start=null;
    if (Math.max(Math.abs(dx),Math.abs(dy)) > 20) self.emit('move', Math.abs(dx)>Math.abs(dy) ? (dx>0?1:3) : (dy>0?2:0));
  });
  board.addEventListener('pointercancel', function () { start=null; });
  board.addEventListener('lostpointercapture', function () { start=null; });
};
