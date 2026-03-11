let zombies = [];


const ZOMBIE_COLS = 2;
const ZOMBIE_ROWS = 2;

let ZW = 0; // frame width
let ZH = 0; // frame height

function initZombieSheet() {
  const img = assets.get("zombie");
  if (!img) return;
  ZW = Math.floor(img.width / ZOMBIE_COLS);
  ZH = Math.floor(img.height / ZOMBIE_ROWS);
}

const horde = {
  active: false,
  time: 0,        // frames
  spawnTimer: 0,
  spawnEvery: 55,
  maxAlive: 14,
  killed: 0,
  goalKill: 25,
};

function startHorde(){
  zombies = [];
  horde.active = true;
  horde.time = 0;
  horde.spawnTimer = 0;
  horde.spawnEvery = 55;
  horde.maxAlive = 14;
  horde.killed = 0;
}

function stopHorde(){ horde.active = false; }

function rand(min, max){ return Math.random()*(max-min)+min; }

function spawnZombieOutside() {
  const side = Math.floor(Math.random() * 4);
  const margin = 40;

  let x = 0, y = 0;
  if (side === 0) { x = -margin; y = rand(0, canvas.height - 40); }
  else if (side === 1) { x = canvas.width + margin; y = rand(0, canvas.height - 40); }
  else if (side === 2) { x = rand(0, canvas.width - 40); y = -margin; }
  else { x = rand(0, canvas.width - 40); y = canvas.height + margin; }

  zombies.push({
    x, y,
    w: 34, h: 34,
    hp: 45, maxHp: 45,
    speed: rand(0.85, 1.35),
    atkCd: 0,
    dmg: 8,
    alive: true,

    // animação
    frameX: 0,
    frameY: 0,
    animTick: 0
  });
}

function rectHit(a,b){
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}

function updateHordeDifficulty(){
  // a cada 10s aumenta
  if (horde.time % (60*10) === 0) {
    horde.spawnEvery = Math.max(20, horde.spawnEvery - 5);
    horde.maxAlive = Math.min(40, horde.maxAlive + 4);
  }
}

function updateZombies(){
  if (currentMap !== map2 || !horde.active) return;

  horde.time++;
  horde.spawnTimer++;
  updateHordeDifficulty();

  const aliveCount = zombies.filter(z => z.alive).length;
  if (horde.spawnTimer >= horde.spawnEvery && aliveCount < horde.maxAlive) {
    spawnZombieOutside();
    horde.spawnTimer = 0;
  }

  for (const z of zombies){
    if (!z.alive) continue;

    if (z.atkCd > 0) z.atkCd--;

    const pcx = player.x + player.w / 2;
    const pcy = player.y + player.h / 2;
    const zcx = z.x + z.w / 2;
    const zcy = z.y + z.h / 2;

    const dx = pcx - zcx;
    const dy = pcy - zcy;
    const dist = Math.hypot(dx, dy);

    // animação
    z.animTick++;
    if (z.animTick % 12 === 0) {
      z.frameX = (z.frameX + 1) % ZOMBIE_COLS;
    }
    z.frameY = (dist < 60) ? 1 : 0;

    const range = 42;

    // ataque no player
    if (dist < range) {
      if (z.atkCd === 0 && player.invul === 0) {
        player.hp -= z.dmg;
        if (player.hp < 0) player.hp = 0;

        player.invul = 18;
        z.atkCd = 35;

        // game over
        if (player.hp <= 0) {
          player.hp = 0;
          stopHorde();
          gameOver = true;
          
        }
      }
      continue;
    }

    // perseguir player
    if (dist > 0.001) {
      z.x += (dx / dist) * z.speed;
      z.y += (dy / dist) * z.speed;
    }
  }

  // vitória
  // vitória
if (horde.killed >= horde.goalKill) {
  stopHorde();
  ui.setObjective("✅ Venceu a horda! Aperte E para reiniciar a fase.");
}
}

function drawZombies(ctx) {
  if (currentMap !== map2) return;

  for (const z of zombies) {
    if (!z.alive) continue;

    if (assets.has("zombie") && ZW && ZH) {
      const img = assets.get("zombie");

      const sx = z.frameX * ZW;
      const sy = z.frameY * ZH;

      ctx.drawImage(
        img,
        sx, sy, ZW, ZH,                 // recorte
        Math.floor(z.x), Math.floor(z.y),
        48, 48
      );
    } else {
      ctx.fillStyle = "#3fbf5a";
      ctx.fillRect(Math.floor(z.x), Math.floor(z.y), z.w, z.h);
    }

    // HP
    ctx.fillStyle = "#000";
    ctx.fillRect(Math.floor(z.x), Math.floor(z.y) - 7, z.w, 4);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(Math.floor(z.x), Math.floor(z.y) - 7, (z.hp / z.maxHp) * z.w, 4);
  }
}

function hitZombies(attackBox, dmg){
  if (currentMap !== map2 || !horde.active) return;

  for (const z of zombies){
    if (!z.alive) continue;
    if (!rectHit(attackBox, z)) continue;

    z.hp -= dmg;
    if (z.hp <= 0){
      z.hp = 0;
      z.alive = false;
      horde.killed++;
      shop.coins += 1;
ui.setCoins(shop.coins);
    }
  }


  

  ui.setObjective(`Fase 2: Zombies ${horde.killed}/${horde.goalKill} 🧟`);
}