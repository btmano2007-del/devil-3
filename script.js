
(function () {
  const app = document.getElementById('la');
  const TOTAL = 4;
  let cur = 0, busy = false, prog = 0, progRaf;

  /* ── dots ── */
  const dots = [];
  const navd = document.getElementById('navd');
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'nd' + (i === 0 ? ' a' : '');
    d.addEventListener('click', () => go(i));
    navd.appendChild(d);
    dots.push(d);
  }

  const slides = Array.from({ length: TOTAL }, (_, i) => document.getElementById('s' + i));
  const lblEl  = document.getElementById('slbl');
  const pbarEl = document.getElementById('pbar');

  function setLabel(n) {
    lblEl.textContent = '0' + (n + 1) + ' / 0' + TOTAL;
  }

  /* ── per-slide entrances ── */
  const enter = {
    0: () => {
      setTimeout(() => {
        document.getElementById('o1').classList.add('r');
        document.getElementById('o2').classList.add('r');
        document.getElementById('tw').classList.add('r');
        document.getElementById('st').classList.add('r');
        document.getElementById('hb').classList.add('r');
        spawnPulse(0);
      }, 100);
    },
    1: () => {
      setTimeout(() => {
        document.getElementById('qc').classList.add('r');
        document.getElementById('ql').classList.add('r');
        typeIt('qt', 'The best thing to hold onto\nin life is each other.', 38);
      }, 180);
    },
    2: () => {
      setTimeout(() => {
        document.getElementById('pt').classList.add('r');
        [0, 1, 2].forEach(i =>
          setTimeout(() => document.getElementById('p' + i).classList.add('r'), i * 140)
        );
      }, 180);
    },
    3: () => {
      setTimeout(() => {
        document.getElementById('ct').classList.add('r');
        document.getElementById('cv').classList.add('r');
        document.getElementById('hr').classList.add('r');
      }, 180);
    }
  };

  /* ── per-slide resets ── */
  const exit = {
    0: () => ['o1', 'o2', 'tw', 'st', 'hb'].forEach(id => document.getElementById(id).classList.remove('r')),
    1: () => {
      document.getElementById('qc').classList.remove('r');
      document.getElementById('ql').classList.remove('r');
      document.getElementById('qt').innerHTML = '';
    },
    2: () => {
      document.getElementById('pt').classList.remove('r');
      [0, 1, 2].forEach(i => document.getElementById('p' + i).classList.remove('r'));
    },
    3: () => {
      document.getElementById('ct').classList.remove('r');
      document.getElementById('cv').classList.remove('r');
      document.getElementById('hr').classList.remove('r');
    }
  };

  function go(n) {
    if (n === cur || busy) return;
    busy = true;
    exit[cur]?.();
    slides[cur].classList.remove('on');
    dots[cur].classList.remove('a');
    cur = (n + TOTAL) % TOTAL;
    slides[cur].classList.add('on');
    dots[cur].classList.add('a');
    setLabel(cur);
    enter[cur]?.();
    resetProgress();
    setTimeout(() => { busy = false; }, 1500);
  }

  document.getElementById('nx').addEventListener('click', () => go(cur + 1));
  document.getElementById('pv').addEventListener('click', () => go(cur - 1));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft')  go(cur - 1);
  });

  /* ── auto-advance progress bar ── */
  function resetProgress() {
    cancelAnimationFrame(progRaf);
    prog = 0;
    pbarEl.style.width = '0%';
    const dur = 7000, start = Date.now();
    function tick() {
      prog = Math.min(100, (Date.now() - start) / dur * 100);
      pbarEl.style.width = Math.round(prog) + '%';
      if (prog < 100) { progRaf = requestAnimationFrame(tick); }
      else { go(cur + 1); }
    }
    progRaf = requestAnimationFrame(tick);
  }

  /* ── click: bloom hearts + reset timer ── */
  app.addEventListener('click', e => {
    if (e.target.closest('.na') || e.target.closest('.nav')) return;
    resetProgress();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const rh = document.createElement('div');
        rh.className = 'rh';
        rh.innerHTML = '&#9829;';
        rh.style.cssText = `left:${e.offsetX + (Math.random() - .5) * 28}px;top:${e.offsetY + (Math.random() - .5) * 20}px;font-size:${.85 + Math.random() * .7}rem`;
        app.appendChild(rh);
        setTimeout(() => rh.remove(), 1400);
      }, i * 110);
    }
  });

  /* ── mouse trail ── */
  let lastX = 0, lastY = 0;
  app.addEventListener('mousemove', e => {
    if (Math.abs(e.clientX - lastX) > 80 || Math.abs(e.clientY - lastY) > 80) {
      lastX = e.clientX; lastY = e.clientY;
      const t = document.createElement('div');
      t.className = 'rh';
      t.innerHTML = '&#9825;';
      t.style.cssText = `left:${e.offsetX}px;top:${e.offsetY}px;font-size:.7rem;color:rgba(192,80,80,.4)`;
      app.appendChild(t);
      setTimeout(() => t.remove(), 1300);
    }
  });

  /* ── initial load ── */
  enter[0]();
  setLabel(0);
  resetProgress();

  /* ── typewriter ── */
  function typeIt(id, txt, spd) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cur';
    el.appendChild(cursor);
    const iv = setInterval(() => {
      if (i < txt.length) {
        if (txt[i] === '\n') el.insertBefore(document.createElement('br'), cursor);
        else el.insertBefore(document.createTextNode(txt[i]), cursor);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => cursor.remove(), 650);
      }
    }, spd);
  }

  /* ── pulse rings on cover ── */
  function spawnPulse(slideIdx) {
    const s = document.getElementById('s' + slideIdx);
    s.querySelectorAll('.pulse').forEach(e => e.remove());
    [[-60, 20], [80, -30], [-40, 60], [70, 40]].forEach(([ox, oy]) => {
      const p = document.createElement('div');
      p.className = 'pulse';
      const sz = 28 + Math.random() * 22;
      p.style.cssText = `width:${sz}px;height:${sz}px;left:calc(50% + ${ox}px);top:calc(50% + ${oy}px);animation-delay:${Math.random() * 1.8}s;animation-duration:${2.2 + Math.random()}s`;
      s.appendChild(p);
    });
  }

  /* ── canvas particle field ── */
  const cvs = document.getElementById('pc');
  const ctx = cvs.getContext('2d');
  let W, H;

  function resize() {
    W = cvs.width  = app.offsetWidth;
    H = cvs.height = app.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const NUM = 65;
  const pts = Array.from({ length: NUM }, () => ({
    x:     Math.random() * 1000,
    y:     Math.random() * 700,
    vx:    (Math.random() - .5) * .22,
    vy:    (Math.random() - .5) * .22,
    r:     .4 + Math.random() * 1.4,
    a:     .08 + Math.random() * .38,
    heart: Math.random() < .2,
    phase: Math.random() * Math.PI * 2
  }));

  let frame = 0;

  function drawHeart(cx, cy, s, al) {
    ctx.save();
    ctx.globalAlpha = al;
    ctx.fillStyle = '#b84040';
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * .28);
    ctx.bezierCurveTo(cx, cy, cx - s * .75, cy - s * .18, cx - s * .75, cy + s * .1);
    ctx.bezierCurveTo(cx - s * .75, cy + s * .5, cx, cy + s * .78, cx, cy + s * .78);
    ctx.bezierCurveTo(cx, cy + s * .78, cx + s * .75, cy + s * .5, cx + s * .75, cy + s * .1);
    ctx.bezierCurveTo(cx + s * .75, cy - s * .18, cx, cy, cx, cy + s * .28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animPts() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const twinkle = p.a * (.5 + .5 * Math.sin(frame * .04 + p.phase));
      if (p.heart) {
        drawHeart(p.x, p.y, p.r * 3.8, twinkle * .55);
      } else {
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = '#d4a5a5';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
    requestAnimationFrame(animPts);
  }
  animPts();

  /* ── falling petals ── */
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.innerHTML = '&#9829;';
    p.style.cssText = `left:${Math.random() * 95}%;animation-duration:${9 + Math.random() * 10}s;animation-delay:${Math.random() * 14}s;font-size:${.65 + Math.random() * .8}rem`;
    app.appendChild(p);
  }

})();
