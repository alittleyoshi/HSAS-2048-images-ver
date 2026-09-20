window.fakeStorage = {
  _data: {},
  setItem: function (key, value) { this._data[key] = String(value); },
  getItem: function (key) { return this._data[key] || null; },
  removeItem: function (key) { delete this._data[key]; }
};
function LocalStorageManager() {
  this.bestScoreKey = 'bestScore';
  this.gameStateKey = 'gameState';
  this.persistent = false;
  var backend = window.fakeStorage;
  try {
    var candidate = window.localStorage;
    candidate.setItem('hsasStorageTest','1');
    candidate.removeItem('hsasStorageTest');
    backend = candidate;
    this.persistent = true;
  } catch (error) { /* Private mode may disallow storage entirely. */ }
  var self=this;
  this.storage = {};
  ['getItem','setItem','removeItem'].forEach(function (method) {
    self.storage[method] = function () {
      try { return backend[method].apply(backend, arguments); }
      catch (error) { self.persistent=false; backend=window.fakeStorage; return backend[method].apply(backend,arguments); }
    };
  });
}
LocalStorageManager.prototype.getBestScore = function () { return Number(this.storage.getItem(this.bestScoreKey)) || 0; };
LocalStorageManager.prototype.setBestScore = function (score) { this.storage.setItem(this.bestScoreKey,score); };
LocalStorageManager.prototype.getGameState = function () {
  try {
    var state=JSON.parse(this.storage.getItem(this.gameStateKey));
    if (!state || !state.grid || state.grid.size!==4 || !Array.isArray(state.grid.cells) || state.grid.cells.length!==4 || !Number.isFinite(state.score) || state.score<0) return null;
    var valid=state.grid.cells.every(function (column,x) {
      return Array.isArray(column) && column.length===4 && column.every(function (tile,y) {
        return tile===null || (tile && tile.position && tile.position.x===x && tile.position.y===y && Number.isSafeInteger(tile.value) && tile.value>=2 && Number.isInteger(Math.log2(tile.value)));
      });
    });
    return valid ? state : null;
  } catch (error) { return null; }
};
LocalStorageManager.prototype.setGameState = function (state) { this.storage.setItem(this.gameStateKey,JSON.stringify(state)); };
LocalStorageManager.prototype.clearGameState = function () { this.storage.removeItem(this.gameStateKey); };
LocalStorageManager.prototype.clearHistory = function () { this.clearGameState(); this.storage.removeItem(this.bestScoreKey); };
