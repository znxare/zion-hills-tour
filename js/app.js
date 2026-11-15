/* Zion Hills — The Living Story. Content comes from js/content.js */
(function () {
  "use strict";
  const Z = window.ZION;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const hd = innerWidth > 900;

  // Which QR code brought this visitor? e.g. ?src=hoarding
  const params = new URLSearchParams(location.search);
  const source = params.get("src") || params.get("utm_source") || "";
  const waLink = (text) => `https://wa.me/${Z.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  const arrow = `<span class="arr" aria-hidden="true">↗</span>`;

  /* ---------------- Chapter renderers ---------------- */

  // Full-screen story: pinned stage, one scroll-step per beat
  function story(ch, n) {
    const layers = [];
    const beats = ch.beats.map((b) => {
      if (b.media) layers.push(b.media);
      return { ...b, m: Math.max(0, layers.length - 1) };
    });
    const layerHtml = layers.map((m, i) => {
      const media = m.video
        ? `<video data-start="${m.start || 0}" muted loop playsinline preload="${n === 1 ? "auto" : "none"}" poster="${esc(m.poster || "")}" src="${esc(hd && m.videoHD ? m.videoHD : m.video)}" aria-hidden="true"></video>`
        : `<img src="${esc(m.image)}" alt="" ${n === 1 && i === 0 ? "" : 'loading="lazy"'} onerror="this.classList.add('missing')">`;
      return `<div class="layer${m.mono ? " mono" : ""}${i === 0 ? " on" : ""}" data-l="${i}">${media}</div>`;
    }).join("");

    const beatHtml = beats.map((b, i) => `
      <div class="beat${i === 0 ? " on" : ""}" data-m="${b.m}">
        ${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ""}
        ${b.title ? `<h${n === 1 && i === 0 ? 1 : 2} class="headline">${b.title}</h${n === 1 && i === 0 ? 1 : 2}>` : ""}
        ${b.text ? `<p class="lede">${esc(b.text)}</p>` : ""}
        ${b.stats ? `<ul class="stats">${b.stats.map((s) => `<li><b>${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join("")}</ul>` : ""}
        ${b.facts ? `<ul class="facts">${b.facts.map((f, k) => `<li style="--k:${k}">${esc(f)}</li>`).join("")}</ul>` : ""}
        ${b.cta ? `<a class="pill light" href="#book">Book a private tour ${arrow}</a>` : ""}
      </div>`).join("");

    return `
    <section class="story" id="ch-${n}" data-n="${n}" style="--beats:${beats.length}">
      <div class="stage">
        ${layerHtml}
        <div class="scrim"></div>
        <div class="copy">${beatHtml}</div>
        ${n === 1 ? `<p class="hint"><i></i>Scroll</p>` : ""}
      </div>
    </section>`;
  }

  const head = (ch, n) => `
    <p class="eyebrow"><span>${pad(n)}</span> ${esc(ch.eyebrow)}</p>
    <h2 class="display">${ch.title}</h2>
    ${ch.text ? `<p class="intro">${esc(ch.text)}</p>` : ""}`;

  function proof(ch, n) {
    return `
    <section class="panel light" id="ch-${n}" data-n="${n}">
      <div class="wrap">
        ${head(ch, n)}
        <div class="proof">${ch.items.map((it) => `
          <figure class="pcard reveal">
            <div class="pimg"><img src="${esc(it.image)}" alt="${esc(it.title)}" loading="lazy" onerror="this.classList.add('missing')"><span class="tag">${esc(it.tag)}</span></div>
            <figcaption><b>${esc(it.title)}</b><span>${esc(it.text)}</span></figcaption>
          </figure>`).join("")}
        </div>
        <div class="quotes">${ch.quotes.map((q) => `
          <blockquote class="reveal"><p>“${esc(q.quote)}”</p><cite><b>${esc(q.who)}</b> · ${esc(q.where)}</cite></blockquote>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function ownership(ch, n) {
    return `
    <section class="panel dark" id="ch-${n}" data-n="${n}">
      <div class="wrap">
        ${head(ch, n)}
        <div class="own">
          <div class="owncol reveal">
            <h3>Yours, privately</h3>
            <ul>${ch.yours.map((y) => `<li><span class="tick" aria-hidden="true">✓</span>${esc(y)}</li>`).join("")}</ul>
          </div>
          <div class="owncol reveal">
            <h3>Around you</h3>
            <ul>${ch.shared.map((s) => `<li><span>${esc(s.name)}</span>${s.terms ? `<em>${esc(s.terms)}</em>` : ""}</li>`).join("")}</ul>
          </div>
        </div>
        <p class="note reveal">${esc(ch.note)}</p>
      </div>
    </section>`;
  }

  function value(ch, n) {
    return `
    <section class="panel light" id="ch-${n}" data-n="${n}">
      <div class="wrap">
        ${head(ch, n)}
        <dl class="ledger">${ch.rows.map(([k, v]) => `<div class="reveal"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <p class="note reveal">${esc(ch.note)}</p>
      </div>
    </section>`;
  }

  function homes(ch, n) {
    return `
    <section class="panel light alt" id="ch-${n}" data-n="${n}">
      <div class="wrap">
        ${head(ch, n)}
        <div class="filters" role="group" aria-label="Filter homes">${ch.filters.map((f, i) => `<button class="chip${i === 0 ? " on" : ""}" data-filter="${esc(f)}" aria-pressed="${i === 0}">${esc(f)}</button>`).join("")}</div>
        <div class="homes">${ch.homes.map((h) => `
          <article class="home" data-kind="${esc(h.kind)}">
            <div class="himg"><img src="${esc(h.image)}" alt="${esc(h.name)}" loading="lazy" onerror="this.classList.add('missing')"><span class="tag">${esc(h.status)}</span></div>
            <div class="hbody">
              <h3>${esc(h.name)}</h3>
              <p class="beds">${esc(h.beds)}</p>
              <p class="size">${esc(h.size)}</p>
              <p class="price">${esc(h.price)}</p>
              <div class="hbtns">
                <button class="pill dark" data-enquire="${esc(h.name)}" data-want="Private tour">Enquire ${arrow}</button>
                <button class="pill ghost-d" data-enquire="${esc(h.name)}" data-want="Floor plans & prices">Floor plan</button>
              </div>
            </div>
          </article>`).join("")}
        </div>
        <aside class="stay reveal">
          <div><h3>${esc(ch.stay.title)}</h3><p>${esc(ch.stay.text)}</p></div>
          <a class="pill dark" href="${esc(Z.brand.stayUrl)}" target="_blank" rel="noopener">${esc(ch.stay.button)} ${arrow}</a>
        </aside>
      </div>
    </section>`;
  }

  function booking() {
    const homesCh = Z.chapters.find((c) => c.type === "homes");
    return `
    <section class="panel light" id="book" data-n="${Z.chapters.length}">
      <div class="wrap book">
        <div>
          <p class="eyebrow"><span>${pad(Z.chapters.length)}</span> Private tour</p>
          <h2 class="display">Come and see it<br>for yourself.</h2>
          <p class="intro">Tell us when you'd like to come. We'll show you the course, the club and the homes, at your pace.</p>
          <p class="direct">
            <a href="tel:${esc(Z.contact.phone)}">${esc(Z.contact.phone.replace(/^\+91/, "+91 "))}</a>
            <a href="mailto:${esc(Z.contact.email)}">${esc(Z.contact.email)}</a>
          </p>
        </div>
        <form id="visit-form" novalidate>
          <label>Name<input name="name" autocomplete="name" required></label>
          <label>Phone<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
          <div class="two">
            <label>Preferred date<input name="date" type="date"></label>
            <label>I'd like
              <select name="want"><option>Private tour</option><option>Floor plans & prices</option><option>A weekend stay</option></select>
            </label>
          </div>
          <label>Interested in
            <select name="home"><option value="">Just exploring</option>${homesCh.homes.map((h) => `<option>${esc(h.name)}</option>`).join("")}</select>
          </label>
          <label>Anything else? <span class="opt">Optional</span><textarea name="note" rows="2"></textarea></label>
          <p class="err" role="alert" hidden>Please add your name and phone number.</p>
          <button class="pill dark wide" type="submit">Send on WhatsApp ${arrow}</button>
          <p class="fine">Opens WhatsApp with your request ready to send to our team.</p>
        </form>
      </div>
      <div class="wrap">
        <h3 class="faqh">Good to know</h3>
        <div class="faq">${Z.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
      </div>
      <footer class="wrap foot">
        <p class="wordmark big">${esc(Z.brand.full)}</p>
        <p>${esc(Z.contact.address)}</p>
        <p class="links">
          <a href="${esc(Z.brand.mainWebsite)}" target="_blank" rel="noopener">zionhills.in</a>
          <a href="${esc(Z.brand.instagram)}" target="_blank" rel="noopener">Instagram</a>
          <a href="${esc(Z.brand.youtube)}" target="_blank" rel="noopener">YouTube</a>
          <a href="${esc(Z.brand.stayUrl)}" target="_blank" rel="noopener">Book a stay</a>
        </p>
        <p class="fine">Images are of Zion Hills except the city scene. Plans, sizes and specifications are indicative and subject to change.</p>
      </footer>
    </section>`;
  }

  function build() {
    const render = { story, proof, ownership, value, homes };
    $("#story").innerHTML = Z.chapters.map((ch, i) => render[ch.type](ch, i + 1)).join("") + booking();
    $(".bars").innerHTML = Z.chapters.map((ch, i) =>
      `<a href="#ch-${i + 1}" data-n="${i + 1}" aria-label="${pad(i + 1)} ${esc(ch.label)}"><i></i></a>`).join("");
  }

  /* ---------------- Contact + homes ---------------- */
  function wire() {
    const hello = `Hi, I'm on the Zion Hills story${source ? ` (via ${source})` : ""} and would like to know more.`;
    $("#dock-call").href = `tel:${Z.contact.phone}`;
    $("#dock-wa").href = waLink(hello);

    // filters
    $$(".chip").forEach((c) => c.addEventListener("click", () => {
      $$(".chip").forEach((x) => { x.classList.toggle("on", x === c); x.setAttribute("aria-pressed", x === c); });
      const f = c.dataset.filter;
      $$(".home").forEach((h) => { h.hidden = !(f === "All" || h.dataset.kind === f); });
    }));

    const form = $("#visit-form");
    $$("[data-enquire]").forEach((b) => b.addEventListener("click", () => {
      form.elements.home.value = b.dataset.enquire;
      form.elements.want.value = b.dataset.want;
      $("#book").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => form.elements.name.focus({ preventScroll: true }), 700);
    }));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements, err = $(".err", form);
      if (!f.name.value.trim() || !f.phone.value.trim()) { err.hidden = false; return; }
      err.hidden = true;
      const lines = [
        `Hi, I'd like: ${f.want.value} at Zion Hills.`,
        `Name: ${f.name.value.trim()}`,
        `Phone: ${f.phone.value.trim()}`,
        f.date.value && `Preferred date: ${f.date.value}`,
        `Interested in: ${f.home.value || "Just exploring"}`,
        f.note.value.trim() && `Note: ${f.note.value.trim()}`,
        source && `Came from QR: ${source}`,
      ].filter(Boolean);
      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------------- Scroll engine ---------------- */
  function engine() {
    const stories = $$(".story").map((el) => ({
      el, n: +el.dataset.n,
      beats: $$(".beat", el), layers: $$(".layer", el), idx: 0,
    }));
    const chapters = $$("[data-n]", $("#story"));
    const bars = $$(".bars a");
    const now = $(".now");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false, cur = 0;

    function setBeat(s, i) {
      if (i === s.idx) return;
      s.idx = i;
      s.beats.forEach((b, k) => b.classList.toggle("on", k === i));
      const m = +s.beats[i].dataset.m;
      s.layers.forEach((l, k) => l.classList.toggle("on", k === m));
    }

    function media(s, visible) {
      s.layers.forEach((l) => {
        const v = $("video", l);
        if (!v) return;
        const want = visible && l.classList.contains("on") && !reduce;
        if (want && v.paused) {
          v.muted = true; // phones only autoplay muted video
          v.playsInline = true;
          if (!v.dataset.seeked && +v.dataset.start) {
            const go = () => { v.currentTime = +v.dataset.start; v.dataset.seeked = 1; };
            v.readyState >= 1 ? go() : v.addEventListener("loadedmetadata", go, { once: true });
          }
          v.play().catch(() => {});
        } else if (!want && !v.paused) v.pause();
      });
    }

    function update() {
      ticking = false;
      const vh = innerHeight;

      for (const s of stories) {
        const r = s.el.getBoundingClientRect();
        const visible = r.top < vh && r.bottom > 0;
        // keep only scenes near the screen in memory; warm their pictures up before they're reached
        const near = r.top < vh * 2.5 && r.bottom > -vh * 1.5;
        if (near !== s.near) {
          s.near = near;
          s.el.classList.toggle("near", near);
          if (near) $$("img", s.el).forEach((im) => (im.loading = "eager"));
        }
        if (visible) {
          const p = Math.min(0.9999, Math.max(0, -r.top / (r.height - vh)));
          setBeat(s, Math.floor(p * s.beats.length));
        }
        media(s, visible);
      }

      // which chapter, and how far through it
      let active = 1;
      chapters.forEach((c) => {
        const r = c.getBoundingClientRect();
        const n = +c.dataset.n;
        if (r.top <= vh * 0.45) active = n;
        const f = Math.min(1, Math.max(0, (vh * 0.45 - r.top) / r.height));
        const bar = bars[n - 1];
        if (bar && c.id !== "book") bar.style.setProperty("--f", f);
      });
      if (active !== cur) {
        cur = active;
        const ch = Z.chapters[active - 1];
        now.innerHTML = `<b>${pad(active)}</b> ${esc(ch.label)}`;
        bars.forEach((b, i) => { if (i < active - 1) b.style.setProperty("--f", 1); });
      }

      // light sections under the top bar → dark text
      const under = document.elementFromPoint(innerWidth / 2, 70);
      document.body.classList.toggle("top-light", !!(under && under.closest(".light")));
      document.body.classList.toggle("top-panel", !!(under && under.closest(".panel")));
      // hide the floating booking dock once the booking form itself is on screen
      document.body.classList.toggle("at-book", $("#book").getBoundingClientRect().top < vh * 0.7);
    }

    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    addEventListener("orientationchange", req);
    // back-button restore on phones keeps the old page state; refresh scenes and video
    addEventListener("pageshow", () => { ticking = false; update(); });
    document.addEventListener("visibilitychange", () => { ticking = false; update(); });
    update();

    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    $$(".reveal, .panel .eyebrow, .panel .display, .panel .intro, .home, .filters").forEach((el) => io.observe(el));
  }

  build();
  wire();
  engine();
})();
