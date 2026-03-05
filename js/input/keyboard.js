window.input = { dx:0, dy:0, action:false, attack:false };

addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();

  // ✅ bloqueia scroll do Space e setas
  if (e.code === "Space" || k.startsWith("arrow")) e.preventDefault();

  if (k === "w" || k === "arrowup") input.dy = -1;
  if (k === "s" || k === "arrowdown") input.dy = 1;
  if (k === "a" || k === "arrowleft") input.dx = -1;
  if (k === "d" || k === "arrowright") input.dx = 1;

  if (k === "e") input.action = true;

  // atacar com espaço
  if (e.code === "Space") input.attack = true;
}, { passive: false });

addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  if (k === "w" || k === "arrowup") if (input.dy < 0) input.dy = 0;
  if (k === "s" || k === "arrowdown") if (input.dy > 0) input.dy = 0;
  if (k === "a" || k === "arrowleft") if (input.dx < 0) input.dx = 0;
  if (k === "d" || k === "arrowright") if (input.dx > 0) input.dx = 0;
}, { passive: false });