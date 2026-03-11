const assets = {
  imgs: {},
  ok: {},

  list: [
    ["player", "imagens/player.png"],
    ["key",    "imagens/key.png"],
    ["door",   "imagens/porta.png"],
    ["sword",  "imagens/espada.png"],
    ["zombie", "imagens/zombie.png"],
    ["gun",    "imagens/gun.png"],
    ["bow",    "imagens/bow.png"],
    ["arrow", "imagens/flecha.png"],
    ["bullet", "imagens/bala.png"],
  ],

  loadAll(onDone) {
    let left = this.list.length;

    for (const [name, src] of this.list) {
      const img = new Image();
      this.imgs[name] = img;
      this.ok[name] = false;

      img.onload = () => {
        this.ok[name] = true;
        left--;
        if (left === 0) onDone();
      };

      img.onerror = () => {
        console.warn("Não carregou:", src, "(ok, vou usar placeholder)");
        this.ok[name] = false;
        left--;
        if (left === 0) onDone();
      };

      img.src = src;
    }
  },

  get(name) { return this.imgs[name]; },
  has(name) { return !!this.ok[name]; },
};
