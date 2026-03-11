window.input = { dx:0, dy:0, action:false, attack:false, sprint:false };

function nextWeapon(){
  const weapons = [];

  if (player.hasSword) weapons.push("sword");
  if (player.hasGun) weapons.push("gun");
  if (player.hasBow) weapons.push("bow");

  if (weapons.length === 0) return;

  let index = weapons.indexOf(player.weapon);

  if (index === -1) {
    player.weapon = weapons[0];
    return;
  }

  index = (index + 1) % weapons.length;
  player.weapon = weapons[index];
}

addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();

  // bloqueia scroll do Space e setas
  if (e.code === "Space" || k.startsWith("arrow")) {
    e.preventDefault();
  }

  // movimento
  if (k === "w" || k === "arrowup") input.dy = -1;
  if (k === "s" || k === "arrowdown") input.dy = 1;
  if (k === "a" || k === "arrowleft") input.dx = -1;
  if (k === "d" || k === "arrowright") input.dx = 1;

  // ação
  if (k === "e") input.action = true;

  // ataque
  if (e.code === "Space") input.attack = true;

  // trocar arma pelo teclado
  if (k === "1" && player.hasSword) player.weapon = "sword";
  if (k === "2" && player.hasGun)   player.weapon = "gun";
  if (k === "3" && player.hasBow)   player.weapon = "bow";

  // próxima arma
  if (k === "q") nextWeapon();

}, { passive: false });

addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();

  if (k === "w" || k === "arrowup") {
    if (input.dy < 0) input.dy = 0;
  }

  if (k === "s" || k === "arrowdown") {
    if (input.dy > 0) input.dy = 0;
  }

  if (k === "a" || k === "arrowleft") {
    if (input.dx < 0) input.dx = 0;
  }

  if (k === "d" || k === "arrowright") {
    if (input.dx > 0) input.dx = 0;
  }

}, { passive: false });