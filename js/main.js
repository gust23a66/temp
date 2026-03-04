ui.init();
initPlayerSheet();
initZombieSheet();
initSwordSheet();
ui.setObjective("Carregando...");
ui.setCoins(0);

assets.loadAll(() => {
  ui.init();

  initPlayerSheet();   // ✅ player sprite sheet
  initZombieSheet();   // ✅ zombie sprite sheet (se você tiver)
  initSwordSheet();    // ✅ sword sprite sheet

  setMap(map1);
  ui.setObjective("Pegue a chave 🔑 (E)");
  ui.setHP(player.hp, player.maxHp);

  if (typeof shop !== "undefined" && shop.apply) shop.apply();

  gameLoop();
});