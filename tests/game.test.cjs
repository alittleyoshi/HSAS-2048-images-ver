const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function context(storage) {
 const c=vm.createContext({window:{localStorage:storage},console});
 for(const name of ['grid','tile','local_storage_manager','game_manager']) vm.runInContext(fs.readFileSync('js/'+name+'.js','utf8'),c);
 vm.runInContext(`class Input { on(){} } class Actuator { actuate(){} continueGame(){} } var game=new GameManager(4,Input,Actuator,LocalStorageManager);`,c);
 return c;
}
function run(code) { const c=context(); return vm.runInContext(code,c); }
test('four equal tiles merge once each, with original scoring and one spawn',()=>{
 assert.equal(run(`game.grid=new Grid(4); [0,1,2,3].forEach(x=>game.grid.insertTile(new Tile({x,y:0},2))); game.move(3); game.score===8 && game.grid.cells[0][0].value===4 && game.grid.cells[1][0].value===4 && game.grid.availableCells().length===13`),true);
});
test('all four directions merge toward correct edge',()=>{
 for(const d of [0,1,2,3]) assert.equal(run(`game.grid=new Grid(4); game.grid.insertTile(new Tile({x:1,y:1},2)); game.grid.insertTile(new Tile(${d%2?' {x:2,y:1}':'{x:1,y:2}'},2)); game.move(${d}); game.score===4 && game.grid.cellContent(${['{x:1,y:0}','{x:3,y:1}','{x:1,y:3}','{x:0,y:1}'][d]}).value===4`),true);
});
test('undo restores board and score exactly and can only be used once',()=>assert.equal(run(`var before=JSON.stringify(game.serialize()); game.move(3); if(!game.previousState) game.move(1); game.undo(); JSON.stringify(game.serialize())===before && game.previousState===null`),true));
test('invalid movement neither spawns nor overwrites undo',()=>assert.equal(run(`game.grid=new Grid(4); game.grid.insertTile(new Tile({x:0,y:0},2)); var before=JSON.stringify(game.serialize()); game.move(3); JSON.stringify(game.serialize())===before && game.previousState===null`),true));
test('2048 wins, continuation persists, restart resets and supports next win',()=>assert.equal(run(`function win(){game.grid=new Grid(4);game.grid.insertTile(new Tile({x:0,y:0},1024));game.grid.insertTile(new Tile({x:1,y:0},1024));game.move(3);} win(); var stopped=game.isGameTerminated(); game.continuePlaying(); var continued=!game.isGameTerminated() && game.storageManager.getGameState().keepPlaying; game.restart();win();game.continuePlaying(); stopped && continued && !game.isGameTerminated()`),true));
test('full checkerboard loses but adjacent equal tiles remain playable',()=>assert.equal(run(`game.grid=new Grid(4);game.grid.eachCell((x,y)=>game.grid.insertTile(new Tile({x,y},(x+y)%2?2:4))); var blocked=!game.movesAvailable();game.grid.cells[0][0].value=2;blocked && game.movesAvailable()`),true));
test('save reload and best score survive restart',()=>assert.equal(run(`game.score=128;game.actuate();var saved=JSON.stringify(game.serialize());game.setup();var restored=JSON.stringify(game.serialize())===saved;game.restart();restored && game.score===0 && game.storageManager.getBestScore()===128`),true));
test('corrupt storage and malformed boards recover safely',()=>{
 const c=context();
 assert.equal(vm.runInContext(`game.storageManager.storage.setItem('gameState','{broken'); var a=game.storageManager.getGameState()===null;game.storageManager.storage.setItem('gameState',JSON.stringify({grid:{size:4,cells:[]},score:0}));a && game.storageManager.getGameState()===null`,c),true);
});
test('blocked localStorage falls back to in-memory play',()=>{ const storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};const c=context(storage);assert.equal(vm.runInContext('game.grid.availableCells().length===14 && !game.storageManager.persistent',c),true);});
