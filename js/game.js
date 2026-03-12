const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

canvas.width = MAP_W * TILE;
canvas.height = MAP_H * TILE;

let gameOver = false;

// ✅ tamanho base do jogo
const BASE_W = MAP_W * TILE;
const BASE_H = MAP_H * TILE;

let bullets = [];

function shootBullet(p){
  const speed = 8;
  let vx = 0;
  let vy = 0;

  if (p.frameY === DIR_ROW.right) vx = speed;
  if (p.frameY === DIR_ROW.left)  vx = -speed;
  if (p.frameY === DIR_ROW.up)    vy = -speed;
  if (p.frameY === DIR_ROW.down)  vy = speed;

  let startX = p.x + 28;
  let startY = p.y + 28;

  // nasce na ponta da arma
  if (p.frameY === DIR_ROW.right) { startX = p.x + 56; startY = p.y + 30; }
  if (p.frameY === DIR_ROW.left)  { startX = p.x + 0;  startY = p.y + 30; }
  if (p.frameY === DIR_ROW.up)    { startX = p.x + 30; startY = p.y + 0; }
  if (p.frameY === DIR_ROW.down)  { startX = p.x + 30; startY = p.y + 56; }

  bullets.push({
    x: startX,
    y: startY,
    w: 28,
    h: 12,
    vx,
    vy,
    life: 60,
    dmg: 18
  });
}
function rectHit(a,b){
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function updateBullets(){
  for (const b of bullets){
    b.x += b.vx;
    b.y += b.vy;
    b.life--;

    for (const z of zombies){
      if (!z.alive) continue;

      if (rectHit(b, z)){
        z.hp -= b.dmg;
        b.life = 0;

        if (z.hp <= 0){
          z.alive = false;
          horde.killed++;
          shop.coins++;
          ui.setCoins(shop.coins);
        }
      }
    }
  }

  bullets = bullets.filter(b => b.life > 0);
}

function drawBullets(){
  for (const b of bullets){
    if (assets.has("bullet")) {
      const img = assets.get("bullet");

      let angle = 0;
      if (b.vx > 0) angle = 0;
      else if (b.vx < 0) angle = Math.PI;
      else if (b.vy < 0) angle = -Math.PI / 2;
      else if (b.vy > 0) angle = Math.PI / 2;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);

      ctx.drawImage(img, -16, -8, 32, 16);

      ctx.restore();
    } else {
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
  }
}



let arrows = [];

function shootArrow(p){
  const speed = 4;
  let vx = 0;
  let vy = 0;

  if (p.frameY === DIR_ROW.right) vx = speed;
  if (p.frameY === DIR_ROW.left)  vx = -speed;
  if (p.frameY === DIR_ROW.up)    vy = -speed;
  if (p.frameY === DIR_ROW.down)  vy = speed;

  let startX = p.x + 28;
  let startY = p.y + 28;

  if (p.frameY === DIR_ROW.right) { startX = p.x + 52; startY = p.y + 28; }
  if (p.frameY === DIR_ROW.left)  { startX = p.x + 4;  startY = p.y + 28; }
  if (p.frameY === DIR_ROW.up)    { startX = p.x + 28; startY = p.y + 4; }
  if (p.frameY === DIR_ROW.down)  { startX = p.x + 28; startY = p.y + 52; }

  arrows.push({
    x: startX,
    y: startY,
    w: 32,
    h: 12,
    vx,
    vy,
    life: 80,
    dmg: 35
  });
}

function updateArrows(){
  for (const a of arrows){
    a.x += a.vx;
    a.y += a.vy;
    a.life--;

    for (const z of zombies){
      if (!z.alive) continue;

      if (rectHit(a, z)){
        z.hp -= a.dmg;
        a.life = 0;

        if (z.hp <= 0){
          z.alive = false;
          horde.killed++;
          shop.coins++;
          ui.setCoins(shop.coins);
        }
      }
    }
  }

  arrows = arrows.filter(a => a.life > 0);
}

function drawArrows(){
  for (const a of arrows){
    if (assets.has("arrow")) {
      const img = assets.get("arrow");

      let angle = 0;
      if (a.vx > 0) angle = 0;
      else if (a.vx < 0) angle = Math.PI;
      else if (a.vy < 0) angle = -Math.PI / 2;
      else if (a.vy > 0) angle = Math.PI / 2;

      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(angle);

      ctx.drawImage(img, -16, -6, 32, 12);

      ctx.restore();
    } else {
      ctx.fillStyle = "#ddd";
      ctx.fillRect(a.x - 1, a.y - 6, 2, 12);
    }
  }
}function drawArrows(){
  for (const a of arrows){
    if (assets.has("arrow")) {
      const img = assets.get("arrow");

      let angle = 0;
      if (a.vx > 0) angle = 0;
      else if (a.vx < 0) angle = Math.PI;
      else if (a.vy < 0) angle = -Math.PI / 2;
      else if (a.vy > 0) angle = Math.PI / 2;

      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(angle);

      ctx.drawImage(img, -16, -6, 32, 12);

      ctx.restore();
    } else {
      ctx.fillStyle = "#ddd";
      ctx.fillRect(a.x - 1, a.y - 6, 2, 12);
    }
  }
}
let currentMap = map1;

// itens fase 1
const keyItem   = { x: TILE*3,  y: TILE*7,  w: 40, h: 40, picked:false };
const swordItem = { x: TILE*10, y: TILE*7,  w: 40, h: 60, picked:false };
const door      = { x: TILE*13, y: TILE*1,  w: TILE*2, h: TILE*2 };

const gunItem = {
  x: TILE*6,
  y: TILE*4,
  w: 48,
  h: 28,
  picked: false
};

const bowItem = {
  x: TILE*8,
  y: TILE*4,
  w: 40,
  h: 60,
  picked: false
};


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
    if (assets.has("key")) {
      ctx.drawImage(assets.get("key"), keyItem.x, keyItem.y, keyItem.w, keyItem.h);
    } else {
      ctx.fillStyle = "gold";
      ctx.fillRect(keyItem.x, keyItem.y, 24, 24);
    }
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

  // arma no chão
  if (!gunItem.picked){
    if (assets.has("gun")) {
      ctx.drawImage(assets.get("gun"), gunItem.x, gunItem.y, gunItem.w, gunItem.h);
    } else {
      ctx.fillStyle = "#aaa";
      ctx.fillRect(gunItem.x, gunItem.y, gunItem.w, gunItem.h);
    }
  }

  // arco no chão
  if (!bowItem.picked){
    if (assets.has("bow")) {
      ctx.drawImage(assets.get("bow"), bowItem.x, bowItem.y, bowItem.w, bowItem.h);
    } else {
      ctx.fillStyle = "#b5651d";
      ctx.fillRect(bowItem.x, bowItem.y, bowItem.w, bowItem.h);
    }
  }

  // porta
  ctx.save();
  ctx.shadowColor = "purple";
  ctx.shadowBlur = 18;
  if (assets.has("door")) {
    ctx.drawImage(assets.get("door"), door.x, door.y, door.w, door.h);
  } else {
    ctx.fillStyle = "#8b4513";
    ctx.fillRect(door.x, door.y, door.w, door.h);
  }
  ctx.restore();
}





