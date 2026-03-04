const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

canvas.width = MAP_W * TILE;
canvas.height = MAP_H * TILE;

let currentMap = map1;

// itens fase 1
const keyItem   = { x: TILE*3,  y: TILE*7,  w: 40, h: 40, picked:false };
const swordItem = { x: TILE*10, y: TILE*7,  w: 40, h: 60, picked:false };
const door      = { x: TILE*13, y: TILE*1,  w: TILE*2, h: TILE*2 };

function setMap(map){
  currentMap = map;
  if (map === map1) player.setSpawn(spawn.map1);
  if (map === map2) player.setSpawn(spawn.map2);
}

function isWallAt(px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
  return currentMap[ty][tx] === 1;
}

function canvasPointFromClient(e){
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (canvas.width / r.width),
    y: (e.clientY - r.top)  * (canvas.height / r.height)
  };
}


function isWallRect(x, y, w, h) {
  const left = x;
  const right = x + w - 1;
  const top = y;
  const bottom = y + h - 1;
  return (
    isWallAt(left, top) ||
    isWallAt(right, top) ||
    isWallAt(left, bottom) ||
    isWallAt(right, bottom)
  );
}

function moveAndCollide(dx, dy) {
  const nx = player.x + dx;
  if (!isWallRect(nx, player.y, player.w, player.h)) player.x = nx;

  const ny = player.y + dy;
  if (!isWallRect(player.x, ny, player.w, player.h)) player.y = ny;
}

function dist(a,b){
  const ax = a.x + (a.w||0)/2, ay = a.y + (a.h||0)/2;
  const bx = b.x + (b.w||0)/2, by = b.y + (b.h||0)/2;
  return Math.hypot(ax-bx, ay-by);
}

function drawMap(){
  for (let y=0; y<MAP_H; y++){
    for (let x=0; x<MAP_W; x++){
      const tile = currentMap[y][x];

      ctx.fillStyle = (x+y)%2===0 ? "#2a2a2a" : "#242424";
      ctx.fillRect(x*TILE, y*TILE, TILE, TILE);

      if (tile===1){
        ctx.fillStyle = "#444";
        ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
      }
    }
  }
}

function drawItems(){
  if (currentMap !== map1) return;

  // chave
  if (!keyItem.picked){
    if (assets.has("key")) ctx.drawImage(assets.get("key"), keyItem.x, keyItem.y, keyItem.w, keyItem.h);
    else { ctx.fillStyle="gold"; ctx.fillRect(keyItem.x, keyItem.y, 24, 24); }
  }

  // espada no chão
 if (!swordItem.picked) {
  const img = assets.get("sword");

  // escolhe 1 pose pra mostrar no chão
  const fx = 1, fy = 0;
  const sx = fx * SWORD_W;
  const sy = fy * SWORD_H;

  ctx.save();
  ctx.shadowColor = "purple";
  ctx.shadowBlur = 18;
  ctx.drawImage(img, sx, sy, SWORD_W, SWORD_H, swordItem.x, swordItem.y, 48, 48);
  ctx.restore();
}

  // porta
  ctx.save();
  ctx.shadowColor = "purple";
  ctx.shadowBlur = 18;
  if (assets.has("door")) ctx.drawImage(assets.get("door"), door.x, door.y, door.w, door.h);
  else { ctx.fillStyle="#8b4513"; ctx.fillRect(door.x, door.y, door.w, door.h); }
  ctx.restore();
}

function handleActions(){
  if (input.action){
    input.action = false;

    // fase 1
    if (currentMap === map1){

      // pegar chave
      if (!keyItem.picked && dist(player, keyItem) < 60){
        keyItem.picked = true;
        ui.setObjective("Agora pegue a espada ⚔️");
        return;
      }

      // pegar espada
      if (!swordItem.picked && dist(player, swordItem) < 70){
        swordItem.picked = true;
        player.hasSword = true;
        ui.setObjective("Vá até a porta 🚪");
        return;
      }

      // abrir porta -> fase 2 (horda) (exige chave)
      if (keyItem.picked && dist(player, door) < 95){
        setMap(map2);
        startHorde();
        ui.setObjective("Fase 2: Zombies 0/25 🧟");
        return;
      }
    }

    // reiniciar na fase 2 se venceu ou morreu
    if (currentMap === map2 && !horde.active){
      // reset player + horda
      player.hp = player.maxHp;
      player.invul = 0;
      setMap(map2);
      startHorde();
      ui.setObjective(`Fase 2: Zombies 0/${horde.goalKill} 🧟`);
      return;
    }
  }

  if (input.attack){
    input.attack = false;
    player.tryAttack();
  }
}

function update(){
  handleActions();

  // ✅ PAUSA TOTAL
  if (shop.open) {
    ui.setHP(player.hp, player.maxHp);
    return;
  }

  player.update();
  updateZombies();
  ui.setHP(player.hp, player.maxHp);
  // ... stats etc ...
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMap();
  drawItems();
  drawZombies(ctx);
  player.draw(ctx);
  shop.draw(ctx);
}

function gameLoop(){
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("pointerdown", (e) => {
  
  const r = canvas.getBoundingClientRect();
  const mx = (e.clientX - r.left) * (canvas.width / r.width);
  const my = (e.clientY - r.top) * (canvas.height / r.height);
  shop.handleClick(mx, my);
});