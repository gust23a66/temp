const assets = {
  imgs: {},
  ok: {},

  list: [
    ["player", "imagens/player.png"],
    ["key",    "imagens/key.png"],
    ["door",   "imagens/porta.png"],
    ["sword",  "imagens/espada.png"],
    ["zombie", "imagens/zombie.png"], // você coloca depois
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

const SWORD_FRAMES = 4;

let SW = 0;
let SH = 0;

function initSwordSheet(){
  const img = assets.get("sword");
  if(!img) return;

  SW = img.width / SWORD_FRAMES;
  SH = img.height;
}