function handleActions(){

if (gameOver && input.action) {
  input.action = false;

  gameOver = false;
  player.hp = player.maxHp;
  player.invul = 0;

  bullets = [];
  arrows = [];

  setMap(map2);
  startHorde();
  ui.setObjective(`Fase 2: Zombies 0/${horde.goalKill} 🧟`);
  return;
}


  if (input.action){
    input.action = false;

    let didInteract = false;

    // fase 1
    if (currentMap === map1){

      // pegar chave
      if (!keyItem.picked && dist(player, keyItem) < 60){
        keyItem.picked = true;
        ui.setObjective("Agora pegue a espada ⚔️");
        didInteract = true;
      }

      // pegar espada
      else if (!swordItem.picked && dist(player, swordItem) < 70){
        swordItem.picked = true;
        player.hasSword = true;
        player.weapon = "sword";
        ui.setObjective("Vá até a porta 🚪");
        didInteract = true;
      }

      // pegar arma
      else if (!gunItem.picked && dist(player, gunItem) < 60){
        gunItem.picked = true;
        player.hasGun = true;
        player.weapon = "gun";
        ui.setObjective("Você pegou a arma 🔫");
        didInteract = true;
      }

      // pegar arco
      else if (!bowItem.picked && dist(player, bowItem) < 60){
        bowItem.picked = true;
        player.hasBow = true;
        player.weapon = "bow";
        ui.setObjective("Você pegou o arco 🏹");
        didInteract = true;
      }

      // abrir porta
      else if (keyItem.picked && dist(player, door) < 95){
        setMap(map2);
        startHorde();
        ui.setObjective("Fase 2: Zombies 0/25 🧟");
        didInteract = true;
      }
    }

    // reiniciar fase 2
    if (!didInteract && currentMap === map2 && !horde.active){
      player.hp = player.maxHp;
      player.invul = 0;
      setMap(map2);
      startHorde();
      ui.setObjective(`Fase 2: Zombies 0/${horde.goalKill} 🧟`);
      didInteract = true;
    }

    // ✅ se não interagiu com nada, ataca com E
    if (!didInteract){
      player.tryAttack();
    }
  }

  // ataque separado continua funcionando também
  if (input.attack){
    input.attack = false;
    player.tryAttack();
  }
}



