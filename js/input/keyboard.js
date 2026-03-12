window.input = {
  dx: 0,
  dy: 0,
  action: false,
  attack: false,
  run: false,
  touchActive: false
};

const keys = {};

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  keys[key] = true;

  if (key === "shift") input.run = true;

  if (key === "e") {
    input.action = true;
    input.attack = true;
  }

  if (key === "u") {
    if (typeof shop !== "undefined") shop.toggle();
  }

  if (key === "1") player.weapon = "sword";
  if (key === "2") player.weapon = "gun";
  if (key === "3") player.weapon = "bow";
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  keys[key] = false;

  if (key === "shift") input.run = false;
});

function updateKeyboard() {
  const left  = keys["a"] || keys["arrowleft"];
  const right = keys["d"] || keys["arrowright"];
  const up    = keys["w"] || keys["arrowup"];
  const down  = keys["s"] || keys["arrowdown"];

  const usingKeyboard = left || right || up || down;

  // se o touch estiver ativo e nenhuma tecla do teclado estiver sendo usada,
  // não mexe no input
  if (!usingKeyboard) {
    if (!input.touchActive) {
      input.dx = 0;
      input.dy = 0;
    }
    return;
  }

  let dx = 0;
  let dy = 0;

  if (left)  dx -= 1;
  if (right) dx += 1;
  if (up)    dy -= 1;
  if (down)  dy += 1;

  input.dx = dx;
  input.dy = dy;
}