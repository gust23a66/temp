(() => {
  if (!("ontouchstart" in window)) return;
  const stick = document.getElementById("stick");
  const knob = document.getElementById("stick-knob");
  const btnAction = document.getElementById("btnAction");
  const btnAttack = document.getElementById("btnAttack");
  const btnUp = document.getElementById("btnUp");

  let active = false;
  let centerX = 0, centerY = 0;
  const R = 60;

  function reset(){
    active = false;
    input.dx = 0;
    input.dy = 0;
    knob.style.transform = "translate(-50%,-50%)";
  }

  stick.addEventListener("pointerdown", (e) => {
    // ✅ se a loja estiver aberta, não move
    if (typeof shop !== "undefined" && shop.open) return;

    e.preventDefault();
    active = true;
    stick.setPointerCapture(e.pointerId);

    const r = stick.getBoundingClientRect();
    centerX = r.left + r.width / 2;
    centerY = r.top + r.height / 2;
  });

  stick.addEventListener("pointermove", (e) => {
    if (!active) return;
    if (typeof shop !== "undefined" && shop.open) { reset(); return; }

    e.preventDefault();

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const len = Math.hypot(dx, dy);
    const clamped = Math.min(len, R);
    const nx = len ? (dx / len) * clamped : 0;
    const ny = len ? (dy / len) * clamped : 0;

    input.dx = nx / R;
    input.dy = ny / R;

    // knob centralizado + offset
    knob.style.transform = `translate(${nx}px, ${ny}px)`;
  });

  stick.addEventListener("pointerup", (e) => { e.preventDefault(); reset(); });
  stick.addEventListener("pointercancel", (e) => { e.preventDefault(); reset(); });

  btnAction.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (typeof shop !== "undefined" && shop.open) return;
    input.action = true;
  });
  btnAction.addEventListener("pointerup", (e) => { e.preventDefault(); input.action = false; });
  btnAction.addEventListener("pointercancel", (e) => { e.preventDefault(); input.action = false; });

  btnAttack.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (typeof shop !== "undefined" && shop.open) return;
    input.attack = true;
  });
  btnAttack.addEventListener("pointerup", (e) => { e.preventDefault(); input.attack = false; });
  btnAttack.addEventListener("pointercancel", (e) => { e.preventDefault(); input.attack = false; });

  // ✅ loja de upgrades (abre/fecha)
  if (btnUp) {
    btnUp.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      shop.toggle();
      reset();               // para o analógico
      input.action = false;  // evita clicar E junto
      input.attack = false;  // evita atacar junto
    });
  }
})();