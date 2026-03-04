window.input = { dx:0, dy:0, action:false, attack:false };

addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();

  if (k === "w" || k === "arrowup") input.dy = -1;
  if (k === "s" || k === "arrowdown") input.dy = 1;
  if (k === "a" || k === "arrowleft") input.dx = -1;
  if (k === "d" || k === "arrowright") input.dx = 1;

  if (k === "e") input.action = true;
  if (e.code === "Space") input.attack = true;

  // abrir loja
  if (k === "u") shop.toggle();
});

addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();

  if (k === "w" || k === "arrowup") if (input.dy < 0) input.dy = 0;
  if (k === "s" || k === "arrowdown") if (input.dy > 0) input.dy = 0;
  if (k === "a" || k === "arrowleft") if (input.dx < 0) input.dx = 0;
  if (k === "d" || k === "arrowright") if (input.dx > 0) input.dx = 0;
});