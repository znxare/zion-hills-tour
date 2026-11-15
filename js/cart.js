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
        <div class="dream-grade" aria-hidden="true"></div>
        <h2 class="dream-words" aria-label="${esc(C.dream.words.join(" "))}">${C.dream.words.map((w, k) => k === 0
          ? `<span aria-hidden="true">${esc(w)}</span>`
          : `<span aria-hidden="true">${(() => { let n = 0; return w.split(" ").map((word) => `<b class="wd">${[...word].map((ch) => `<i style="--i:${n++}">${esc(ch)}</i>`).join("")}</b>`).join(" "); })()}</span>`).join("")}</h2>
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

    <!-- 3b. Find your way: the real Zion Hills map (zion.ormcrm.com), previewed, live on tap -->
    ${Z.brand.mapUrl ? `
    <section class="sec mapsec" id="map">
      <p class="eyebrow rv">Zion Hills · map & directions</p>
      <h2 class="rv">Find your way.</h2>
      <div class="lmap-wrap">
        <button class="lmap-done mono" type="button" hidden>Done ✕</button>
        <div class="lmap">
          <img class="lmap-preview" src="images/live-map.webp" alt="The Zion Hills estate map" loading="lazy">
          <button class="lmap-open" type="button"><span class="lmap-dot"></span>Explore the live map</button>
        </div>
      </div>
      <p class="lmap-note">Search any place, see the plots and get directions on the estate's main roads. Directions don't follow the cart paths.</p>
      <div class="emap-actions">
        <a class="btn wa-home" href="${esc(Z.brand.mapUrl)}" target="_blank" rel="noopener">Open full screen ↗</a>
        <a class="btn line" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Zion Hills Golf County, Kolar")}" target="_blank" rel="noopener">Directions</a>
      </div>
    </section>` : ""}

    <!-- 4. The homes they've been driving past -->
    <section class="sec tint" id="homes">
      <p class="eyebrow rv">Look around</p>
      <h2 class="rv">The homes you've been driving past.</h2>
      <p class="lead rv">Over 150 of them are already lived in.</p>
      <div class="cards focus">
        ${homes.map((x, i) => `
        <article class="card" aria-label="${esc(x.name)}, ${i + 1} of ${homes.length}">
          <div class="card-img"><img src="${esc(x.image)}" alt="${esc(x.name)}" loading="lazy"><span class="tag">${esc(x.status)}</span><span class="count mono">${i + 1} / ${homes.length}</span></div>
          <div class="card-body">
            <h3>${esc(x.name)}</h3>
            <p class="facts">${esc(x.beds)} · ${esc(x.size)}</p>
            <p class="price">${esc(x.price)}</p>
            <a class="btn wa-home" target="_blank" rel="noopener" href="${wa(`Hi, I'm on the course at Zion Hills. Please send me prices and the floor plan for the ${x.name}.${tail()}`)}">Prices & floor plan on WhatsApp</a>
            <button class="linkish see" data-see="${esc(x.name)}">See it after my round →</button>
          </div>
        </article>`).join("")}
      </div>
      <div class="hdots" aria-hidden="true">${homes.map((_, i) => `<i${i ? "" : ' class="on"'}></i>`).join("")}<span class="swipe-hint inline dark" data-for="cards">Swipe <i>→</i></span></div>
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
      <div class="tdots" aria-hidden="true">${voices.map((_, i) => `<i${i ? "" : ' class="on"'}></i>`).join("")}<span class="swipe-hint inline" data-for="tcar">Swipe <i>→</i></span></div>
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
        <label>I'd like to know about
          <select name="home"><option value="">Zion Hills in general</option>${homes.map((x) => `<option>${esc(x.name)}</option>`).join("")}</select>
        </label>
        <button class="btn light wide wa-btn" type="submit"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>${esc((on("nineteenth") && nt.button) || "Chat with us on WhatsApp")}</button>
        <div class="n-actions">
          <a class="btn glass" href="tel:${esc(Z.contact.phone)}">Call us</a>
          ${Z.brand.mapUrl ? `<a class="btn glass" href="${esc(Z.brand.mapUrl)}" target="_blank" rel="noopener">Clubhouse map ↗</a>` : ""}
        </div>
      </form>
      </div>
    </section>

    <!-- 6. The close -->
    <section class="thanks" id="thanks" aria-label="Thank you">
      <img class="t-photo" src="${esc(IMG.sunset)}" alt="" loading="lazy">
      <div class="t-shade"></div>
      <div class="t-in">
        <img class="t-logo" src="images/zion-logo-white.svg" alt="Zion Hills Golf County">
        <h2 class="t-title"><span>Thank you</span><span>for the round.</span></h2>
        <p class="t-line">We hope the next one is on your home course.</p>
        <a class="t-top mono" href="#top">Back to the first tee ↑</a>
      </div>
    </section>

    <!-- 7. A second chance -->
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
    const BED = .34, LIFT = .55;
    const C9 = [130.81, 196, 246.94, 293.66, 329.63], Am9 = [110, 164.81, 196, 246.94, 261.63],
      F9 = [87.31, 130.81, 164.81, 196, 220], G69 = [98, 146.83, 164.81, 220, 246.94],
      Fadd9 = [87.31, 130.81, 174.61, 220, 261.63], Dm9 = [73.42, 130.81, 174.61, 220, 261.63];
    // the "royal road" progression (IV–V–iii–vi): warm, hopeful, a little bittersweet
    const Fma7 = [87.31, 130.81, 164.81, 220, 261.63], G6 = [98, 146.83, 196, 246.94, 329.63],
      Em7 = [82.41, 123.47, 196, 246.94, 293.66], Am7 = [110, 164.81, 196, 261.63, 329.63];
    const SCENES = {
      city: { prog: [[55, 82.41, 110, 130.81], [49, 73.42, 98, 116.54]], bars: 2, bright: 800, arp: "none", rumble: .07, mel: "city" },
      dream: { prog: [Fma7, G6, Em7, Am7], bars: 1, bright: 4200, arp: "none", rumble: 0, cut: true, mel: "theme", strings: true },
      course: { prog: [Fma7, G6, Em7, Am7], bars: 2, bright: 2800, arp: "none", rumble: 0, mel: "echo", strings: true },
      after: { prog: [Fadd9, C9, Dm9, G69], bars: 2, bright: 2200, arp: "none", rumble: 0, mel: "home", strings: true },
    };
    // melodies: [beat in the phrase, note in Hz, length in beats] — one line per bar of the progression
    const N = { A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5 };
    const MEL = {
      theme: [                                   // the Zion Hills theme: rises, sighs, rises higher, comes home
        [[0, N.C5, 1], [1, N.E5, 1], [2, N.G5, 2]],
        [[0, N.D5, 1], [1, N.E5, 1], [2, N.B4, 2]],
        [[0, N.E5, 1], [1, N.G5, 1], [2, N.B5, 1], [3, N.A5, 1]],
        [[0, N.G5, 2], [2, N.E5, 2]],
      ],
      echo: [[[0, N.C5, 2]], [], [[0, N.E5, 2], [2, N.D5, 2]], []],
      home: [[[0, N.A4, 1], [1, N.C5, 1], [2, N.E5, 2]], [[0, N.G5, 4]], [[0, N.D5, 1], [1, N.F5 || 698.46, 1], [2, N.E5, 2]], [[0, N.D5, 4]]],
      city: [[[2, 220, 2]], [], [[2, 196, 2]], []],
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
        master = ctx.createGain(); master.gain.value = enabled ? .75 : 0;
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
      // (no breeze or traffic layer: continuous noise read as radio static on phone speakers)
      const chirp = () => { if (!ambOn) return; if (scene !== "city") bird(ctx.currentTime + .05, scene === "gate" ? .03 : .012); later(chirp, 2400 + Math.random() * 5600); };
      later(chirp, 600);

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
      f.type = "lowpass"; f.frequency.setValueAtTime(420, t); f.frequency.exponentialRampToValueAtTime(160, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.025, t + .06); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
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
      blip("sine", 180, 46, t, 1.3, .14);                 // a soft, deep fall
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
          g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.012, t + 1.4); g.gain.setValueAtTime(.012, t + len);
          g.gain.linearRampToValueAtTime(.0001, t + len + 2.2);
          o.connect(g); g.connect(bus); o.start(t); o.stop(t + len + 2.3);
        });
      });
    }
    function strings(chord, t, len) {        // warm ensemble: detuned saws, slow bow, soft filter
      const lp = ctx.createBiquadFilter(), g = ctx.createGain();
      lp.type = "lowpass"; lp.frequency.value = 1300; lp.Q.value = .3;
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.014, t + 1.8); g.gain.setValueAtTime(.014, t + len);
      g.gain.linearRampToValueAtTime(.0001, t + len + 1.6);
      lp.connect(g); g.connect(music);
      chord.slice(1).forEach((f) => [-7, 0, 7].forEach((c) => {
        const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = c;
        o.connect(lp); o.start(t); o.stop(t + len + 1.7);
      }));
    }
    function piano(f, t, beats, vol = .07) { // a felt piano: struck partials that decay, a touch of hammer
      const len = Math.max(1.6, beats * BEAT * 1.6), g = ctx.createGain();
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(vol * .35, t + .35);
      g.gain.exponentialRampToValueAtTime(.0001, t + len);
      [[1, 1], [2, .42], [3, .16], [4, .06]].forEach(([h, a]) => {
        const o = ctx.createOscillator(), og = ctx.createGain(); o.type = "sine"; o.frequency.value = f * h * (h > 1 ? 1.0015 : 1);
        og.gain.value = a; o.connect(og); og.connect(g); o.start(t); o.stop(t + len + .05);
      });
      g.connect(music); g.connect(delay);
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
        if (barInChord % S2.bars === 0) {
          chord = S2.prog[chordIx++ % S2.prog.length]; pad(chord, t, S2.bars * BAR);
          if (S2.strings && lift > 0) strings(chord, t, S2.bars * BAR);
        }
        const line = MEL[S2.mel], phraseBar = Math.floor((chordIx - 1) % S2.prog.length);
        if (line && barInChord % S2.bars === 0) (line[phraseBar] || []).forEach(([b0, f, len]) => piano(f, t + b0 * BEAT, len, scene === "dream" ? .075 : .05));
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
    let lift = 1;                                // strings in once the music has bloomed
    let building = null;
    function build() {                           // "This could be" — a soft swell rises underneath
      if (!musicOn || !enabled) return;
      const t = ctx.currentTime, g = ctx.createGain();
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 2.8); g.connect(music);
      [Fma7[1] * 2, Fma7[2] * 2, Fma7[3] * 2].forEach((f) => {           // a string swell, rising in volume
        const o = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(), v = ctx.createGain();
        o.type = "sawtooth"; o2.type = "sawtooth"; o.frequency.value = f; o2.frequency.value = f; o2.detune.value = 8;
        lp.type = "lowpass"; lp.frequency.setValueAtTime(500, t); lp.frequency.exponentialRampToValueAtTime(2600, t + 3);
        v.gain.value = .012; o.connect(lp); o2.connect(lp); lp.connect(v); v.connect(g);
        o.start(t); o2.start(t); o.stop(t + 3.6); o2.stop(t + 3.6);
      });
      building = g;
      music.gain.setTargetAtTime(BED * .7, t, .4);                 // hush before the bloom
    }
    function bloom() {                           // "your home course." — the music opens up
      if (!musicOn || !enabled) return;
      const t = ctx.currentTime + .02;
      if (building) { building.gain.cancelScheduledValues(t); building.gain.setTargetAtTime(.0001, t, .08); building = null; }
      blip("sine", 70, 38, t, 1.2, .22, music);                    // a deep, soft impact
      [Fma7, [174.61, 261.63, 329.63, 440, 523.25]].forEach((c) => strings(c, t, BAR * 1.5));
      [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => piano(f, t + i * .09, 3, .06));
      music.gain.setTargetAtTime(LIFT, t, .5);
      tone.frequency.setTargetAtTime(5200, t, .4);
      setTimeout(() => music.gain.setTargetAtTime(BED, ctx.currentTime, 2.5), 4000);
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
      if (ensure()) master.gain.setTargetAtTime(v ? .75 : 0, ctx.currentTime, .15);
      if (v) startMusic();
    }
    document.addEventListener("visibilitychange", () => { if (!ctx) return; document.hidden ? ctx.suspend() : ctx.resume(); });
    const RUN = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98];   // C major pentatonic, two octaves
    function bellFx(f, t, vol, len = 1.6) {     // a clear bell on the effects bus (plays even before the music starts)
      [[f, vol], [f * 2.005, vol * .25]].forEach(([fr, v]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = fr;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + len);
        o.connect(g); g.connect(fx); o.start(t); o.stop(t + len + .05);
      });
    }
    function type(n, gap = .055) {            // words being written: soft pen taps, in step with the text
      if (!enabled || !ensure()) return;
      const t0 = ctx.currentTime + .03;
      for (let i = 0; i < n; i++) {
        const t = t0 + i * gap, f = 2300 + Math.random() * 700;
        blip("sine", f, f * .7, t, .03, .016 + Math.random() * .008); blip("sine", 520, 300, t, .03, .008);
      }
    }
    const SLIDE = [392, 440, 523.25, 587.33, 659.25, 783.99];
    let lastSlide = 0;
    function slide(i) {                       // a card settling into place: a soft click and a note
      if (!enabled || !ensure()) return;
      const now = performance.now(); if (now - lastSlide < 120) return; lastSlide = now;
      const t = ctx.currentTime;
      blip("sine", 1300, 760, t, .045, .06); bellFx(SLIDE[i % SLIDE.length], t + .02, .045, 1.2);
    }
    let finaled = false;
    function finale() {                       // the last chord: a slow, warm C major arpeggio that rings out
      if (finaled || !enabled || !ensure()) return; finaled = true;
      const t = ctx.currentTime + .15;
      blip("sine", 65.4, 65.4, t, 4, .12, fx);
      [261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((f, i) => bellFx(f, t + i * .22, .04, 4));
    }
    function flight(dur) {                    // the ball in the air: a gentle rising tone that fades as it lands
      if (!enabled || !ensure()) return;
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(1250, t + dur * .55); o.frequency.exponentialRampToValueAtTime(880, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.022, t + .25); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(fx); o.start(t); o.stop(t + dur + .05);
    }
    function land() {                         // a soft landing on the green
      if (!enabled || !ensure()) return;
      const t = ctx.currentTime;
      blip("sine", 240, 120, t, .12, .07); bellFx(1046.5, t + .03, .02, .9);
    }
    let lastSel = 0;
    function select(i) {
      if (!enabled || !ensure()) return;
      const now = performance.now(); if (now - lastSel < 70) return; lastSel = now;
      const t = ctx.currentTime;
      blip("sine", 1700, 950, t, .045, .07); blip("sine", 420, 240, t, .05, .05);       // the ball clicks
      const f = RUN[Math.min(RUN.length - 1, Math.round(i * (RUN.length - 1) / 17))];   // and the note climbs with the hole
      [[f, .05], [f * 2.005, .012]].forEach(([fr, v]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = fr;
        g.gain.setValueAtTime(.0001, t + .02); g.gain.exponentialRampToValueAtTime(v, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
        o.connect(g); g.connect(fx); o.start(t + .02); o.stop(t + 1.2);
      });
    }
    return {
      select, type, slide, finale, flight, land,
      ensure, startAmbience, tick, roll, drop, applause, whoosh, startMusic, setScene, scrolling, setEnabled, words, thud, build, bloom,
      // the film asks to be told, one bar ahead, when the next downbeat will sound (in ms from now)
      onBar(fn) { barFn = (t) => fn(Math.max(0, (t - ctx.currentTime + (ctx.outputLatency || ctx.baseLatency || 0)) * 1000)); },
      get bar() { return BAR; }, get playing() { return musicOn && enabled && !!ctx && ctx.state === "running"; }, get enabled() { return enabled; },
    };
  })();

  /* ======================= Soft guides =======================
     Gentle, never pushy: a "swipe up" pill appears only when someone pauses, disappears the
     moment they scroll, shows less often as they explore, and never on the last screen.
     Side-scrolling rows glide a little and back the first time they're seen. */
  /* ======================= Find your way: the live map, on tap =======================
     The card shows a picture of the real map. Tapping loads the live map inside the card; "Done"
     puts the picture back so page scrolling is never trapped inside the map. */
  function lmap() {
    const box = $(".lmap"); if (!box) return;
    const open = $(".lmap-open", box), done = $(".lmap-done");
    let frame = null;
    open.addEventListener("click", () => {
      if (!frame) {
        frame = document.createElement("iframe");
        frame.className = "lmap-frame"; frame.title = "Zion Hills live map";
        frame.src = Z.brand.mapUrl; frame.loading = "eager";
        frame.setAttribute("allow", "geolocation");
        box.appendChild(frame);
      }
      box.classList.add("live"); done.hidden = false;
      Sound.select(9);
    });
    done.addEventListener("click", () => { box.classList.remove("live"); done.hidden = true; });
  }

  function guides() {
    document.body.insertAdjacentHTML("beforeend",
      `<div class="cue" aria-hidden="true"><span class="cue-chev"><i></i><i></i></span><span class="cue-txt">Swipe up</span></div>`);
    const cue = $(".cue");
    let idle = null, moved = 0, lastY = scrollY;
    const wait = () => (moved > innerHeight * 4 ? 7000 : 2600);
    const canShow = () => !document.body.classList.contains("gating") && !document.body.classList.contains("at-after") && !document.body.classList.contains("at-end") && $("#sheet").hidden;
    const arm = () => { clearTimeout(idle); idle = setTimeout(() => cue.classList.toggle("show", canShow()), wait()); };
    addEventListener("scroll", () => { moved += Math.abs(scrollY - lastY); lastY = scrollY; cue.classList.remove("show"); arm(); }, { passive: true });
    // first appearance: soon after the putt opens the page
    const gateWatch = setInterval(() => { if (!document.body.classList.contains("gating")) { clearInterval(gateWatch); setTimeout(() => { if (scrollY < 40) cue.classList.toggle("show", canShow()); arm(); }, 1600); } }, 300);

    // side-scrolling rows: a one-time glide to show there's more
    const nudge = (el, px) => {
      if (!el || reduce) return;
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        setTimeout(() => {
          el.style.scrollSnapType = "none";                 // a small glide, not a jump to the next card
          el.scrollBy({ left: px, behavior: "smooth" });
          setTimeout(() => { el.scrollBy({ left: -px, behavior: "smooth" }); setTimeout(() => { el.style.scrollSnapType = ""; }, 700); }, 650);
        }, 700);
      }, { threshold: .7 });
      io.observe(el);
    };
    nudge($(".cards"), 70); nudge($(".tcar"), 60); nudge($(".hole-nav"), 90);
    // the hole card wiggles once: it can be swiped
    const card = $(".hole");
    if (card && !reduce) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); setTimeout(() => card.classList.add("wiggle"), 900); } }, { threshold: .6 });
      io.observe(card);
    }
    // labels fade once the row has been used
    $$(".swipe-hint").forEach((h) => {
      const row = $("." + h.dataset.for);
      if (!row) return;
      let touched = false;                                  // only a real swipe counts, not the nudge
      row.addEventListener("touchstart", () => { touched = true; }, { passive: true });
      row.addEventListener("scroll", () => { if (touched && row.scrollLeft > 120) h.classList.add("used"); }, { passive: true });
    });
  }

  function soundScenes() {
    const map = [[".city", "city"], [".dream", "dream"], ["#holes", "course"], ["#map", "course"], ["#homes", "course"], ["#voices", "course"], ["#after", "after"], ["#thanks", "after"]];
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
    let cur = 0, visible = false;                  // always start the round on hole 1
    // a broadcast-style shot tracer for each hole (decorative — the same arc every time you see that hole)
    function tracer(i) {
      const ex = 62 + ((i * 37) % 76), ey = 48 + ((i * 7) % 14), bend = (i % 2 ? 1 : -1) * (18 + ((i * 13) % 26));
      const d = `M100 104 Q ${100 + bend} ${ey - 34} ${ex} ${ey}`;
      return `<svg class="tracer" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path class="tr-glow" d="${d}" pathLength="1"/><path class="tr-line" d="${d}" pathLength="1"/>
          <g transform="translate(${ex} ${ey})"><g class="tr-pin"><circle class="tr-ring" r="3.2"/><path class="tr-flag" d="M0 0V-10l7 2.4-7 2.4"/><circle class="tr-ball" r="1.5"/></g></g>
        </svg>`;
    }
    const words = (t) => esc(t).split(" ").map((w, k) => `<span style="--k:${k}">${w}</span>`).join(" ");
    function play() {                               // run the hole's moment: tracer, yards, photo, story
      const fig = $(".hole-photo", card);
      if (!fig || fig.classList.contains("fly")) return;
      fig.classList.add("fly");
      const lived = $(".lived", card); if (lived) lived.classList.add("write");
      if (reduce) return;
      if (lived) setTimeout(() => Sound.type($$("p span", lived).length, .045), 700);
      const yd = $(".yds", card), total = C.holes[cur].yds;
      if (yd && total) {
        const t0 = performance.now();
        (function tick(now) {
          const k = clamp((now - t0) / 1450), e = 1 - Math.pow(1 - k, 3);
          yd.textContent = `${Math.round(total * e)} yards`;
          if (k < 1 && yd.isConnected) requestAnimationFrame(tick);
        })(t0);
      }
    }
    function show(i, dir = 0) {
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
          <p>${words(s.text)}</p>
          ${s.action ? `<div class="lived-act">${actionHtml(s.action)}</div>` : ""}
        </div>` : ""}`;
      if (dir && !reduce && card.animate) {
        card.animate([{ opacity: 0, transform: `translateX(${dir * 38}px)` }, { opacity: 1, transform: "none" }],
          { duration: 460, easing: "cubic-bezier(.2,.7,.1,1)" });
      }
      btns.forEach((b, k) => { b.classList.toggle("on", k === cur); b.classList.toggle("seen", k < cur); b.setAttribute("aria-selected", k === cur); });
      const active = btns[cur], nav = $(".hole-nav");
      nav.scrollTo({ left: active.offsetLeft - nav.clientWidth / 2 + active.offsetWidth / 2, behavior: "smooth" });
      [cur + 1, cur - 1].forEach((k) => { const im = new Image(); im.src = photo((k + 18) % 18); });   // warm up neighbours
      if (visible) play();
    }
    // the first hole plays its moment when the guide comes into view
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) play(); }, { threshold: .5 }).observe(card);
    btns.forEach((b) => b.addEventListener("click", () => { const to = +b.dataset.hole; show(to, to > cur ? 1 : to < cur ? -1 : 0); Sound.select(cur); }));
    // swipe the hole card left/right to change hole
    let sx = null, sy = 0;
    card.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    card.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { const d = dx < 0 ? 1 : -1; show(cur + d, d); Sound.select(cur); }
    });
    $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
      const d = +b.dataset.step; show(cur + d, d); Sound.select(cur);
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
      const ease = (x) => x * x * (3 - 2 * x);
      dream.style.setProperty("--e", ease(clamp((pd - .02) / .42)).toFixed(3));   // the film's window opening
      const shown = Math.min(cw.length, 1 + Math.floor(pc * cw.length * 1.05));
      cw.forEach((w, i) => { const was = w.classList.contains("on"); w.classList.toggle("on", i < shown); if (!was && i < shown && i > 0) Sound.thud(); });
      dw.forEach((w, i) => {
        const was = w.classList.contains("on"), now = pd > (i === 0 ? .12 : .3);
        w.classList.toggle("on", now);
        if (now && !was) i === 0 ? Sound.build() : Sound.bloom();   // the music rises with the words
      });
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
        if (seen) { const n = $$("span", cards[i]).length; Sound.type(n); Sound.words(n); }
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

    // while the hole guide fills the screen, the dock steps aside so every line is visible
    new IntersectionObserver(([e]) => document.body.classList.toggle("in-holes", e.isIntersecting), { rootMargin: "-50% 0px -50% 0px" }).observe($("#holes"));

    // keep the city clock showing the real time
    const clock = $(".live-time");
    setInterval(() => { clock.textContent = nowText(); }, 20000);
    // the close: the last chord rings as it arrives; the dock steps aside
    const thanks = $("#thanks");
    if (thanks) new IntersectionObserver(([e]) => {
      document.body.classList.toggle("at-end", e.isIntersecting);
      if (e.isIntersecting) { thanks.classList.add("in"); Sound.finale(); }
    }, { threshold: .45 }).observe(thanks);
    // homes slider: a click and a note each time a new home settles in
    const cardsRow = $(".cards");
    if (cardsRow) {
      let touched = false, idx = 0;
      cardsRow.addEventListener("touchstart", () => { touched = true; }, { passive: true });
      const hdots = $$(".hdots i");
      cardsRow.addEventListener("scroll", () => {
        const first = cardsRow.firstElementChild; if (!first) return;
        const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(cardsRow).columnGap || 0), i = Math.round(cardsRow.scrollLeft / step);
        if (i !== idx) { idx = i; hdots.forEach((d, k) => d.classList.toggle("on", k === i)); if (touched) Sound.slide(i); }
      }, { passive: true });
    }
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
        "Hi, before I drive back I'd love to catch up over a cup of coffee and know more about Zion Hills.",
        home && `I'm especially curious about the ${home}.`,
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
  guides();
  lmap();
  gate();
})();
