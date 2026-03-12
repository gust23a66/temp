const DIR_ROW = { up:0, down:1, left:2, right:3 };

// ===== sprite sheet player (5 colunas x 4 linhas) =====
const P_COLS = 5;
const P_ROWS = 4;

let PW = 0;
let PH = 0;

function initPlayerSheet(){
  const img = assets.get("player");
  if (!img) return;
  PW = Math.floor(img.width / P_COLS);
  PH = Math.floor(img.height / P_ROWS);
}






// ===== sword sheet 2x2 =====
const S_COLS = 2, S_ROWS = 2;
let SWORD_W = 0, SWORD_H = 0;

function initSwordSheet(){
  const img = assets.get("sword");
  if (!img) return;
  SWORD_W = Math.floor(img.width / S_COLS);
  SWORD_H = Math.floor(img.height / S_ROWS);
}

function drawSwordInHand(ctx, p){
  if (!p.hasSword || !assets.has("sword")) return;
  if (!SWORD_W || !SWORD_H) return;

  const img = assets.get("sword");

  // escolher frame da espada (2x2)
  let fx = 0, fy = 0;
  if (p.frameY === DIR_ROW.up)    { fx = 0; fy = 0; }
  if (p.frameY === DIR_ROW.right) { fx = 1; fy = 0; }
  if (p.frameY === DIR_ROW.down)  { fx = 0; fy = 1; }
  if (p.frameY === DIR_ROW.left)  { fx = 1; fy = 1; }

  const sx = fx * SWORD_W;
  const sy = fy * SWORD_H;

  // ===== posição da mão =====
  const baseX = p.x + 28;
  const baseY = p.y + 28;

  let ox = 0;
  let oy = 0;

  if (p.frameY === DIR_ROW.right){
    ox = 18;
    oy = 4;
  }

  if (p.frameY === DIR_ROW.left){
    ox = -18;
    oy = 4;
  }

  if (p.frameY === DIR_ROW.up){
    ox = 6;
    oy = -20;
  }

  if (p.frameY === DIR_ROW.down){
    ox = 6;
    oy = 18;
  }

  let handX = baseX + ox;
  let handY = baseY + oy;

  // ===== swing do ataque =====
  let t = 0;
  if (p.attacking) t = 1 - (p.attackAnim / 10);

  const push = 10 * Math.sin(t * Math.PI);

  if (p.frameY === DIR_ROW.right) handX += push;
  if (p.frameY === DIR_ROW.left)  handX -= push;
  if (p.frameY === DIR_ROW.up)    handY -= push;
  if (p.frameY === DIR_ROW.down)  handY += push;

  // rotação
  let angle = 0;
  if (p.frameY === DIR_ROW.right) angle = 0;
  if (p.frameY === DIR_ROW.left)  angle = Math.PI;
  if (p.frameY === DIR_ROW.up)    angle = -Math.PI/2;
  if (p.frameY === DIR_ROW.down)  angle = Math.PI/2;

  if (p.attacking) angle += (-0.9 + 1.8 * t);

  const W = 44;
  const H = 44;

  ctx.save();
  ctx.translate(Math.floor(handX), Math.floor(handY));
  ctx.rotate(angle);

  ctx.drawImage(img, sx, sy, SWORD_W, SWORD_H, -W/2, -H/2, W, H);

  ctx.restore();
}

function nextWeapon(){
  const available = [];

  if (player.hasSword) available.push("sword");
  if (player.hasGun)   available.push("gun");
  if (player.hasBow)   available.push("bow");

  if (available.length === 0) return;

  let i = available.indexOf(player.weapon);

  if (i === -1) {
    player.weapon = available[0];
  } else {
    i = (i + 1) % available.length;
    player.weapon = available[i];
  }

  ui.setObjective("Arma: " + player.weapon.toUpperCase());
}


function drawGunInHand(ctx, p){
  if (!assets.has("gun")) return;

  const img = assets.get("gun");

  const baseX = p.x + 28;
  const baseY = p.y + 28;

  let ox=0, oy=0, angle=0;

  if (p.frameY===DIR_ROW.right){ ox=20; oy=6; angle=0; }
  if (p.frameY===DIR_ROW.left){  ox=-20; oy=6; angle=Math.PI; }
  if (p.frameY===DIR_ROW.up){    ox=6; oy=-20; angle=-Math.PI/2; }
  if (p.frameY===DIR_ROW.down){  ox=6; oy=20; angle=Math.PI/2; }

  ctx.save();
  ctx.translate(baseX+ox, baseY+oy);
  ctx.rotate(angle);
  ctx.drawImage(img, -30, -15, 60, 30);
  ctx.restore();
}

