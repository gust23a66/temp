const ui = {
  objectiveEl: null,
  hpBarEl: null,
  statsEl: null,
  coinsEl: null,

  init() {
    this.objectiveEl = document.getElementById("objective");
    this.hpBarEl = document.getElementById("hpBar");
    this.statsEl = document.getElementById("stats");
    this.coinsEl = document.getElementById("coins");
  },

  setObjective(text) {
    this.objectiveEl.textContent = text;
  },

  setHP(hp, maxHp) {
    const pct = Math.max(0, Math.min(1, hp / maxHp));
    this.hpBarEl.style.width = (pct * 100) + "%";
  },

  setStats(text) {
    this.statsEl.textContent = text;
  },

  setCoins(n) {
    this.coinsEl.textContent = `🪙 ${n}`;
  }
};