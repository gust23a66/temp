const shop = {
  open: false,
  coins: 0,

  // layout
  panel: { x: 60, y: 50, w: 650, h: 380 },
  cards: [],

 upgrades: {
  dmg:  { name: "DANO",  desc: "+5 dano",  level: 0, base: 25,  add: 5,  cost: 10 },
  hp:   { name: "VIDA",  desc: "+20 vida", level: 0, base: 100, add: 20, cost: 15 },
  heal: { name: "CURA",  desc: "+30 HP",   level: 0, base: 0,   add: 30, cost: 12 },
  atk:  { name: "ATAQUE",desc: "mais rápido", level: 0, base: 18, add: -2, cost: 14 },
},

  getCost(key){
    const u = this.upgrades[key];
    return Math.floor(u.cost * (1 + u.level * 0.6));
  },

  toggle(){
    this.open = !this.open;
  },

  buildCards(){
    // 2x2 cards
    const p = this.panel;
    const pad = 18;
    const cw = (p.w - pad*3) / 2;
    const ch = (p.h - pad*3) / 2;

    const keys = ["dmg","hp","heal","atk"];
    this.cards = keys.map((k, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return {
        key: k,
        x: p.x + pad + col * (cw + pad),
        y: p.y + pad + row * (ch + pad),
        w: cw,
        h: ch,
      };
    });
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

  if (key === "heal"){
    player.hp = Math.min(player.maxHp, player.hp + u.add);
    ui.setHP(player.hp, player.maxHp);
  }

  this.apply();

  ui.setObjective(`✅ Comprou ${u.name} (lvl ${u.level})`);
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

  if (key === "heal"){
    player.hp = Math.min(player.maxHp, player.hp + u.add);
    ui.setHP(player.hp, player.maxHp);
  }

  this.apply();

  ui.setObjective(`✅ Comprou ${u.name} (lvl ${u.level})`);
},

  handleClick(mx, my){
    if (!this.open) return false;

    // clique fora fecha
    const p = this.panel;
    const inside =
      mx >= p.x && mx <= p.x + p.w &&
      my >= p.y && my <= p.y + p.h;

    if (!inside) {
      this.open = false;
      return true;
    }

    // clique em card compra
    for (const c of this.cards){
      if (mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h){
        this.buy(c.key);
        return true;
      }
    }

    return true;
  },

  draw(ctx){
    if (!this.open) return;

    if (this.cards.length === 0) this.buildCards();

    // fundo escuro
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // painel
    const p = this.panel;
    ctx.fillStyle = "rgba(30,30,30,0.95)";
    ctx.fillRect(p.x, p.y, p.w, p.h);

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.strokeRect(p.x, p.y, p.w, p.h);

    // título
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("LOJA DE UPGRADES", p.x + 18, p.y + 28);

    ctx.font = "14px Arial";
    ctx.fillText(`Moedas: ${this.coins}  •  Toque/click para comprar  •  Clique fora para fechar`, p.x + 18, p.y + 50);

    // cards
    for (const c of this.cards){
      const u = this.upgrades[c.key];
      const price = this.getCost(c.key);
      const can = this.coins >= price;

      ctx.fillStyle = can ? "rgba(60,60,60,0.95)" : "rgba(60,20,20,0.95)";
      ctx.fillRect(c.x, c.y, c.w, c.h);

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.strokeRect(c.x, c.y, c.w, c.h);

      ctx.fillStyle = "#fff";
      ctx.font = "18px Arial";
      ctx.fillText(u.name, c.x + 14, c.y + 28);

      ctx.font = "14px Arial";
      ctx.fillText(u.desc, c.x + 14, c.y + 52);

      ctx.font = "14px Arial";
      ctx.fillText(`Nível: ${u.level}`, c.x + 14, c.y + 76);

      ctx.font = "16px Arial";
      ctx.fillText(`Preço: ${price} 🪙`, c.x + 14, c.y + c.h - 18);

      if (!can){
        ctx.font = "12px Arial";
        ctx.fillText("Falta moeda", c.x + c.w - 90, c.y + c.h - 18);
      }
    }
  }
};