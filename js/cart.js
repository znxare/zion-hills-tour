/* Zion Hills — "Sink the putt" golf-cart page.
   Content: js/content.js (photos, contact, homes) + js/cart-content.js (holes, story, offers, intro) */
(function () {
  "use strict";
  const Z = window.ZION, C = window.CART;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const homes = Z.chapters.find((c) => c.type === "homes").homes;
  const O = C.offers || {};
  const on = (k) => O[k] && O[k].on;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // No cart number or source is added to messages (owner's choice).
  const wa = (text) => `https://wa.me/${Z.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  const tail = () => "";
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  // The visitor's real day and time, e.g. "Saturday · 10:42"
  function nowText() {
    const d = new Date();
    const day = d.toLocaleDateString("en-IN", { weekday: "long" });
    const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${day} · ${time}`;
  }

  /* ======================= Render ======================= */
  function petals(n) {
    let h = "";
    for (let i = 0; i < n; i++) {
      const x = Math.round(Math.random() * 100), d = 9 + Math.random() * 9, delay = -Math.random() * d, s = 9 + Math.random() * 9;
      h += `<span class="petal" style="--x:${x}%;--d:${d.toFixed(1)}s;--delay:${delay.toFixed(1)}s;--s:${s.toFixed(0)}px"><i></i></span>`;
    }
    return `<div class="petals" aria-hidden="true">${h}</div>`;
  }

  function render() {
    const nt = O.nineteenth || {}, tn = O.tonight || {};
    const quote = (C.residents || [])[1] || (C.residents || [])[0];

    $("#app").innerHTML = `
    <!-- 1. The city: film grit -->
    <section class="city" id="top" aria-label="The drive">
      <div class="stage">
        <img class="city-img" src="${esc(C.city.image)}" alt="" fetchpriority="high">
        <div class="scan"></div><div class="vignette"></div><div class="grain"></div><span class="strip"></span>
        <p class="mono timecode"><i></i><span class="live-time">${esc(nowText())}</span></p>
        <a class="mono linkish skip-intro" href="#holes">Skip intro ↓</a>
        <h2 class="city-words" aria-label="${esc(C.city.words.join(" "))}">${C.city.words.map((w) => `<span aria-hidden="true">${esc(w)}</span>`).join("")}</h2>
      </div>
    </section>

    <!-- 2. The switch: the dream of Zion Hills -->
    <section class="dream" aria-label="Zion Hills">
      <div class="stage">
        ${C.dream.video
          ? `<video class="dream-photo" muted playsinline loop preload="none" poster="${esc(C.dream.image)}" aria-label="A drone flight over the Zion Hills course"></video>`
          : `<img class="dream-photo" src="${esc(C.dream.image)}" alt="The Zion Hills course" loading="lazy">`}
        <div class="dream-wash"></div>
        ${petals(reduce ? 0 : 14)}
        <span class="float-ball" style="--s:26px;--x:12%;--y:22%;--delay:-2s" aria-hidden="true"></span>
        <span class="float-ball" style="--s:18px;--x:80%;--y:16%;--delay:-4s" aria-hidden="true"></span>
        <span class="float-ball" style="--s:34px;--x:72%;--y:64%;--delay:-1s" aria-hidden="true"></span>
        <div class="dream-dark"></div>
        <h2 class="dream-words" aria-label="${esc(C.dream.words.join(" "))}">${C.dream.words.map((w) => `<span aria-hidden="true">${esc(w)}</span>`).join("")}</h2>
        <p class="mono dream-line">${esc(C.dream.line)}</p>
      </div>
    </section>

    <!-- 3. 18 holes, one story -->
    <section class="sec" id="holes">
      <p class="eyebrow rv">Your round</p>
      <h2 class="rv">18 holes.<br>One story.</h2>
      <p class="lead rv">A playing tip for every hole — and a line about life for the people who live beside it.</p>
      ${C.yardage ? `
      <a class="yardbook rv" href="${esc(C.yardage)}" download>
        <span class="yardbook-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M6 2h11a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 2v16h10V4zm2 3h6v1.6H9zm0 3.4h6V12H9zm0 3.4h4v1.6H9z"/></svg></span>
        <span><b>Download the yardage book</b><small>All 18 holes · par, handicap and how to play them · PDF</small></span>
        <span class="yardbook-go" aria-hidden="true">↓</span>
      </a>` : ""}
      <div class="hole-nav" role="tablist" aria-label="Choose a hole">
        ${C.holes.map((_, i) => `<button role="tab" data-hole="${i}" aria-label="Hole ${i + 1}">${i + 1}</button>`).join("")}
      </div>
      <article class="hole" aria-live="polite"></article>
      <div class="hole-steps">
        <button class="btn line" data-step="-1">← Previous</button>
        <button class="btn dark" data-step="1">Next hole →</button>
      </div>
    </section>

    <!-- 3b. Zion Hills map: its own section -->
    ${Z.brand.mapUrl ? `
    <section class="sec mapsec" id="map">
      <p class="eyebrow rv">Find your way</p>
      <h2 class="rv">Zion Hills map</h2>
      <a class="mapbig rv" href="${esc(Z.brand.mapUrl)}" target="_blank" rel="noopener">
        <svg class="map-art" viewBox="0 0 400 240" aria-hidden="true">
          <rect width="400" height="240" fill="#3f7a2a"/>
          <g fill="#4d8c33"><path d="M-10 40 Q80 10 170 46 T400 30 V0 H-10Z"/><path d="M0 240 Q90 190 200 214 T410 196 V250 H0Z"/></g>
          <g fill="#7dbb4e">
            <path d="M28 70 C70 52 140 60 168 84 C186 100 160 120 128 112 C92 104 54 112 34 98 C18 88 16 76 28 70Z"/>
            <path d="M212 40 C262 30 330 44 352 70 C366 88 340 100 312 92 C282 84 240 86 220 72 C204 62 200 46 212 40Z"/>
            <path d="M190 140 C236 126 300 132 330 152 C350 166 332 188 296 182 C258 176 222 184 200 172 C182 162 178 146 190 140Z"/>
            <path d="M40 150 C70 140 110 150 120 170 C128 188 96 196 70 188 C46 182 26 166 40 150Z"/>
          </g>
          <g fill="#4aa3b8" opacity=".95">
            <path d="M120 118 C150 110 196 120 204 138 C210 152 180 160 150 152 C124 146 104 130 120 118Z"/>
            <path d="M330 104 C350 98 372 110 368 124 C364 136 342 136 330 128 C320 120 320 108 330 104Z"/>
          </g>
          <ellipse cx="170" cy="134" rx="13" ry="9" fill="#9fd46f" stroke="#e9ddc0" stroke-width="2"/>
          <g fill="#efe3c4"><ellipse cx="150" cy="82" rx="9" ry="4"/><ellipse cx="300" cy="62" rx="10" ry="4"/><ellipse cx="270" cy="168" rx="8" ry="4"/><ellipse cx="86" cy="164" rx="7" ry="3.5"/></g>
          <path class="cart" d="M20 120 C80 128 110 96 170 100 S260 120 300 110 S360 84 392 96" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>
          <g fill="#2f6320"><circle cx="196" cy="98" r="7"/><circle cx="206" cy="92" r="6"/><circle cx="60" cy="132" r="7"/><circle cx="72" cy="128" r="5"/><circle cx="352" cy="150" r="7"/><circle cx="246" cy="118" r="6"/><circle cx="258" cy="124" r="5"/></g>
          <g transform="translate(250 104)"><circle class="pulse" r="9" fill="#e8552e"/><circle r="9" fill="#e8552e" stroke="#fff" stroke-width="3"/><path d="M-3 4V-6l7 3-7 3" fill="#fff"/></g>
          <g fill="#fff" font-family="IBM Plex Mono, monospace" font-size="9" letter-spacing="1.2">
            <text x="262" y="99">CLUBHOUSE</text><text x="152" y="160">13</text><text x="40" y="62">FRONT 9</text><text x="290" y="30">VILLAS</text>
          </g>
          <g fill="#fff"><rect x="282" y="18" width="7" height="6" rx="1"/><rect x="330" y="20" width="7" height="6" rx="1"/><rect x="342" y="30" width="7" height="6" rx="1"/><rect x="362" y="22" width="7" height="6" rx="1"/></g>
        </svg>
        <span class="mapbig-copy">
          <span class="mapbig-note">Clubhouse · tees · homes · the way out</span>
          <span class="mapbig-btn">Open the live map <span aria-hidden="true">↗</span></span>
        </span>
      </a>
    </section>` : ""}

    <!-- 4. The homes they've been driving past -->
    <section class="sec tint" id="homes">
      <p class="eyebrow rv">Look around</p>
      <h2 class="rv">The homes you've been driving past.</h2>
      <p class="lead rv">Over 150 of them are already lived in.</p>
      <div class="cards">
        ${homes.map((x) => `
        <article class="card">
          <div class="card-img"><img src="${esc(x.image)}" alt="${esc(x.name)}" loading="lazy"><span class="tag">${esc(x.status)}</span></div>
          <div class="card-body">
            <h3>${esc(x.name)}</h3>
            <p class="muted">${esc(x.beds)}</p>
            <p class="size">${esc(x.size)}</p>
            <p class="price">${esc(x.price)}</p>
            <button class="btn dark sm" data-see="${esc(x.name)}">See it after my round</button>
            <a class="btn line sm" target="_blank" rel="noopener" href="${wa(`Hi, I'm on the course at Zion Hills. Please send me prices and the floor plan for the ${x.name}.${tail()}`)}">Prices & plan on WhatsApp</a>
          </div>
        </article>`).join("")}
      </div>
      ${quote ? `<blockquote class="pull rv"><p>${esc(quote.quote)}</p><cite>${esc(quote.who)}</cite></blockquote>` : ""}
      ${on("brochure") ? `
      <aside class="brochure rv">
        <div><h3>${esc(O.brochure.title)}</h3><p>${esc(O.brochure.text)}</p></div>
        <a class="btn dark wide" target="_blank" rel="noopener" href="${wa(`Hi, please send me the Zion Hills homes brochure and prices.${tail()}`)}">Send me the brochure & prices</a>
      </aside>` : ""}
    </section>

    <!-- 5. The main ask -->
    <section class="nineteenth" id="after">
      <img class="n-photo" src="${esc(IMG.clubLawn)}" alt="" loading="lazy">
      <div class="n-shade"></div>
      <div class="n-inner">
      <div class="n-head">
        <p class="eyebrow">${on("nineteenth") ? esc(nt.eyebrow || "") : "After your round"}</p>
        <svg class="seal" viewBox="0 0 120 120" aria-hidden="true">
          <defs><path id="seal-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs>
          <g class="seal-spin"><text><textPath href="#seal-ring" textLength="272">${esc((on("nineteenth") && nt.seal) || "THE 19TH HOLE · AT THE CLUBHOUSE · ")}</textPath></text></g>
          <circle cx="60" cy="60" r="27" class="seal-core"/>
          <path d="M55 74V44h1.6l.5 1.4H70l-4 6.6 4 6.6H57v15.4z" class="seal-flag"/>
        </svg>
      </div>
      <h2>${on("nineteenth") ? esc(nt.title).replace(/&lt;br&gt;/g, "<br>") : "See a home before you drive back."}</h2>
      <p class="lead">${on("nineteenth") ? esc(nt.text) : "We'll meet you at the clubhouse and walk you through a home, at your pace."}</p>
      <form id="after-form" novalidate>
        <label>I'd like to see
          <select name="home"><option value="">Not sure yet — show me around</option>${homes.map((x) => `<option>${esc(x.name)}</option>`).join("")}</select>
        </label>
        <button class="btn light wide" type="submit">${esc((on("nineteenth") && nt.button) || "Connect on WhatsApp")}</button>
        <p class="small">Prefer to talk? <a href="tel:${esc(Z.contact.phone)}">Call us now</a>.${Z.brand.mapUrl ? ` <a href="${esc(Z.brand.mapUrl)}" target="_blank" rel="noopener">Find the clubhouse on the map ↗</a>` : ""}</p>
      </form>
      </div>
    </section>

    <!-- 6. A second chance -->
    ${on("tonight") ? `
    <section class="tonight" id="tonight">
      <img src="${esc(IMG.sunset)}" alt="" loading="lazy">
      <div class="tonight-shade"></div>
      <div class="tonight-copy">
        <p class="eyebrow">Not ready to talk?</p>
        <h2>${esc(tn.title)}</h2>
        <p class="lead">${esc(tn.text)}</p>
        ${tn.discount ? `<p class="prize">${esc(tn.discount)}</p>` : ""}
        <div class="btns stack">
          <a class="btn light wide" target="_blank" rel="noopener" href="${wa(`Hi, I'm playing at Zion Hills today. Is a golf-side villa available tonight?${tail()}`)}">Is a villa free tonight? Ask on WhatsApp</a>
          <a class="btn glass wide" href="${esc(Z.brand.stayUrl)}" target="_blank" rel="noopener">Book a stay online</a>
        </div>
      </div>
    </section>` : ""}`;
  }

  /* ======================= Sound: putt effects + course ambience =======================
     Everything is synthesised in the browser (no audio files, no licences). Browsers only
     allow sound after a touch, so the putt itself switches it on. The music rises while
     you scroll and settles to a soft bed when you stop. Mute is remembered. */
  const Sound = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx = null, master, music, echo, playing = false, timers = [];
    let enabled = store.get("zh-sound") !== "off";
    const BED = .32, LIFT = .9;

    function ensure() {
      if (!AC) return null;
      if (!ctx) {
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = enabled ? 1 : 0; master.connect(ctx.destination);
        music = ctx.createGain(); music.gain.value = 0;
        const tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 2400;
        music.connect(tone); tone.connect(master);
        // a soft echo gives the notes some air
        echo = ctx.createDelay(1); echo.delayTime.value = .42;
        const fb = ctx.createGain(); fb.gain.value = .33;
        const wet = ctx.createGain(); wet.gain.value = .35;
        echo.connect(fb); fb.connect(echo); echo.connect(wet); wet.connect(tone);
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    function noise(dur) {
      const b = ctx.createBuffer(1, Math.max(1, ctx.sampleRate * dur | 0), ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const s = ctx.createBufferSource(); s.buffer = b; return s;
    }
    function blip(type, f0, f1, t, dur, peak, out = master) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
    }
    function burst(t, dur, freq, q, peak) {
      const n = noise(dur), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
      g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      n.connect(f); f.connect(g); g.connect(master); n.start(t);
    }

    // --- putt effects ---
    function tick() {                       // putter face meets the ball
      if (!ensure()) return; const t = ctx.currentTime;
      blip("sine", 1900, 900, t, .07, .22); burst(t, .04, 3200, 2, .25);
    }
    function roll(dur) {                    // the ball running across the green
      if (!ensure()) return; const t = ctx.currentTime;
      const n = noise(dur), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "lowpass"; f.frequency.value = 520;
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.09, t + .08); g.gain.linearRampToValueAtTime(.0001, t + dur);
      n.connect(f); f.connect(g); g.connect(master); n.start(t);
    }
    function drop() {                       // the sweetest sound in golf
      if (!ensure()) return; const t = ctx.currentTime;
      blip("sine", 240, 95, t, .16, .5); burst(t + .01, .05, 1400, 3, .22);
      blip("sine", 180, 80, t + .1, .14, .3); burst(t + .11, .04, 1800, 3, .12);
      blip("sine", 150, 70, t + .19, .1, .14);
      if (navigator.vibrate) try { navigator.vibrate([18, 60, 12]); } catch (e) { /* no haptics */ }
    }

    // --- course ambience: slow major-7th chords, a few piano-like notes, birds ---
    const CHORDS = [
      [130.81, 196.00, 246.94, 293.66, 329.63],  // Cmaj9
      [110.00, 164.81, 196.00, 246.94, 261.63],  // Am9
      [87.31, 130.81, 164.81, 196.00, 220.00],   // Fmaj9
      [98.00, 146.83, 164.81, 220.00, 246.94],   // G6/9
    ];
    const NOTES = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.5];
    function pad(chord, t, len) {
      chord.forEach((f, i) => {
        [0, 4].forEach((cents) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = cents ? "sine" : "triangle"; o.frequency.value = f; o.detune.value = cents + (i % 2 ? -3 : 3);
          g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.022, t + 2.6); g.gain.linearRampToValueAtTime(.0001, t + len + 2.5);
          o.connect(g); g.connect(music); o.start(t); o.stop(t + len + 2.6);
        });
      });
    }
    function pluck(t) {
      const f = NOTES[Math.random() * NOTES.length | 0], o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.05, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8);
      o.connect(g); g.connect(music); g.connect(echo); o.start(t); o.stop(t + 1.9);
    }
    function bird(t) {
      const base = 2600 + Math.random() * 1400, n = 2 + (Math.random() * 3 | 0);
      for (let i = 0; i < n; i++) {
        const s = t + i * (.09 + Math.random() * .05), o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(base, s); o.frequency.exponentialRampToValueAtTime(base * (1.3 + Math.random() * .3), s + .05);
        o.frequency.exponentialRampToValueAtTime(base * .9, s + .09);
        g.gain.setValueAtTime(.0001, s); g.gain.exponentialRampToValueAtTime(.018, s + .01); g.gain.exponentialRampToValueAtTime(.0001, s + .1);
        o.connect(g); g.connect(music); o.start(s); o.stop(s + .12);
      }
    }
    function loop(fn, min, max) {
      const run = () => { if (!playing) return; fn(ctx.currentTime + .05); timers.push(setTimeout(run, (min + Math.random() * (max - min)) * 1000)); };
      timers.push(setTimeout(run, min * 500));
    }
    function startMusic() {
      if (playing || !ensure()) return;
      playing = true;
      let k = 0;
      const chord = () => { if (!playing) return; pad(CHORDS[k++ % CHORDS.length], ctx.currentTime + .05, 7); timers.push(setTimeout(chord, 7000)); };
      chord();
      loop(pluck, 1.4, 3.2);
      loop(bird, 5, 12);
      music.gain.setTargetAtTime(BED, ctx.currentTime, 1.5);
    }
    let settle = null;
    function scrolling() {                  // music swells while you scroll
      if (!playing) return;
      music.gain.setTargetAtTime(LIFT, ctx.currentTime, .35);
      clearTimeout(settle);
      settle = setTimeout(() => music.gain.setTargetAtTime(BED, ctx.currentTime, 1.6), 900);
    }
    function setEnabled(v) {
      enabled = v; store.set("zh-sound", v ? "on" : "off");
      if (ensure()) master.gain.setTargetAtTime(v ? 1 : 0, ctx.currentTime, .15);
      if (v) startMusic();
    }
    // pause everything when the phone is locked or the tab is hidden
    document.addEventListener("visibilitychange", () => { if (!ctx) return; document.hidden ? ctx.suspend() : ctx.resume(); });
    return { ensure, tick, roll, drop, startMusic, scrolling, setEnabled, get enabled() { return enabled; } };
  })();

  function soundButton() {
    document.body.insertAdjacentHTML("beforeend",
      `<button class="sound" id="sound" aria-label="Music" aria-pressed="${Sound.enabled}"><span class="bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button>`);
    const b = $("#sound");
    b.addEventListener("click", () => { const v = !Sound.enabled; Sound.setEnabled(v); b.setAttribute("aria-pressed", v); });
    addEventListener("scroll", () => Sound.scrolling(), { passive: true });
  }

  /* ======================= 0. Gate: sink the putt ======================= */
  function gate() {
    const g = $("#gate"), ball = $("#ball"), face = $("#ball i"), cup = $(".cup"), msg = $(".gate-msg");
    $("#gate-title em").textContent = C.gate.title;
    $("#gate-title span").textContent = C.gate.sub;
    $(".gate-hint").textContent = C.gate.hint;

    // The putt is required on every visit and every refresh — no skipping (owner's choice).
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    scrollTo(0, 0);

    // Forgiving putt: tap, drag, flick or pull back — every gesture sinks it.
    // The green is drawn in perspective, so the ball shrinks as it rolls away and spins as it goes.
    let busy = false, drag = null, off = { x: 0, y: 0 }, travelled = 0;
    const centre = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
    let home = null;                                          // the ball's resting centre
    const depth = (dy) => { const c = centre(cup); return clamp(-dy / Math.max(1, home.y - c.y)); };
    const setBall = (dx, dy, s = 1, o = 1) => {
      if (!home) home = centre(ball);
      travelled += Math.hypot(dx - off.x, dy - off.y);
      off = { x: dx, y: dy };
      const k = (1 - .62 * depth(dy)) * s;                    // far away = smaller
      ball.style.transform = `translate(${dx}px, ${dy}px) scale(${k})`;
      ball.style.opacity = o;
      face.style.transform = `rotate(${(-travelled * 2.4).toFixed(1)}deg)`;
    };

    function animate(dur, step, done, ease = (k) => 1 - Math.pow(1 - k, 3)) {
      const t0 = performance.now();
      (function f(now) {
        const k = clamp((now - t0) / dur);
        step(ease(k), k);
        k < 1 ? requestAnimationFrame(f) : done && done();
      })(t0);
    }

    // Roll the ball from wherever it is now into the cup, with a little break, then open the page.
    function holeIt(line) {
      if (busy) return;
      busy = true; drag = null; ball.classList.add("moving");
      if (!home) home = centre(ball);
      const now = centre(ball), c = centre(cup);
      const sx = off.x, sy = off.y;
      const tx = sx + (c.x - now.x), ty = sy + (c.y - now.y) - 1;
      const brk = (Math.random() < .5 ? -1 : 1) * Math.min(22, Math.hypot(tx - sx, ty - sy) * .07);
      const dur = reduce ? 1 : 1350;
      msg.textContent = line || "";
      Sound.tick(); Sound.roll(dur / 1000);
      // a putt slows as it nears the hole: ease-out with a long tail
      animate(dur, (e) => setBall(sx + (tx - sx) * e + Math.sin(e * Math.PI) * brk, sy + (ty - sy) * e), () => {
        Sound.drop(); g.classList.add("sunk");
        animate(240, (e) => setBall(tx, ty + e * 3, 1 - e * .4, 1 - e), () => {
          msg.textContent = "In the hole.";
          setTimeout(() => close(true), 700);
        }, (k) => k * k);
      }, (k) => 1 - Math.pow(1 - k, 2.6));
    }

    function onDown(e) {
      if (busy) return;
      Sound.ensure();                                         // this touch unlocks sound on phones
      drag = { sx: e.clientX, sy: e.clientY, moved: 0, dy: 0 };
      ball.classList.add("moving");
      try { g.setPointerCapture(e.pointerId); } catch (err) { /* not supported */ }
    }
    function onMove(e) {
      if (!drag || busy) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      drag.moved = Math.max(drag.moved, Math.hypot(dx, dy)); drag.dy = dy;
      setBall(dx * .9, clamp(dy * .9, -innerHeight * .25, innerHeight * .12));
    }
    function onUp() {
      if (!drag || busy) return;
      const { moved, dy } = drag;
      holeIt(moved < 10 ? "Nice touch…" : dy > 0 ? "Pure strike…" : "Rolling…");
    }
    g.addEventListener("pointerdown", onDown);
    g.addEventListener("pointermove", onMove);
    g.addEventListener("pointerup", onUp);
    g.addEventListener("pointercancel", () => { if (!busy) { drag = null; setBall(0, 0); ball.classList.remove("moving"); } });
    ball.addEventListener("click", (e) => { if (e.detail === 0) { Sound.ensure(); holeIt("Nice touch…"); } }); // keyboard Enter/Space
    setTimeout(() => ball.focus({ preventScroll: true }), 300);

    function close(holed, instant, jump) {
      const finish = () => {
        g.remove(); document.body.classList.remove("gating");
        if (jump) { const t = $(jump); if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 60, behavior: "instant" }); }
        engineUpdate && engineUpdate();
      };
      if (Sound.enabled) Sound.startMusic();
      if (instant || reduce) { finish(); return; }
      g.classList.add("done");
      const c = centre(cup), max = Math.hypot(innerWidth, innerHeight) * 1.1;
      animate(holed ? 1100 : 600, (e) => {
        const r = (e * max).toFixed(1);
        const m = `radial-gradient(circle at ${c.x}px ${c.y}px, transparent ${r}px, #000 ${(+r + 1).toFixed(1)}px)`;
        g.style.webkitMaskImage = m; g.style.maskImage = m;
      }, finish, (k) => k * k * (3 - 2 * k));
    }
  }

  /* ======================= Holes + story ======================= */
  function actionHtml(kind) {
    if (kind === "contest" && on("contest")) {
      const ct = O.contest;
      return `<a class="btn dark wide sm" target="_blank" rel="noopener" href="${wa(`Here's my Shot of the Day from hole ${ct.hole} at Zion Hills! (photo attached)\nName: `)}">Send my photo on WhatsApp</a>
        <p class="tiny">Tap, then attach your photo in WhatsApp. ${esc(ct.terms)}</p>`;
    }
    if (kind === "tonight" && on("tonight")) return `<a class="btn line wide sm" href="#tonight">Stay the night →</a>`;
    if (kind === "nineteenth" && on("nineteenth")) return `<a class="btn dark wide" href="#after">See a home after your round</a>`;
    return "";
  }

  const photo = (i) => `images/holes/hole-${String(i + 1).padStart(2, "0")}.webp`;

  function holes() {
    const card = $(".hole"), btns = $$("[data-hole]");
    let cur = Math.min(17, Math.max(0, +(store.get("zh-hole") || 0)));
    function show(i) {
      cur = (i + 18) % 18;
      const x = C.holes[cur], s = (C.story || [])[cur] || {};
      card.innerHTML = `
        <figure class="hole-photo">
          <img src="${photo(cur)}" alt="Aerial view of hole ${cur + 1}" width="1280" height="600">
          <figcaption>
            <span class="hole-no"><small>Hole</small>${cur + 1}</span>
            <span class="hole-meta"><b>Par ${x.par}</b>${x.yds ? `<span class="yds">${x.yds} yards</span>` : ""}${x.hcp ? `<span>Handicap ${x.hcp}</span>` : ""}</span>
          </figcaption>
        </figure>
        ${x.badge ? `<p class="badge">${esc(x.badge)}</p>` : ""}
        <p class="tip">${esc(x.tip)}</p>
        ${s.text ? `
        <div class="lived${cur >= 9 ? " back" : ""}">
          <span>${esc(s.label || "If you lived here")}</span>
          <p>${esc(s.text)}</p>
          ${s.action ? `<div class="lived-act">${actionHtml(s.action)}</div>` : ""}
        </div>` : ""}`;
      btns.forEach((b, k) => { b.classList.toggle("on", k === cur); b.classList.toggle("seen", k < cur); b.setAttribute("aria-selected", k === cur); });
      const active = btns[cur], nav = $(".hole-nav");
      nav.scrollTo({ left: active.offsetLeft - nav.clientWidth / 2 + active.offsetWidth / 2, behavior: "smooth" });
      store.set("zh-hole", cur);
      // warm up the photos either side so swiping feels instant
      [cur + 1, cur - 1].forEach((k) => { const im = new Image(); im.src = photo((k + 18) % 18); });
    }
    btns.forEach((b) => b.addEventListener("click", () => show(+b.dataset.hole)));
    // swipe the hole card left/right to change hole
    let sx = null, sy = 0;
    card.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    card.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
    });
    $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
      show(cur + +b.dataset.step);
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }));
    show(cur);
  }

  /* ======================= Scroll engine ======================= */
  let engineUpdate = null;
  function engine() {
    const city = $(".city"), dream = $(".dream"), after = $("#after");
    const cw = $$(".city-words span"), dw = $$(".dream-words span"), line = $(".dream-line");
    let ticking = false;
    const prog = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };

    function update() {
      ticking = false;
      const pc = prog(city), pd = prog(dream);
      city.style.setProperty("--p", pc.toFixed(3));
      dream.style.setProperty("--p", pd.toFixed(3));
      const shown = Math.min(cw.length, 1 + Math.floor(pc * cw.length * 1.05));
      cw.forEach((w, i) => w.classList.toggle("on", i < shown));
      dw.forEach((w, i) => w.classList.toggle("on", pd > (i === 0 ? .14 : .32)));
      line.classList.toggle("on", pd > .5);

      const under = document.elementFromPoint(innerWidth / 2, 30);
      document.body.classList.toggle("on-dark", !!(under && under.closest(".city, .dream, .nineteenth, .tonight")));
    }
    engineUpdate = update;
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    addEventListener("pageshow", update);
    update();

    // gentle reveals
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in"); io.unobserve(e.target);
    }), { threshold: .12 });
    $$(".rv").forEach((el) => io.observe(el));

    // dream film: load only when the scene is close, play the drone segment on a loop
    const film = $("video.dream-photo");
    if (film) {
      const { from = 0, to = 0 } = C.dream;
      let loaded = false;
      const seekStart = () => { try { film.currentTime = from; } catch (e) { /* not ready */ } };
      film.addEventListener("loadedmetadata", seekStart);
      film.addEventListener("timeupdate", () => { if (to && (film.currentTime > to || film.currentTime < from - .5)) seekStart(); });
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          if (!loaded) { loaded = true; film.src = C.dream.video + (from ? `#t=${from}` : ""); }
          if (!reduce) { const p = film.play(); if (p && p.catch) p.catch(() => {}); }
        } else if (loaded) film.pause();
      }, { rootMargin: "100% 0px" }).observe(dream);
    }

    // keep the city clock showing the real time
    const clock = $(".live-time");
    setInterval(() => { clock.textContent = nowText(); }, 20000);
    const atIO = new IntersectionObserver(([e]) => document.body.classList.toggle("at-after", e.isIntersecting), { threshold: .15 });
    atIO.observe(after);
  }

  /* ======================= Dock, menu, booking ======================= */
  function wireSee(root = document) {
    $$("[data-see]", root).forEach((b) => b.addEventListener("click", () => {
      $("#after-form").elements.home.value = b.dataset.see;
      $("#after").scrollIntoView({ behavior: "smooth" });
    }));
  }

  function chrome() {
    $("#dock-wa").href = wa(`Hi, I'm on the course at Zion Hills and would like to know about the homes.${tail()}`);
    $(".dock-main").textContent = on("nineteenth") ? (O.nineteenth.dock || "See a home after your round") : "See a home after your round";

    // menu sheet
    const sheet = $("#sheet"), btn = $("#menu-btn");
    const links = [
      ["#holes", "Your round", "18 holes"],
      ["#homes", "The homes", "Look around"],
      ["#after", "After your round", "Clubhouse"],
      C.yardage && [C.yardage, "Yardage book", "PDF ↓"],
      on("tonight") && ["#tonight", "Stay tonight", "Villas"],
      Z.brand.mapUrl && [Z.brand.mapUrl, "Estate map", "Live ↗"],
      [`tel:${Z.contact.phone}`, "Call us", "Now"],
    ].filter(Boolean);
    $(".sheet-links").innerHTML = links.map(([h, t, s]) => `<a href="${esc(h)}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : /\.pdf$/.test(h) ? " download" : ""}>${esc(t)}<small>${esc(s)}</small></a>`).join("");
    const open = (v) => { sheet.hidden = !v; btn.setAttribute("aria-expanded", v); if (v) $(".sheet-links a").focus(); };
    btn.addEventListener("click", () => open(true));
    sheet.addEventListener("click", (e) => { if (e.target.closest("[data-close], .sheet-links a")) open(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) { open(false); btn.focus(); } });

    const form = $("#after-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // No name or phone needed: WhatsApp already tells you who they are.
      const home = form.elements.home.value;
      const msg = [
        home
          ? `Hi, I'm playing at Zion Hills. After my round I'd like to see the ${home}.`
          : "Hi, I'm playing at Zion Hills. After my round I'd like to see a home — please show me around.",
        "Please meet me at the clubhouse.",
      ].filter(Boolean).join("\n") + tail();
      window.open(wa(msg), "_blank", "noopener");
    });

  }

  render();
  holes();
  wireSee();
  chrome();
  engine();
  soundButton();
  gate();
})();
