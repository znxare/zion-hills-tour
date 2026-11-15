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

  // Which cart? Print each cart's QR as ?cart=12
  const params = new URLSearchParams(location.search);
  const cart = (params.get("cart") || "").replace(/[^\w-]/g, "").slice(0, 12);
  const source = cart ? `golf cart ${cart}` : params.get("src") || "golf cart";
  const wa = (text) => `https://wa.me/${Z.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  const tail = () => `\n(From the Zion Hills ${source} page)`;
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
        <img class="dream-photo" src="${esc(C.dream.image)}" alt="The Zion Hills course with a flame tree in bloom" loading="lazy">
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
      <div class="hole-nav" role="tablist" aria-label="Choose a hole">
        ${C.holes.map((_, i) => `${i === 0 ? '<span class="nine">Front 9</span>' : i === 9 ? '<span class="nine">Back 9</span>' : ""}<button role="tab" data-hole="${i}" aria-label="Hole ${i + 1}">${i + 1}</button>`).join("")}
      </div>
      <article class="hole" aria-live="polite"></article>
      <div class="hole-steps">
        <button class="btn line" data-step="-1">← Previous</button>
        <button class="btn dark" data-step="1">Next hole →</button>
      </div>
      <p class="progress-note" aria-hidden="true"></p>
      ${Z.brand.mapUrl ? `
      <a class="mapcard" href="${esc(Z.brand.mapUrl)}" target="_blank" rel="noopener">
        <span class="mapcard-pin" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg></span>
        <span><b>Find your way around Zion Hills</b><small>Live map: clubhouse, restaurant, practice area, courts and directions.</small></span>
        <span class="mapcard-go" aria-hidden="true">↗</span>
      </a>` : ""}
    </section>

    <!-- 4. The homes they've been driving past -->
    <section class="sec tint" id="homes">
      <p class="eyebrow rv">Look around</p>
      <h2 class="rv">The homes you've been driving past.</h2>
      <p class="lead rv">Every one faces this course. Over 150 are already lived in.</p>
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
      ${quote ? `<blockquote class="pull rv"><p>“${esc(quote.quote)}”</p><cite>${esc(quote.who)}</cite></blockquote>` : ""}
      ${on("brochure") ? `
      <aside class="brochure rv">
        <div><h3>${esc(O.brochure.title)}</h3><p>${esc(O.brochure.text)}</p></div>
        <a class="btn dark wide" target="_blank" rel="noopener" href="${wa(`Hi, please send me the Zion Hills homes brochure and prices.${tail()}`)}">Send me the brochure & prices</a>
      </aside>` : ""}
    </section>

    <!-- 5. The main ask -->
    <section class="nineteenth" id="after">
      <div class="caustics" aria-hidden="true"></div>
      <p class="eyebrow">The 19th hole</p>
      <h2>${on("nineteenth") ? esc(nt.title) : "See a home before you drive back."}</h2>
      <p class="lead">${on("nineteenth") ? esc(nt.text) : "Tell us when you finish. We'll meet you at the clubhouse and walk you through a home, at your pace."}</p>
      <form id="after-form" novalidate>
        <fieldset class="when">
          <legend>When do you finish?</legend>
          ${["After 9 holes", "After 18 holes", "Later today", "Another day"].map((t, i) => `<label class="pick"><input type="radio" name="when" value="${t}" ${i === 1 ? "checked" : ""}><span>${t}</span></label>`).join("")}
        </fieldset>
        <label>Curious about
          <select name="home"><option value="">${on("nineteenth") ? "Just the drink — and a chat" : "Not sure yet — show me around"}</option>${homes.map((x) => `<option>${esc(x.name)}</option>`).join("")}</select>
        </label>
        <label>Your name<input name="name" autocomplete="name" required></label>
        <label>Phone<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required></label>
        <p class="err" role="alert" hidden>Please add your name and phone number.</p>
        <button class="btn light wide" type="submit">${on("nineteenth") ? "Save my drink — send on WhatsApp" : "Send on WhatsApp"}</button>
        <p class="small">Prefer to talk? <a href="tel:${esc(Z.contact.phone)}">Call us now</a>.${Z.brand.mapUrl ? ` <a href="${esc(Z.brand.mapUrl)}" target="_blank" rel="noopener">Find the clubhouse on the map ↗</a>` : ""}</p>
        ${on("nineteenth") && nt.terms ? `<p class="small fine">${esc(nt.terms)}</p>` : ""}
      </form>
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
    </section>` : ""}

    <footer class="foot">
      <a class="btn line wide" href="story.html">Watch the full Zion Hills story →</a>
      <p class="links">
        <button class="linkish" id="invite">Already a Zioneer? Invite a friend</button>
        ${Z.brand.mapUrl ? `<a href="${esc(Z.brand.mapUrl)}" target="_blank" rel="noopener">Estate map</a>` : ""}
        <a href="${esc(Z.brand.mainWebsite)}" target="_blank" rel="noopener">zionhills.in</a>
        <a href="tel:${esc(Z.contact.phone)}">Call</a>
        <a href="mailto:${esc(Z.contact.email)}">Email</a>
      </p>
      <p class="small">${esc(Z.brand.full)} · ${esc(Z.contact.address)}. Plans and sizes are indicative. Bangalore traffic photo: Divya Chinnasamy, CC0, via Wikimedia Commons.</p>
    </footer>`;
  }

  /* ======================= 0. Gate: sink the putt ======================= */
  function gate() {
    const g = $("#gate"), ball = $("#ball"), cup = $(".cup"), msg = $(".gate-msg");
    $(".gate-label").textContent = C.gate.label;
    $("#gate-title em").textContent = C.gate.title;
    $("#gate-title span").textContent = C.gate.sub;
    $(".gate-hint").textContent = C.gate.hint;

    const last = +(store.get("zh-gate") || 0);
    if (location.hash || Date.now() - last < 6 * 3600e3) { close(false, true); return; }
    // the gate always starts the story from the top
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    scrollTo(0, 0);

    let misses = 0, busy = false, samples = [];
    const centre = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
    const setBall = (dx, dy, s = 1, o = 1) => { ball.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`; ball.style.opacity = o; };

    function animate(dur, step, done) {
      const t0 = performance.now();
      (function f(now) {
        const k = clamp((now - t0) / dur);
        step(1 - Math.pow(1 - k, 3), k);
        k < 1 ? requestAnimationFrame(f) : done && done();
      })(t0);
    }

    function holeIt() {
      busy = true; ball.classList.add("moving");
      const b = centre(ball), c = centre(cup);
      const dx = c.x - b.x, dy = c.y - b.y;
      animate(reduce ? 1 : 950, (e) => setBall(dx * e + Math.sin(e * Math.PI) * 18, dy * e), () => {
        animate(260, (e) => setBall(dx, dy + e * 4, 1 - e * .45, 1 - e), () => {
          msg.textContent = "In the hole!";
          setTimeout(() => close(true), 450);
        });
      });
    }

    function miss(dirx, diry, dist, holeDist) {
      busy = true; ball.classList.add("moving");
      const travel = Math.min(dist, innerHeight * .9);
      const tx = dirx * travel, ty = diry * travel;
      msg.textContent = dist < holeDist * .62 ? "Short. Give it a little more pace." : dist > holeDist * 1.9 ? "Too firm — these greens are quick." : "Just missed. Try again.";
      animate(800, (e) => setBall(tx * e, ty * e), () => {
        setTimeout(() => animate(450, (e) => setBall(tx * (1 - e), ty * (1 - e)), () => {
          setBall(0, 0); ball.classList.remove("moving"); busy = false; misses++;
          if (misses >= 2) msg.textContent = "We'll give you this one — flick it up.";
        }), 350);
      });
    }

    function onDown(e) {
      if (busy) return;
      samples = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      g.setPointerCapture && g.setPointerCapture(e.pointerId);
    }
    function onMove(e) { if (samples.length) { samples.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (samples.length > 12) samples.shift(); } }
    function onUp(e) {
      if (busy || !samples.length) return;
      samples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      const a = samples.find((s) => samples[samples.length - 1].t - s.t < 140) || samples[0], z = samples[samples.length - 1];
      samples = [];
      const dt = Math.max(16, z.t - a.t), vx = (z.x - a.x) / dt, vy = (z.y - a.y) / dt, speed = Math.hypot(vx, vy);
      if (speed < .2 || vy > -.08) { msg.textContent = "Flick the ball up, towards the hole."; return; }
      const b = centre(ball), c = centre(cup);
      const hx = c.x - b.x, hy = c.y - b.y, holeDist = Math.hypot(hx, hy);
      const dist = speed * 420;
      const angErr = Math.abs(Math.atan2(vy, vx) - Math.atan2(hy, hx));
      const lucky = misses >= 2;
      if (lucky || (angErr < .5 && dist > holeDist * .62 && dist < holeDist * 1.9)) holeIt();
      else miss(vx / speed, vy / speed, dist, holeDist);
    }
    g.addEventListener("pointerdown", onDown);
    g.addEventListener("pointermove", onMove);
    g.addEventListener("pointerup", onUp);
    g.addEventListener("pointercancel", () => { samples = []; });
    ball.addEventListener("click", (e) => { if (e.detail === 0 && !busy) holeIt(); }); // keyboard Enter/Space
    $("#putt-for-me").addEventListener("click", (e) => { e.stopPropagation(); if (!busy) holeIt(); });
    $("#putt-for-me").addEventListener("pointerdown", (e) => e.stopPropagation());
    $("#skip").addEventListener("pointerdown", (e) => e.stopPropagation());
    $("#skip").addEventListener("click", () => close(false, false, "#holes"));
    setTimeout(() => ball.focus({ preventScroll: true }), 300);

    function close(holed, instant, jump) {
      store.set("zh-gate", Date.now());
      const finish = () => {
        g.remove(); document.body.classList.remove("gating");
        if (jump) { const t = $(jump); if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 60, behavior: "instant" }); }
        engineUpdate && engineUpdate();
      };
      if (instant || reduce) { finish(); return; }
      g.classList.add("done");
      const c = centre(cup), max = Math.hypot(innerWidth, innerHeight) * 1.1;
      animate(holed ? 1000 : 600, (e) => {
        const r = (e * max).toFixed(1);
        const m = `radial-gradient(circle at ${c.x}px ${c.y}px, transparent ${r}px, #000 ${(+r + 1).toFixed(1)}px)`;
        g.style.webkitMaskImage = m; g.style.maskImage = m;
      }, finish);
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
    if (kind === "nineteenth" && on("nineteenth")) return `<a class="btn dark wide" href="#after">Claim your 19th hole</a>`;
    return "";
  }

  function holes() {
    const card = $(".hole"), btns = $$("[data-hole]"), note = $(".progress-note");
    let cur = Math.min(17, Math.max(0, +(store.get("zh-hole") || 0)));
    function show(i) {
      cur = (i + 18) % 18;
      const x = C.holes[cur], s = (C.story || [])[cur] || {};
      card.innerHTML = `
        <div class="hole-head">
          <span class="hole-no"><small>Hole</small>${cur + 1}</span>
          <span class="hole-meta"><b>Par ${x.par}</b>${x.hcp ? `<span>Handicap ${x.hcp}</span>` : ""}</span>
        </div>
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
      note.textContent = cur < 8 ? "Front nine · a day in the life" : cur === 8 ? "The turn" : cur < 17 ? "Back nine · becoming a resident" : "The end of your round";
      store.set("zh-hole", cur);
    }
    btns.forEach((b) => b.addEventListener("click", () => show(+b.dataset.hole)));
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
      document.body.classList.toggle("on-dark", !!(under && under.closest(".city, .nineteenth, .tonight")) || (under && under.closest(".dream") && pd < .1));
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
    if (!on("nineteenth")) $(".dock-main").textContent = "See a home after your round";

    // menu sheet
    const sheet = $("#sheet"), btn = $("#menu-btn");
    const links = [
      ["#holes", "Your round", "18 holes"],
      ["#homes", "The homes", "Look around"],
      ["#after", "19th hole", "On us"],
      on("tonight") && ["#tonight", "Stay tonight", "Villas"],
      Z.brand.mapUrl && [Z.brand.mapUrl, "Estate map", "Live ↗"],
      ["story.html", "The full story", "12 chapters"],
      [`tel:${Z.contact.phone}`, "Call us", "Now"],
    ].filter(Boolean);
    $(".sheet-links").innerHTML = links.map(([h, t, s]) => `<a href="${esc(h)}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ""}>${esc(t)}<small>${esc(s)}</small></a>`).join("");
    const open = (v) => { sheet.hidden = !v; btn.setAttribute("aria-expanded", v); if (v) $(".sheet-links a").focus(); };
    btn.addEventListener("click", () => open(true));
    sheet.addEventListener("click", (e) => { if (e.target.closest("[data-close], .sheet-links a")) open(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) { open(false); btn.focus(); } });

    const form = $("#after-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements, err = $(".err", form);
      if (!f.name.value.trim() || !f.phone.value.trim()) { err.hidden = false; return; }
      err.hidden = true;
      const msg = [
        on("nineteenth")
          ? "Hi, I'd like to take you up on the 19th hole — a drink at the clubhouse after my round."
          : "Hi, I'd like to see a home at Zion Hills after my round.",
        `When: ${f.when.value}`,
        `Curious about: ${f.home.value || (on("nineteenth") ? "Just the drink — and a chat" : "Not sure yet")}`,
        `Name: ${f.name.value.trim()}`,
        `Phone: ${f.phone.value.trim()}`,
        cart && `I'm on cart ${cart} — please meet me at the clubhouse.`,
      ].filter(Boolean).join("\n") + tail();
      window.open(wa(msg), "_blank", "noopener");
    });

    $("#invite").addEventListener("click", async () => {
      const url = location.origin + location.pathname + "?src=referral";
      const text = "I think you'd love Zion Hills — a golf county near Bangalore. Take a look:";
      if (navigator.share) { try { await navigator.share({ title: "Zion Hills", text, url }); return; } catch (e) { if (e.name === "AbortError") return; } }
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank", "noopener");
    });
  }

  render();
  holes();
  wireSee();
  chrome();
  engine();
  gate();
})();
