const shop = {
  coins: 0,
  open: false,

  upgrades: {
    dmg:  { level: 0, base: 25,  add: 5,  cost: 10 },
    hp:   { level: 0, base: 100, add: 20, cost: 15 },
    heal: { level: 0, base: 0,   add: 30, cost: 12 },
    atk:  { level: 0, base: 18,  add: -2, cost: 14 },
  },

  toggle(){
    this.open = !this.open;
    input.action = false;
    input.attack = false;
  },

  getCost(key){
    const u = this.upgrades[key];
    return Math.floor(u.cost * (1 + u.level * 0.6));
  },

  canBuy(key){
    return this.coins >= this.getCost(key);
  },

 buy(key){
  const price = this.getCost(key);
  const u = this.upgrades[key];

  if (this.coins < price) {
    ui.setObjective("❌ Sem moedas suficientes!");
    return;
  }

  this.coins -= price;
  u.level++;

  if (key === "heal") {
    player.hp = Math.min(player.maxHp, player.hp + u.add);
    ui.setHP(player.hp, player.maxHp);
  }

  applyUpgrades();
  ui.setCoins(this.coins);

  ui.setObjective(`✅ Comprou ${key.toUpperCase()} (lvl ${u.level})`);
},

  draw(ctx){
    if (!this.open) return;

    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const W = 520, H = 320;
    const x = (canvas.width - W) / 2;
    const y = (canvas.height - H) / 2;

    ctx.fillStyle = "#111";
    ctx.fillRect(x, y, W, H);
    ctx.strokeStyle = "#6f2cff";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, W, H);

    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`UPGRADES (🪙 ${this.coins})`, x + 18, y + 32);

    this._buttons = [];

    const items = [
      ["dmg",  "DANO",   `+${this.upgrades.dmg.add}`],
      ["hp",   "VIDA",   `+${this.upgrades.hp.add}`],
      ["heal", "CURA",   `+${this.upgrades.heal.add} HP`],
      ["atk",  "ATAQUE", `cooldown ${this.upgrades.atk.add}`],
    ];

    const bx = x + 20;
    let by = y + 60;

    ctx.font = "16px Arial";

    for (const [key, label, desc] of items){
      const cost = this.getCost(key);
      const lvl = this.upgrades[key].level;

      const btn = { key, x: bx, y: by, w: W - 40, h: 48 };
      this._buttons.push(btn);

      ctx.fillStyle = this.canBuy(key) ? "#222" : "#1a1a1a";
      ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

      ctx.fillStyle = "#fff";
      ctx.fillText(`${label} (${desc}) • lvl ${lvl} • custo ${cost}`, btn.x + 12, btn.y + 30);

      by += 56;
    }

    const closeBtn = { key: "__close__", x: x + W - 120, y: y + H - 54, w: 100, h: 36 };
    this._buttons.push(closeBtn);

    ctx.fillStyle = "#6f2cff";
    ctx.fillRect(closeBtn.x, closeBtn.y, closeBtn.w, closeBtn.h);
    ctx.fillStyle = "#fff";
    ctx.fillText("FECHAR", closeBtn.x + 16, closeBtn.y + 24);
  },

  handleClick(mx, my){
    if (!this.open) return;

    for (const b of (this._buttons || [])){
      const hit = mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h;
      if (!hit) continue;

      if (b.key === "__close__"){
        this.toggle();
        return;
      }

      this.buy(b.key);
      return;
    }
  }
};

function applyUpgrades(){
  const u = shop.upgrades;

  player.damage = u.dmg.base + u.dmg.level * u.dmg.add;

  player.maxHp = u.hp.base + u.hp.level * u.hp.add;
  if (player.hp > player.maxHp) player.hp = player.maxHp;

  player.attackCooldownBase = Math.max(6, u.atk.base + u.atk.level * u.atk.add);

  // atualiza barra
  ui.setHP(player.hp, player.maxHp);
}