/* Zion Hills — golf-cart page. Content: js/content.js + js/cart-content.js */
(function () {
  "use strict";
  const Z = window.ZION, C = window.CART;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const homes = Z.chapters.find((c) => c.type === "homes").homes;

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
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  /* ---------------- Render ---------------- */
  function render() {
    const p = C.planner;
    $("#app").innerHTML = `
    <section class="hero" id="top">
      <img class="hero-img" src="${esc(C.hero.image)}" alt="The Zion Hills golf course">
      <div class="hero-shade"></div>
      <div class="hero-copy">
        <p class="kicker">${greet} · ${esc(C.hero.kicker)}</p>
        <h1>${C.hero.title}</h1>
        <p class="hero-text">${esc(C.hero.text)}</p>
        <div class="btns">
          <a class="btn light" href="#holes">Hole-by-hole guide</a>
          <a class="btn glass" href="#homes">See the homes</a>
        </div>
      </div>
    </section>

    <section class="sec" id="holes">
      <p class="eyebrow">Your round</p>
      <h2>Hole by hole</h2>
      <div class="hole-nav" role="tablist" aria-label="Choose a hole">
        ${C.holes.map((_, i) => `${i === 9 ? '<span class="nine">Back 9</span>' : i === 0 ? '<span class="nine">Front 9</span>' : ""}<button role="tab" data-hole="${i}" aria-label="Hole ${i + 1}">${i + 1}</button>`).join("")}
      </div>
      <article class="hole" aria-live="polite"></article>
      <div class="hole-steps">
        <button class="btn line" data-step="-1">← Previous</button>
        <button class="btn dark" data-step="1">Next hole →</button>
      </div>
      <p class="between"><span>Between shots</span><em></em></p>
    </section>

    <section class="sec tint" id="homes">
      <p class="eyebrow">Live here</p>
      <h2>Live on the course you're playing.</h2>
      <p class="lead">Every home at Zion Hills faces the course. Over 150 are already lived in.</p>
      <div class="cards">
        ${homes.map((x) => `
        <article class="card">
          <div class="card-img"><img src="${esc(x.image)}" alt="${esc(x.name)}" loading="lazy"><span class="tag">${esc(x.status)}</span></div>
          <div class="card-body">
            <h3>${esc(x.name)}</h3>
            <p class="muted">${esc(x.beds)}</p>
            <p class="size">${esc(x.size)}</p>
            <a class="btn dark sm" target="_blank" rel="noopener" href="${wa(`Hi, I'm on the course at Zion Hills. Please send me prices and the floor plan for the ${x.name}.${tail()}`)}">Prices & plan on WhatsApp</a>
            <button class="btn line sm" data-see="${esc(x.name)}">See it after my round</button>
          </div>
        </article>`).join("")}
      </div>
    </section>

    <section class="sec" id="saturday">
      <p class="eyebrow">Imagine it</p>
      <h2>Make it your Saturday.</h2>
      <p class="lead">Three taps, and we'll show you what a weekend here would look like for you.</p>
      ${q("who", "Who would come with you?", p.who)}
      ${q("day", "How would you spend the morning?", p.day)}
      ${q("from", "Where do you live in Bangalore?", p.from)}
      <div class="plan" hidden></div>
    </section>

    <section class="sec tint">
      <p class="eyebrow">From the people who live here</p>
      <div class="quotes">${C.residents.map((r) => `<blockquote><p>“${esc(r.quote)}”</p><cite>${esc(r.who)}</cite></blockquote>`).join("")}</div>
    </section>

    <section class="sec dark" id="after">
      <p class="eyebrow">After your round</p>
      <h2>See a home before you drive back.</h2>
      <p class="lead">Tell us when you finish. We'll meet you at the clubhouse and walk you through a home, at your pace.</p>
      <form id="after-form" novalidate>
        <fieldset class="when">
          <legend>When suits you?</legend>
          ${["After 9 holes", "After 18 holes", "Later today", "Another day"].map((t, i) => `<label class="pick"><input type="radio" name="when" value="${t}" ${i === 1 ? "checked" : ""}><span>${t}</span></label>`).join("")}
        </fieldset>
        <label>Interested in
          <select name="home"><option value="">Not sure yet — show me around</option>${homes.map((x) => `<option>${esc(x.name)}</option>`).join("")}</select>
        </label>
        <label>Your name<input name="name" autocomplete="name" required></label>
        <label>Phone<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required></label>
        <p class="err" role="alert" hidden>Please add your name and phone number.</p>
        <button class="btn light wide" type="submit">Send on WhatsApp</button>
        <p class="small">${cart ? `We'll know you're on cart ${esc(cart)}. ` : ""}Prefer to talk? <a href="tel:${esc(Z.contact.phone)}">Call us now</a>.</p>
      </form>
    </section>

    <section class="sec">
      <p class="eyebrow">Already a Zioneer?</p>
      <h2 class="h-sm">Zion Hills grows by invitation.</h2>
      <p class="lead">Know someone who'd love it here? Send them this page.</p>
      <button class="btn dark" id="invite">Invite a friend</button>
    </section>

    <footer class="foot">
      <a class="btn line wide" href="story.html">Watch the full Zion Hills story →</a>
      <p class="links">
        <a href="${esc(Z.brand.mainWebsite)}" target="_blank" rel="noopener">zionhills.in</a>
        <a href="${esc(Z.brand.stayUrl)}" target="_blank" rel="noopener">Book a stay</a>
        <a href="tel:${esc(Z.contact.phone)}">Call</a>
        <a href="mailto:${esc(Z.contact.email)}">Email</a>
      </p>
      <p class="small">${esc(Z.brand.full)} · ${esc(Z.contact.address)}. Plans and sizes are indicative.</p>
    </footer>`;
  }

  function q(name, label, opts) {
    return `
    <fieldset class="q" data-q="${name}">
      <legend>${esc(label)}</legend>
      <div class="opts">${opts.map((o) => `<label class="pick"><input type="radio" name="${name}" value="${o.id}"><span>${esc(o.label)}</span></label>`).join("")}</div>
    </fieldset>`;
  }

  /* ---------------- Hole guide ---------------- */
  function holes() {
    const card = $(".hole"), btns = $$("[data-hole]"), fact = $(".between em");
    let cur = Math.min(17, Math.max(0, +(store.get("zh-hole") || 0)));
    function show(i) {
      cur = (i + 18) % 18;
      const x = C.holes[cur];
      card.innerHTML = `
        <div class="hole-head">
          <span class="hole-no"><small>Hole</small>${cur + 1}</span>
          <span class="hole-meta"><b>Par ${x.par}</b>${x.hcp ? `<span>Handicap index ${x.hcp}</span>` : ""}</span>
        </div>
        ${x.badge ? `<p class="badge">${esc(x.badge)}</p>` : ""}
        <p class="tip">${esc(x.tip)}</p>`;
      btns.forEach((b, k) => { b.classList.toggle("on", k === cur); b.setAttribute("aria-selected", k === cur); });
      const active = btns[cur], nav = $(".hole-nav");
      nav.scrollTo({ left: active.offsetLeft - nav.clientWidth / 2 + active.offsetWidth / 2, behavior: "smooth" });
      fact.textContent = C.betweenShots[cur % C.betweenShots.length];
      store.set("zh-hole", cur);
    }
    btns.forEach((b) => b.addEventListener("click", () => show(+b.dataset.hole)));
    $$("[data-step]").forEach((b) => b.addEventListener("click", () => show(cur + +b.dataset.step)));
    show(cur);
  }

  /* ---------------- Saturday planner ---------------- */
  function planner() {
    const p = C.planner, box = $(".plan");
    const pick = (name) => ($(`input[name="${name}"]:checked`) || {}).value;
    function build() {
      const who = pick("who"), day = pick("day"), from = pick("from");
      // reveal the next question as each one is answered
      $$(".q").forEach((f, i, all) => { f.classList.toggle("dim", i > 0 && !pick(all[i - 1].dataset.q) && !pick(f.dataset.q)); });
      if (!who || !day || !from) { box.hidden = true; return; }

      const morning = {
        golf: ["8:00", "Tee off on the 1st. Back on the verandah for a late breakfast."],
        learn: ["8:00", "A lesson at the Tarun Sardesai Golf Academy, or time on the practice greens."],
        sport: ["8:00", "Laps in the pool, then tennis, squash or pickleball at Club Zion."],
        slow: ["8:00", "A long, slow walk along tree-lined roads. Nowhere to be."],
      }[day];
      const midday = {
        two: ["13:00", "Lunch at the club, just the two of you."],
        kids: ["11:30", "The kids head off for archery, cycling and the pool — safely inside the gate."],
        friends: ["13:00", "Friends drive in. Lunch runs long on your verandah."],
        parents: ["17:00", "An easy evening walk with your parents, past the lakes."],
      }[who];
      const fromOpt = p.from.find((f) => f.id === from);
      const homeName = p.match[who];
      const home = homes.find((x) => x.name === homeName) || homes[0];
      const steps = [
        ["6:45", "Wake to birdsong. Coffee looking out over the fairway."],
        morning, midday,
        ["18:30", "Sunset over the course from your own verandah."],
        ["21:00", "Stars you can actually see, in air with an AQI under 20."],
      ].sort((a, b) => parseFloat(a[0].replace(":", ".")) - parseFloat(b[0].replace(":", ".")));

      const summary = [
        "Hi, I tried the 'Make it your Saturday' planner at Zion Hills.",
        `Who: ${p.who.find((x) => x.id === who).label}`,
        `Mornings: ${p.day.find((x) => x.id === day).label}`,
        `I live: ${fromOpt.label}`,
        `Suggested home: ${home.name}`,
        "Please send me details and prices.",
      ].join("\n") + tail();

      box.innerHTML = `
        <h3>Your Saturday at Zion Hills</h3>
        <ol class="day">${steps.map(([t, s]) => `<li><time>${t}</time><span>${esc(s)}</span></li>`).join("")}</ol>
        <div class="drive"><b>${esc(fromOpt.mins)}</b> from your side of Bangalore. Less than many weekday commutes.</div>
        <div class="match">
          <img src="${esc(home.image)}" alt="${esc(home.name)}">
          <div>
            <p class="eyebrow">Made for this Saturday</p>
            <h4>${esc(home.name)}</h4>
            <p class="muted">${esc(home.beds)} · ${esc(home.size)}</p>
          </div>
        </div>
        <div class="btns stack">
          <a class="btn dark wide" target="_blank" rel="noopener" href="${wa(summary)}">Send me this plan on WhatsApp</a>
          <button class="btn line wide" data-see="${esc(home.name)}">See this home after my round</button>
        </div>`;
      box.hidden = false;
      wireSee(box);
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    $$("#saturday input").forEach((i) => i.addEventListener("change", build));
    build();
  }

  /* ---------------- Booking + misc ---------------- */
  function wireSee(root = document) {
    $$("[data-see]", root).forEach((b) => b.addEventListener("click", () => {
      $("#after-form").elements.home.value = b.dataset.see;
      $("#after").scrollIntoView({ behavior: "smooth" });
    }));
  }

  function contact() {
    $("#bar-wa").href = wa(`Hi, I'm on the course at Zion Hills and would like to know about the homes.${tail()}`);
    if (cart) { const b = $(".cart-badge"); b.textContent = `Cart ${cart}`; b.hidden = false; }

    const form = $("#after-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements, err = $(".err", form);
      if (!f.name.value.trim() || !f.phone.value.trim()) { err.hidden = false; return; }
      err.hidden = true;
      const msg = [
        "Hi, I'd like to see a home at Zion Hills after my round.",
        `When: ${f.when.value}`,
        `Interested in: ${f.home.value || "Not sure yet"}`,
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

    // hide the bottom bar once the booking form is on screen
    const after = $("#after");
    const io = new IntersectionObserver(([e]) => document.body.classList.toggle("at-after", e.isIntersecting), { threshold: 0.15 });
    io.observe(after);
  }

  render();
  holes();
  planner();
  wireSee();
  contact();
})();
