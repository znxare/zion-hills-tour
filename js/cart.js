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
    const voices = (C.residents || []).filter((r) => r.photo).slice(0, 4);

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
        ${C.dream.shots
          ? `<div class="reel" aria-label="Scenes from Zion Hills"><img class="reel-poster" src="${esc(C.dream.image)}" alt="" loading="lazy"><video muted playsinline preload="none"></video><video muted playsinline preload="none"></video></div>`
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
      <h2 class="rv">18 holes. <br>One story.</h2>
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
    </section>

    <!-- 4b. In their words -->
    <section class="sec voices" id="voices">
      <p class="eyebrow v-eyebrow">In their words</p>
      <div class="tcar" aria-label="Residents, in their own words">
        ${voices.map((r, i) => `
        <figure class="tcard" data-i="${i}">
          <div class="tphoto"><img src="${esc(r.photo)}" alt="${esc(r.who)} at Zion Hills" loading="lazy"></div>
          <blockquote class="tq">${r.quote.split(" ").map((w, k) => `<span style="--k:${k}">${esc(w)}</span>`).join(" ")}</blockquote>
          <figcaption><b>${esc(r.who)}</b>${r.where ? `<span>${esc(r.where)}</span>` : ""}</figcaption>
        </figure>`).join("")}
      </div>
      <div class="tdots" aria-hidden="true">${voices.map((_, i) => `<i${i ? "" : ' class="on"'}></i>`).join("")}</div>
      ${on("brochure") ? `<a class="btn tbro" target="_blank" rel="noopener" href="${wa(`Hi, please send me the Zion Hills homes brochure and prices.${tail()}`)}">Send me the brochure & prices</a>` : ""}
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

  /* ======================= Sound: a tempo-locked score =======================
     Everything is synthesised in the browser (no audio files, no licences).
     The score runs on one clock — 80 BPM, 4/4, a bar every 3 s — so every musical event lands
     on the grid: chords change on the bar, a soft bass sits on each downbeat, the arpeggio is
     in time, and the dream film dissolves exactly on the downbeat.
       gate   — birdsong and a light breeze; putter, roll, cup rattle, a polite golf clap
       city   — a low drone and distant traffic (the drive you just made)
       dream  — the score opens up: bright chords and a rising arpeggio; the film cuts on the bar
       course — calm and spacious through the holes, map, homes and residents
       after  — warm and slower at the clubhouse
     Scenes change on the next bar, never mid-phrase. The mix is glued by a compressor and
     sits in a soft reverb. Scrolling lifts and brightens the music. Mute is remembered. */
  const Sound = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx = null, master, music, amb, fx, tone, verb, delay, noiseBuf, rumble, wind;
    let enabled = store.get("zh-sound") !== "off";
    let ambOn = false, musicOn = false, scene = "gate", wanted = "city", pending = null, timers = [];
    const BPM = 80, BEAT = 60 / BPM, BAR = BEAT * 4;
    const BED = .6, LIFT = 1;
    const C9 = [130.81, 196, 246.94, 293.66, 329.63], Am9 = [110, 164.81, 196, 246.94, 261.63],
      F9 = [87.31, 130.81, 164.81, 196, 220], G69 = [98, 146.83, 164.81, 220, 246.94],
      Fadd9 = [87.31, 130.81, 174.61, 220, 261.63], Dm9 = [73.42, 130.81, 174.61, 220, 261.63];
    const SCENES = {
      city: { prog: [[55, 82.41, 110, 130.81], [49, 73.42, 98, 116.54]], bars: 2, bright: 800, arp: "none", rumble: .07 },
      dream: { prog: [C9, F9, Am9, G69], bars: 1, bright: 3600, arp: "rise", rumble: 0, cut: true },
      course: { prog: [C9, Am9, F9, G69], bars: 2, bright: 2600, arp: "sparse", rumble: 0 },
      after: { prog: [Fadd9, C9, Dm9, G69], bars: 2, bright: 2000, arp: "slow", rumble: 0 },
    };

    function impulse(sec) {                  // a soft hall: decaying stereo noise
      const len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      return b;
    }
    function ensure() {
      if (!AC) return null;
      if (!ctx) {
        ctx = new AC();
        const comp = ctx.createDynamicsCompressor();      // glue the mix, keep peaks safe on phone speakers
        comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .3;
        master = ctx.createGain(); master.gain.value = enabled ? .9 : 0;
        comp.connect(master); master.connect(ctx.destination);
        verb = ctx.createConvolver(); verb.buffer = impulse(2.8);
        const verbOut = ctx.createGain(); verbOut.gain.value = .55; verb.connect(verbOut); verbOut.connect(comp);
        tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 2400; tone.Q.value = .4; tone.connect(comp);
        music = ctx.createGain(); music.gain.value = 0; music.connect(tone);
        const send = ctx.createGain(); send.gain.value = .45; music.connect(send); send.connect(verb);
        delay = ctx.createDelay(2); delay.delayTime.value = BEAT * .75;              // dotted eighth, in tempo
        const fb = ctx.createGain(); fb.gain.value = .28; const dOut = ctx.createGain(); dOut.gain.value = .3;
        delay.connect(fb); fb.connect(delay); delay.connect(dOut); dOut.connect(tone);
        amb = ctx.createGain(); amb.gain.value = .45; amb.connect(comp);
        fx = ctx.createGain(); fx.gain.value = .85; fx.connect(comp);              // putt sounds
        const fxVerb = ctx.createGain(); fxVerb.gain.value = .12; fx.connect(fxVerb); fxVerb.connect(verb);
        noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    function noise(loop) { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = !!loop; return s; }
    function blip(type, f0, f1, t, dur, peak, out = fx) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
    }
    function burst(t, dur, freq, q, peak, out = fx) {
      const n = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
      g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      n.connect(f); f.connect(g); g.connect(out); n.start(t, Math.random()); n.stop(t + dur + .02);
    }

    /* ---------- the course around you ---------- */
    function bird(t, vol) {
      const base = 2500 + Math.random() * 1600, n = 2 + (Math.random() * 4 | 0);
      for (let i = 0; i < n; i++) {
        const s = t + i * (.08 + Math.random() * .06), o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(base, s);
        o.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * .35), s + .045);
        o.frequency.exponentialRampToValueAtTime(base * .88, s + .09);
        g.gain.setValueAtTime(.0001, s); g.gain.exponentialRampToValueAtTime(vol, s + .01); g.gain.exponentialRampToValueAtTime(.0001, s + .1);
        o.connect(g); g.connect(amb); o.start(s); o.stop(s + .12);
      }
    }
    function startAmbience() {
      if (ambOn || !ensure()) return; ambOn = true;
      const n = noise(true), f = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), depth = ctx.createGain();
      wind = ctx.createGain(); wind.gain.value = 0;
      f.type = "bandpass"; f.frequency.value = 520; f.Q.value = .6;
      lfo.frequency.value = .09; depth.gain.value = 260; lfo.connect(depth); depth.connect(f.frequency); lfo.start();
      n.connect(f); f.connect(wind); wind.connect(amb); n.start();
      wind.gain.setTargetAtTime(.02, ctx.currentTime, 1.2);
      const chirp = () => { if (!ambOn) return; if (scene !== "city") bird(ctx.currentTime + .05, scene === "gate" ? .03 : .012); later(chirp, 2400 + Math.random() * 5600); };
      later(chirp, 600);
      const r = noise(true), rf = ctx.createBiquadFilter();
      rumble = ctx.createGain(); rumble.gain.value = 0;
      rf.type = "lowpass"; rf.frequency.value = 220; r.connect(rf); rf.connect(rumble); rumble.connect(amb); r.start();
    }
    function horn(t) {
      [392, 466].forEach((f, i) => {
        const o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = "square"; o.frequency.value = f; lp.type = "lowpass"; lp.frequency.value = 800;
        const s = t + i * .02, len = .22 + Math.random() * .2;
        g.gain.setValueAtTime(.0001, s); g.gain.exponentialRampToValueAtTime(.006, s + .03); g.gain.exponentialRampToValueAtTime(.0001, s + len);
        o.connect(lp); lp.connect(g); g.connect(amb); o.start(s); o.stop(s + len + .05);
      });
    }

    /* ---------- the putt ---------- */
    function tick() {
      if (!ensure()) return; const t = ctx.currentTime;
      blip("sine", 1350, 760, t, .09, .26); blip("triangle", 2600, 1800, t, .03, .1);
      blip("sine", 320, 180, t, .06, .14); burst(t, .025, 4200, 1.5, .16);
    }
    function roll(dur) {
      if (!ensure()) return; const t = ctx.currentTime;
      const n = noise(true), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "lowpass"; f.frequency.setValueAtTime(800, t); f.frequency.exponentialRampToValueAtTime(240, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.04, t + .06); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      n.connect(f); f.connect(g); g.connect(fx); n.start(t, Math.random()); n.stop(t + dur + .05);
    }
    function drop() {
      if (!ensure()) return; const t = ctx.currentTime;
      blip("sine", 260, 96, t, .17, .5); burst(t + .005, .05, 1500, 3, .2);
      [[.085, .3], [.15, .17], [.2, .09], [.235, .045]].forEach(([d, v]) => { blip("sine", 190 - d * 300, 80, t + d, .09, v); burst(t + d, .03, 1900, 4, v * .45); });
      const touched = !navigator.userActivation || navigator.userActivation.hasBeenActive;
      if (navigator.vibrate && touched) try { navigator.vibrate([18, 60, 12]); } catch (e) { /* no haptics */ }
    }
    function applause() {
      if (!ensure()) return; const t0 = ctx.currentTime + .45, len = 2.4;
      for (let i = 0; i < 40; i++) {
        const k = Math.pow(Math.random(), 1.6), s = t0 + k * len;
        burst(s, .03 + Math.random() * .02, 1100 + Math.random() * 1500, 1.2, .03 * (1 - k * .85));
      }
    }
    function whoosh() {
      if (!ensure()) return; const t = ctx.currentTime;
      const n = noise(true), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "bandpass"; f.Q.value = .8; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2400, t + .9);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.035, t + .45); g.gain.exponentialRampToValueAtTime(.0001, t + 1.2);
      n.connect(f); f.connect(g); g.connect(fx); n.start(t, Math.random()); n.stop(t + 1.3);
    }

    /* ---------- the instruments ---------- */
    let lastPad = null;
    function pad(chord, t, len) {
      if (lastPad) { lastPad.gain.setValueAtTime(lastPad.gain.value, t); lastPad.gain.linearRampToValueAtTime(.0001, t + 1.6); }  // crossfade chords
      const bus = ctx.createGain(); bus.gain.value = 1; bus.connect(music); lastPad = bus;
      chord.forEach((f, i) => {
        [0, 6].forEach((cents) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = cents ? "sine" : "triangle"; o.frequency.value = f; o.detune.value = cents + (i % 2 ? -4 : 4);
          g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.019, t + 1.4); g.gain.setValueAtTime(.019, t + len);
          g.gain.linearRampToValueAtTime(.0001, t + len + 2.2);
          o.connect(g); g.connect(bus); o.start(t); o.stop(t + len + 2.3);
        });
      });
    }
    function bass(f, t, len) {               // a warm sine on the downbeat
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.11, t + .04); g.gain.exponentialRampToValueAtTime(.03, t + len * .6); g.gain.exponentialRampToValueAtTime(.0001, t + len);
      o.connect(g); g.connect(music); o.start(t); o.stop(t + len + .05);
    }
    function note(f, t, vol, len = 1.8, toDelay = true) {   // a soft piano-like bell
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
      o.type = "sine"; o.frequency.value = f; o2.type = "sine"; o2.frequency.value = f * 2.005; g2.gain.value = .22;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + len);
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(music); if (toDelay) g.connect(delay);
      o.start(t); o2.start(t); o.stop(t + len + .05); o2.stop(t + len + .05);
    }

    /* ---------- the sequencer ---------- */
    let clock = null, nextT = 0, beat = 0, barInChord = 0, chordIx = 0, chord = C9, barFn = null;
    const tones = (c) => c.slice(1).map((f) => f * 2);      // the chord's colour tones, an octave up
    function onBeat(n, t) {
      const S = SCENES[scene], b = n % 4;
      if (b === 0) {
        if (pending) {                                     // scenes change on the bar
          scene = pending; pending = null; applyScene(t); barInChord = 0; chordIx = 0;
          note(SCENES[scene].prog[0][2] * 4, t, .045, 2.6);   // a bell marks the new chapter
        }
        const S2 = SCENES[scene];
        if (barInChord % S2.bars === 0) { chord = S2.prog[chordIx++ % S2.prog.length]; pad(chord, t, S2.bars * BAR); }
        barInChord++;
        bass(chord[0] < 80 ? chord[0] : chord[0] / 2, t, BAR * .95);
        if (S2.cut && barFn) barFn(t + BAR);                // tell the film where the next downbeat is
        if (scene === "city" && Math.random() < .35) horn(t + BEAT * (1 + (Math.random() * 2 | 0)));
      }
      const tt = tones(chord);
      if (S.arp === "rise") {                              // eighth-note arpeggio climbing through the bar
        [0, .5].forEach((h, k) => { const i = b * 2 + k; if (i % 2 === 0 || Math.random() < .5) note(tt[i % tt.length] * (i >= tt.length ? 2 : 1), t + h * BEAT, .03, 1.4); });
      } else if (S.arp === "sparse") {
        if ((b === 0 || b === 2) && Math.random() < .55) note(tt[(Math.random() * tt.length) | 0] * 2, t, .03, 2);
      } else if (S.arp === "slow") {
        if (b === 0 && Math.random() < .7) note(tt[(Math.random() * tt.length) | 0] * 2, t, .028, 2.4);
      }
    }
    function schedule() {
      while (nextT < ctx.currentTime + .2) { onBeat(beat, nextT); nextT += BEAT; beat++; }
    }
    function applyScene(t = ctx.currentTime) {
      const S = SCENES[scene];
      if (rumble) rumble.gain.setTargetAtTime(S.rumble, t, 1);
      if (wind) wind.gain.setTargetAtTime(scene === "city" ? 0 : .008, t, 1.2);
      tone.frequency.setTargetAtTime(S.bright, t, 1.2);
    }
    function startMusic() {
      if (musicOn || !ensure()) return; musicOn = true;
      startAmbience();
      scene = wanted; applyScene();
      nextT = ctx.currentTime + .12; beat = 0; barInChord = 0; chordIx = 0;
      clearInterval(clock); clock = setInterval(schedule, 25); schedule();
      music.gain.setTargetAtTime(BED, ctx.currentTime, 1.5);
    }
    function setScene(name) {
      if (!SCENES[name]) return;
      wanted = name;
      if (!musicOn) return;
      if (name !== scene) pending = name;
    }
    function quant(div = 2) {                // the next eighth note on the grid
      const step = BEAT / div, since = ctx.currentTime - (nextT - BEAT);
      return ctx.currentTime + (step - (since % step)) % step + .01;
    }
    let lastText = 0;
    function words(count) {                   // text arriving: a short rising phrase, in key and in time
      if (!musicOn || !enabled) return;
      const now = performance.now(); if (now - lastText < 600) return; lastText = now;
      const tt = tones(chord), notes = Math.min(5, Math.max(2, Math.round(count / 4))), t0 = quant(2);
      for (let i = 0; i < notes; i++) note(tt[i % tt.length] * 2, t0 + i * BEAT / 2, .026, 1.6);
    }
    function thud() {
      if (!musicOn || !enabled) return;
      blip("sine", 110, 55, quant(4), .3, .1, music);
    }
    let settle = null, lastY = scrollY, lastT = performance.now();
    function scrolling() {                    // the scroll is an instrument: speed lifts and brightens the score
      if (!musicOn) return;
      const now = performance.now(), v = Math.abs(scrollY - lastY) / Math.max(16, now - lastT) * 1000;
      lastY = scrollY; lastT = now;
      const S = SCENES[scene];
      music.gain.setTargetAtTime(LIFT, ctx.currentTime, .4);
      tone.frequency.setTargetAtTime(Math.min(6000, S.bright + v * 1.4), ctx.currentTime, .3);
      clearTimeout(settle);
      settle = setTimeout(() => {
        music.gain.setTargetAtTime(BED, ctx.currentTime, 1.5);
        tone.frequency.setTargetAtTime(S.bright, ctx.currentTime, 1.3);
      }, 800);
    }
    function setEnabled(v) {
      enabled = v; store.set("zh-sound", v ? "on" : "off");
      if (ensure()) master.gain.setTargetAtTime(v ? .9 : 0, ctx.currentTime, .15);
      if (v) startMusic();
    }
    document.addEventListener("visibilitychange", () => { if (!ctx) return; document.hidden ? ctx.suspend() : ctx.resume(); });
    return {
      ensure, startAmbience, tick, roll, drop, applause, whoosh, startMusic, setScene, scrolling, setEnabled, words, thud,
      // the film asks to be told, one bar ahead, when the next downbeat will sound (in ms from now)
      onBar(fn) { barFn = (t) => fn(Math.max(0, (t - ctx.currentTime + (ctx.outputLatency || ctx.baseLatency || 0)) * 1000)); },
      get bar() { return BAR; }, get playing() { return musicOn && enabled && !!ctx && ctx.state === "running"; }, get enabled() { return enabled; },
    };
  })();

  function soundScenes() {
    const map = [[".city", "city"], [".dream", "dream"], ["#holes", "course"], ["#map", "course"], ["#homes", "course"], ["#voices", "course"], ["#after", "after"]];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) Sound.setScene(e.target.dataset.scene); }), { rootMargin: "-50% 0px -50% 0px" });
    map.forEach(([sel, name]) => { const el = $(sel); if (el) { el.dataset.scene = name; io.observe(el); } });
  }

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
        Sound.drop(); Sound.applause(); g.classList.add("sunk");
        animate(240, (e) => setBall(tx, ty + e * 3, 1 - e * .4, 1 - e), () => {
          msg.textContent = "In the hole.";
          setTimeout(() => close(true), 700);
        }, (k) => k * k);
      }, (k) => 1 - Math.pow(1 - k, 2.6));
    }

    function onDown(e) {
      if (busy) return;
      Sound.ensure(); if (Sound.enabled) Sound.startAmbience(); // this touch unlocks sound: birds and a breeze
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
    ball.addEventListener("click", (e) => { if (e.detail === 0) { Sound.ensure(); if (Sound.enabled) Sound.startAmbience(); holeIt("Nice touch…"); } }); // keyboard Enter/Space
    setTimeout(() => ball.focus({ preventScroll: true }), 300);

    function close(holed, instant, jump) {
      const finish = () => {
        g.remove(); document.body.classList.remove("gating");
        if (jump) { const t = $(jump); if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 60, behavior: "instant" }); }
        engineUpdate && engineUpdate();
      };
      if (Sound.enabled) { Sound.whoosh(); Sound.startMusic(); }
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
      cw.forEach((w, i) => { const was = w.classList.contains("on"); w.classList.toggle("on", i < shown); if (!was && i < shown && i > 0) Sound.thud(); });
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
      if (/^H[23]$/.test(e.target.tagName)) Sound.words(e.target.textContent.split(/\s+/).length, .05);
    }), { threshold: .12 });
    $$(".rv").forEach((el) => io.observe(el));

    // dream reel — edited like a film, not a slideshow:
    //  · the next shot starts playing hidden 1.4 s early, so it is already moving when it appears
    //  · a long eased dissolve (1.4 s) is centred on the music's downbeat
    //  · the outgoing shot keeps moving through the dissolve; it only stops once it is invisible
    //  · a dissolve only begins once the incoming shot has really started playing — never a frozen frame
    //  · a slow pull-out runs unbroken on each shot (no zoom snaps)
    const reel = $(".reel");
    if (reel && C.dream.shots) {
      const shots = C.dream.shots, n = shots.length, FADE = 1400, PRE = 1400;
      const conn = navigator.connection || {};
      const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4;
      const q = lowMem || conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || "") ? "720p" : "1080p";
      let [cur, nxt] = $$("video", reel), next = 1, live = false, loaded = false, planned = false, own = null;
      const play = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
      function cue(v, shot) {
        v.classList.remove("run");
        const go = () => { try { v.currentTime = shot.t; } catch (e) { /* not ready */ } v.playbackRate = shot.rate || 1; };
        v.readyState >= 1 ? go() : v.addEventListener("loadedmetadata", go, { once: true });
      }
      function rolling(v, since) { return !v.paused && v.readyState >= 3 && v.currentTime > since + .04; }
      // plan a dissolve whose midpoint lands `ms` from now
      function plan(ms) {
        if (!live || planned) return;
        planned = true;
        const shot = shots[next], startAt = shot.t;
        setTimeout(() => { if (!live) return; nxt.playbackRate = shot.rate || 1; nxt.classList.add("run"); play(nxt); }, Math.max(0, ms - PRE));
        const dissolve = (tries) => {
          if (!live) { planned = false; return; }
          if (!rolling(nxt, startAt) && tries < 6) { setTimeout(() => dissolve(tries + 1), 250); return; }   // wait for real motion
          nxt.classList.add("show"); cur.classList.remove("show");
          const old = cur; cur = nxt; nxt = old;
          next = (next + 1) % n;
          planned = false;
          setTimeout(() => { old.pause(); cue(old, shots[next]); }, FADE + 200);
        };
        setTimeout(() => dissolve(0), Math.max(0, ms - FADE / 2));
      }
      Sound.onBar(plan);
      function start() {
        if (!loaded) {
          loaded = true;
          [cur, nxt].forEach((v) => { v.preload = "auto"; v.src = C.dream.film(q); });
          cue(cur, shots[0]); cue(nxt, shots[1]);
        }
        live = true; cur.classList.add("run", "show"); play(cur);
        // when the music is off, the reel keeps the same bar length on its own clock
        clearInterval(own); own = setInterval(() => { if (!Sound.playing) plan(PRE + 200); }, Sound.bar * 1000);
      }
      function stop() { live = false; planned = false; clearInterval(own); $$("video", reel).forEach((v) => v.pause()); }
      if (!reduce) new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "60% 0px" }).observe(dream);
    }

    // in their words: each quote arrives word by word, with notes; the carousel turns itself
    const car = $(".tcar");
    if (car) {
      const cards = $$(".tcard", car), dots = $$(".tdots i");
      let seen = false, cur = 0, auto = null, held = false;
      const light = (i) => {
        cards.forEach((c, k) => c.classList.toggle("on", k === i && seen));
        dots.forEach((d, k) => d.classList.toggle("on", k === i));
        if (seen) Sound.words($$("span", cards[i]).length);
      };
      const cio = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.intersectionRatio > .6) { const i = +e.target.dataset.i; if (i !== cur) { cur = i; light(i); } }
      }), { root: car, threshold: [.6] });
      cards.forEach((c) => cio.observe(c));
      const turn = () => { if (held || !seen) return; car.scrollTo({ left: cards[(cur + 1) % cards.length].offsetLeft - car.offsetLeft, behavior: "smooth" }); };
      car.addEventListener("touchstart", () => { held = true; }, { passive: true });
      car.addEventListener("touchend", () => { setTimeout(() => { held = false; }, 4000); }, { passive: true });
      new IntersectionObserver(([e]) => {
        seen = e.isIntersecting; light(cur);
        clearInterval(auto); if (seen && !reduce) auto = setInterval(turn, 7000);
      }, { threshold: .55 }).observe($("#voices"));
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
  soundScenes();
  gate();
})();