function drawBowInHand(ctx, p){
  if (!assets.has("bow")) return;

  const img = assets.get("bow");

  const baseX = p.x + 28;
  const baseY = p.y + 28;

  let ox=0, oy=0, angle=0;

  if (p.frameY===DIR_ROW.right){ ox=18; oy=4; angle=0; }
  if (p.frameY===DIR_ROW.left){  ox=-18; oy=4; angle=Math.PI; }
  if (p.frameY===DIR_ROW.up){    ox=6; oy=-18; angle=-Math.PI/2; }
  if (p.frameY===DIR_ROW.down){  ox=6; oy=18; angle=Math.PI/2; }

  ctx.save();
  ctx.translate(baseX+ox, baseY+oy);
  ctx.rotate(angle);
  ctx.drawImage(img, -28, -40, 56, 80);
  ctx.restore();
}


const player = {
  x: 0, y: 0,
  w: 32, h: 44,
  speed: 2.6,



  hp: 100,
  maxHp: 100,
  invul: 0,

  hasSword: false,

hasGun: false,
hasBow: false,
weapon: null,

  attackCooldown: 0,
  attackCooldownBase: 18,
  damage: 25,

  attacking: false,
  attackAnim: 0,

  frameX: 0,
  frameY: DIR_ROW.down,
  animTick: 0,

  setSpawn(s){
    this.x = s.x;
    this.y = s.y;
  },

  update(){
    if (this.attacking) {
      this.attackAnim--;
      if (this.attackAnim <= 0) this.attacking = false;
    }

    if (this.invul > 0) this.invul--;
    if (this.attackCooldown > 0) this.attackCooldown--;

    let dx = input.dx;
    let dy = input.dy;

    if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.frameY = dx > 0 ? DIR_ROW.right : DIR_ROW.left;
      } else {
        this.frameY = dy > 0 ? DIR_ROW.down : DIR_ROW.up;
      }
const len = Math.hypot(dx, dy);
const stickPower = Math.min(1, len);

let currentSpeed = this.speed;
if (input.run) currentSpeed = this.speed * 1.35;

if (len > 0) {
  dx = (dx / len) * currentSpeed * stickPower;
  dy = (dy / len) * currentSpeed * stickPower;
  moveAndCollide(dx, dy);
}

      this.animTick++;
      if (this.animTick % 8 === 0) {
        this.frameX = (this.frameX + 1) % P_COLS;
      }
    } else {
      this.frameX = 0;
      this.animTick = 0;
    }
  },


  

tryAttack(){
  if (this.attackCooldown > 0) return;

  this.attackCooldown = this.attackCooldownBase;

 if (this.weapon === "sword" && this.hasSword){ 
    this.attacking = true;
    this.attackAnim = 10;

    const box = { x:0, y:0, w:56, h:56 };

    if (this.frameY === DIR_ROW.right) {
      box.x = this.x + this.w;
      box.y = this.y + (this.h - box.h)/2;
    } else if (this.frameY === DIR_ROW.left) {
      box.x = this.x - box.w;
      box.y = this.y + (this.h - box.h)/2;
    } else if (this.frameY === DIR_ROW.up) {
      box.x = this.x + (this.w - box.w)/2;
      box.y = this.y - box.h;
    } else {
      box.x = this.x + (this.w - box.w)/2;
      box.y = this.y + this.h;
    }

    hitZombies(box, this.damage);
  }

  if (this.weapon === "gun" && this.hasGun){
    shootBullet(this);
  }

  if (this.weapon === "bow" && this.hasBow){
    shootArrow(this);
  }
},

draw(ctx){

  // ===== PLAYER =====
  if (assets.has("player") && PW && PH) {
    const img = assets.get("player");

    const sx = this.frameX * PW;
    const sy = this.frameY * PH;

    ctx.drawImage(
      img,
      sx, sy, PW, PH,
      Math.floor(this.x),
      Math.floor(this.y),
      56, 56
    );
  } else {
    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), 40, 50);
  }

  // ===== ARMA EQUIPADA =====
 if (this.weapon === "sword" && this.hasSword) {
  drawSwordInHand(ctx, this);
}
else if (this.weapon === "gun" && this.hasGun) {
  drawGunInHand(ctx, this);
}
else if (this.weapon === "bow" && this.hasBow) {
  drawBowInHand(ctx, this);
}

  // ===== INVULNERABILIDADE =====
  if (this.invul > 0){
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.strokeRect(
      Math.floor(this.x),
      Math.floor(this.y),
      56,
      56
    );
  }
}








};