function fitCanvas(){
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const scale = Math.min(vw / BASE_W, vh / BASE_H);

  canvas.style.width  = Math.floor(BASE_W * scale) + "px";
  canvas.style.height = Math.floor(BASE_H * scale) + "px";
}

window.addEventListener("resize", fitCanvas);
window.addEventListener("orientationchange", fitCanvas);
fitCanvas();


function update(){
   updateKeyboard();
  handleActions();

  if (gameOver) {
  ui.setHP(player.hp, player.maxHp);
  return;
}

  // ✅ PAUSA TOTAL
  if (shop.open) {
    ui.setHP(player.hp, player.maxHp);
    return;
  }

  player.update();
  updateZombies();
  ui.setHP(player.hp, player.maxHp);
  // ... stats etc ...


updateBullets();
updateArrows();

}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMap();
  drawItems();
  drawZombies(ctx);
  player.draw(ctx);
  shop.draw(ctx);
  
  drawBullets();
  drawArrows();
  drawGameOver();
}

function gameLoop(){
  updateKeyboard();
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function drawGameOver(){
  if (!gameOver) return;

  // fundo escuro
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // painel
  const boxW = 420;
  const boxH = 220;
  const boxX = (canvas.width - boxW) / 2;
  const boxY = (canvas.height - boxH) / 2;

  ctx.fillStyle = "rgba(20,20,20,0.95)";
  ctx.fillRect(boxX, boxY, boxW, boxH);

  ctx.strokeStyle = "#a855f7";
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // título
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "bold 34px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2, boxY + 50);

  // subtítulo
  ctx.font = "18px Arial";
  ctx.fillStyle = "#ddd";
  ctx.fillText(`Zombies derrotados: ${horde.killed}`, canvas.width / 2, boxY + 95);
  ctx.fillText(`Moedas: ${shop.coins}`, canvas.width / 2, boxY + 125);

  // botão fake
  const btnW = 180;
  const btnH = 44;
  const btnX = canvas.width / 2 - btnW / 2;
  const btnY = boxY + 150;

  ctx.fillStyle = "#7c3aed";
  ctx.fillRect(btnX, btnY, btnW, btnH);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Arial";
  ctx.fillText("REINICIAR", canvas.width / 2, btnY + 29);

  // dica
  ctx.font = "14px Arial";
  ctx.fillStyle = "#bbb";
  ctx.fillText("Pressione E para jogar de novo", canvas.width / 2, boxY + 208);

  ctx.restore();
}



canvas.addEventListener("pointerdown", (e) => {
   const p = canvasPointFromClient(e);
  const r = canvas.getBoundingClientRect();
  const mx = (e.clientX - r.left) * (canvas.width / r.width);
  const my = (e.clientY - r.top) * (canvas.height / r.height);
  shop.handleClick(mx, my);
});