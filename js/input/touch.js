(() => {
  const stick = document.getElementById("stick");
  const knob = document.getElementById("stick-knob");
  const btnAction = document.getElementById("btnAction");
  const btnAttack = document.getElementById("btnAttack");
  const btnUp = document.getElementById("btnUp");
  const btnWeapon = document.getElementById("btnWeapon");

  let active = false;
  let centerX = 0, centerY = 0;
  const R = 60;

  function reset(){
    active = false;
    input.touchActive = false;
    input.dx = 0;
    input.dy = 0;
    knob.style.transform = "translate(-50%,-50%)";
  }

  stick.addEventListener("pointerdown", (e) => {
    if (typeof shop !== "undefined" && shop.open) return;
    e.preventDefault();
    active = true;
    input.touchActive = true;
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

    knob.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
  });

  stick.addEventListener("pointerup", (e) => { e.preventDefault(); reset(); });
  stick.addEventListener("pointercancel", (e) => { e.preventDefault(); reset(); });

  btnAction.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (typeof shop !== "undefined" && shop.open) return;
    input.action = true;
  });

  btnAttack.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (typeof shop !== "undefined" && shop.open) return;
    input.run = true;
  });

  btnAttack.addEventListener("pointerup", (e) => {
    e.preventDefault();
    input.run = false;
  });

  btnAttack.addEventListener("pointercancel", (e) => {
    e.preventDefault();
    input.run = false;
  });

  if (btnUp) {
    btnUp.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      shop.toggle();
      reset();
      input.action = false;
      input.run = false;
    });
  }

  if (btnWeapon) {
    btnWeapon.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (typeof shop !== "undefined" && shop.open) return;
      nextWeapon();
    });
  }
})();