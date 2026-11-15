/* Zion Hills — golf-cart page: "You drove here to play. The people who live here walked."
   Content: js/content.js (photos, contact, homes) + js/cart-content.js (holes, story, offers) */
(function () {
  "use strict";
  const Z = window.ZION, C = window.CART;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const homes = Z.chapters.find((c) => c.type === "homes").homes;
  const O = C.offers || {};
  const on = (k) => O[k] && O[k].on;

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
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  /* ---------------- Render ---------------- */
  function render() {
    const nt = O.nineteenth || {}, tn = O.tonight || {};
    // hole 12 already quotes the Cairns family, so the homes section uses the next resident
    const quote = (C.residents || [])[1] || (C.residents || [])[0];

    $("#app").innerHTML = `
    <!-- 1. The hook -->
    <section class="hero" id="top">
      <img class="hero-img" src="${esc(C.hero.image)}" alt="The Zion Hills golf course">
      <div class="hero-shade"></div>
      <div class="hero-copy">
        <p class="kicker">${greet} · ${esc(C.hero.kicker)}</p>
        <h1>${C.hero.title}</h1>
        <p class="hero-text">${esc(C.hero.text)}</p>
        <div class="btns">
          <a class="btn light" href="#holes">Go to your hole</a>
          ${on("nineteenth") ? `<a class="btn glass" href="#after">Your 19th hole is on us</a>` : ""}
        </div>
      </div>
    </section>

    <!-- 2. 18 holes, one story -->
    <section class="sec" id="holes">
      <p class="eyebrow">Your round</p>
      <h2>18 holes. One story.</h2>
      <p class="lead">A playing tip for every hole — and a line about life for the people who live beside it.</p>
      <div class="hole-nav" role="tablist" aria-label="Choose a hole">
        ${C.holes.map((_, i) => `${i === 0 ? '<span class="nine">Front 9</span>' : i === 9 ? '<span class="nine">Back 9</span>' : ""}<button role="tab" data-hole="${i}" aria-label="Hole ${i + 1}">${i + 1}</button>`).join("")}
      </div>
      <article class="hole" aria-live="polite"></article>
      <div class="hole-steps">
        <button class="btn line" data-step="-1">← Previous</button>
        <button class="btn dark" data-step="1">Next hole →</button>
      </div>
      <p class="progress-note" aria-hidden="true"></p>
    </section>

    <!-- 3. The homes they've been driving past -->
    <section class="sec tint" id="homes">
      <p class="eyebrow">Look around</p>
      <h2>The homes you've been driving past.</h2>
      <p class="lead">Every one faces this course. Over 150 are already lived in.</p>
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
      ${quote ? `<blockquote class="pull"><p>“${esc(quote.quote)}”</p><cite>${esc(quote.who)}</cite></blockquote>` : ""}
      ${on("brochure") ? `
      <aside class="brochure">
        <div><h3>${esc(O.brochure.title)}</h3><p>${esc(O.brochure.text)}</p></div>
        <a class="btn dark wide" target="_blank" rel="noopener" href="${wa(`Hi, please send me the Zion Hills homes brochure and prices.${tail()}`)}">Send me the brochure & prices</a>
      </aside>` : ""}
    </section>

    ${C.planner && C.planner.on ? plannerHtml() : ""}

    <!-- 4. The main ask -->
    <section class="sec dark" id="after">
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
        <p class="small">${cart ? `We'll know you're on cart ${esc(cart)}. ` : ""}Prefer to talk? <a href="tel:${esc(Z.contact.phone)}">Call us now</a>.</p>
        ${on("nineteenth") && nt.terms ? `<p class="small fine">${esc(nt.terms)}</p>` : ""}
      </form>
    </section>

    <!-- 5. A second chance -->
    ${on("tonight") ? `
    <section class="tonight" id="tonight">
      <img src="${esc(IMG.sunset)}" alt="" loading="lazy">
      <div class="contest-shade"></div>
      <div class="contest-copy">
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
        <a href="${esc(Z.brand.mainWebsite)}" target="_blank" rel="noopener">zionhills.in</a>
        <a href="tel:${esc(Z.contact.phone)}">Call</a>
        <a href="mailto:${esc(Z.contact.email)}">Email</a>
      </p>
      <p class="small">${esc(Z.brand.full)} · ${esc(Z.contact.address)}. Plans and sizes are indicative.</p>
    </footer>`;
  }

  /* ---------------- Holes + story ---------------- */
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
          <span class="hole-meta"><b>Par ${x.par}</b>${x.hcp ? `<span>Handicap index ${x.hcp}</span>` : ""}</span>
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
      note.textContent = cur < 8 ? "Front nine: a day in the life." : cur === 8 ? "The turn." : cur < 17 ? "Back nine: becoming a resident." : "The end of your round — and the start of theirs.";
      store.set("zh-hole", cur);
    }
    btns.forEach((b) => b.addEventListener("click", () => show(+b.dataset.hole)));
    $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
      show(cur + +b.dataset.step);
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }));
    show(cur);
  }

  /* ---------------- Optional planner (off by default) ---------------- */
  function plannerHtml() {
    const p = C.planner;
    const q = (name, label, opts) => `
      <fieldset class="q" data-q="${name}"><legend>${esc(label)}</legend>
        <div class="opts">${opts.map((o) => `<label class="pick"><input type="radio" name="${name}" value="${o.id}"><span>${esc(o.label)}</span></label>`).join("")}</div>
      </fieldset>`;
    return `
    <section class="sec" id="saturday">
      <p class="eyebrow">Imagine it</p>
      <h2>Make it your Saturday.</h2>
      ${q("who", "Who would come with you?", p.who)}
      ${q("day", "How would you spend the morning?", p.day)}
      ${q("from", "Where do you live in Bangalore?", p.from)}
      <div class="plan" hidden></div>
    </section>`;
  }

  function planner() {
    if (!C.planner || !C.planner.on) return;
    const p = C.planner, box = $(".plan");
    const pick = (n) => ($(`input[name="${n}"]:checked`) || {}).value;
    $$("#saturday input").forEach((i) => i.addEventListener("change", () => {
      const who = pick("who"), day = pick("day"), from = pick("from");
      if (!who || !day || !from) return;
      const home = homes.find((x) => x.name === p.match[who]) || homes[0];
      const f = p.from.find((x) => x.id === from);
      box.innerHTML = `<h3>Your Saturday at Zion Hills</h3>
        <div class="drive"><b>${esc(f.mins)}</b> from your side of Bangalore.</div>
        <div class="match"><img src="${esc(home.image)}" alt=""><div><h4>${esc(home.name)}</h4><p class="muted">${esc(home.size)}</p></div></div>
        <button class="btn dark wide" data-see="${esc(home.name)}">See this home after my round</button>`;
      box.hidden = false;
      wireSee(box);
    }));
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
    if (on("nineteenth")) $(".bar-main").textContent = "Your 19th hole is on us";
    if (cart) { const b = $(".cart-badge"); b.textContent = `Cart ${cart}`; b.hidden = false; }

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

    // hide the bottom bar while the booking form is on screen
    const io = new IntersectionObserver(([e]) => document.body.classList.toggle("at-after", e.isIntersecting), { threshold: 0.15 });
    io.observe($("#after"));
  }

  render();
  holes();
  planner();
  wireSee();
  contact();
})();
