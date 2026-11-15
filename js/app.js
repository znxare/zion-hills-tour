/* Zion Hills — scroll storytelling engine. Content comes from js/content.js */
(function () {
  "use strict";
  const Z = window.ZION;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");

  // Which QR code brought this visitor? Print different codes as ?src=hoarding, ?src=brochure ...
  const params = new URLSearchParams(location.search);
  const source = params.get("src") || params.get("utm_source") || "";

  /* ---------- Scene builders ---------- */
  // A pinned, full-screen scene. `len` = how many screens of scrolling it lasts.
  function scene({ id = "", ch, len = 1.6, image, video = "", cls = "", html, alt = "" }) {
    const media = video
      ? `<video class="bg" src="${esc(video)}" poster="${esc(image)}" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>`
      : `<img class="bg" src="${esc(image)}" alt="${esc(alt)}" ${cls.includes("first") ? "" : 'loading="lazy"'} onerror="this.classList.add('missing')">`;
    return `
    <section class="scene ${cls}" ${id ? `id="${id}"` : ""} data-ch="${ch}" style="--len:${len}">
      <div class="stage">
        ${media}
        <div class="shade"></div>
        <div class="copy">${html}</div>
      </div>
    </section>`;
  }

  const waLink = (text) => `https://wa.me/${Z.contact.whatsapp}?text=${encodeURIComponent(text)}`;

  function build() {
    const t = Z.tour;
    let out = "";

    // 1. Arrival lockup
    out += scene({
      id: "arrive", ch: "arrive", len: 1.5, cls: "first k-lockup", image: Z.intro.image,
      video: Z.intro.video && (innerWidth > 900 && Z.intro.videoHD ? Z.intro.videoHD : Z.intro.video),
      html: `
        <p class="kicker">${esc(Z.intro.kicker)}</p>
        <h1 class="lockup">${esc(Z.brand.name).replace(" ", "<br>")}</h1>
        <p class="script">${esc(Z.brand.tagline)}</p>
        <p class="cue">Scroll to begin the walk <span>↓</span></p>`,
    });

    // 2. Statement
    out += scene({ ch: "arrive", len: 1.5, cls: "k-statement", image: Z.statement.image, html: `<p class="statement">${Z.statement.text}</p>` });

    // 3. The land, in numbers
    out += scene({
      ch: "arrive", len: 1.7, cls: "k-stats", image: Z.land.image,
      html: `<h2 class="eyebrow">${esc(Z.land.title)}</h2>
        <ul class="stats">${Z.land.stats.map((s) => `
          <li><b>${esc(s.value)}</b> <span class="unit">${esc(s.unit)}</span><small>${esc(s.label)}</small></li>`).join("")}
        </ul>`,
    });

    // 4. Tour title card
    out += `
    <section class="card-title" id="tour" data-ch="tour">
      <p class="eyebrow">Chapter 02</p>
      <h2 class="big">${esc(Z.tourTitle)}</h2>
      <p class="sub">${esc(Z.tourSub)}</p>
      ${Z.tourButton && Z.tourButton.url ? `<a class="btn ghost" href="${esc(Z.tourButton.url)}" target="_blank" rel="noopener">${esc(Z.tourButton.label)}</a>` : ""}
    </section>`;

    // 5. Room-by-room
    t.forEach((r, i) => {
      out += scene({
        ch: "tour", len: 1.6, cls: "k-room", image: r.image, alt: r.room,
        html: `
          <p class="count"><b>${pad(i + 1)}</b> / ${pad(t.length)}</p>
          <h2 class="title">${esc(r.room)}</h2>
          <p class="line">${esc(r.line)}</p>
          ${r.spec ? `<p class="chip">${esc(r.spec)}</p>` : ""}`,
      });
    });

    // 6. Villa types
    out += `
    <section class="flow" id="villas" data-ch="villas">
      <p class="eyebrow">Chapter 03</p>
      <h2 class="big">${esc(Z.homesTitle)}</h2>
      <p class="sub">${esc(Z.homesSub)}</p>
      <div class="cards" tabindex="0" aria-label="Home types">
        ${Z.villas.map((v) => `
        <article class="vcard">
          <div class="vimg"><img src="${esc(v.image)}" alt="${esc(v.name)} villa" loading="lazy" onerror="this.classList.add('missing')"><span class="status">${esc(v.status)}</span></div>
          <div class="vbody">
            <h3>${esc(v.name)}</h3>
            <p class="config">${esc(v.config)}</p>
            <dl>${v.rows.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join("")}</dl>
            <p class="price">${esc(v.price)}</p>
            <button class="btn" data-enquire="${esc(v.name)}">Enquire about this home</button>
          </div>
        </article>`).join("")}
      </div>
      ${Z.brand.brochurePdf ? `<a class="btn ghost" href="${esc(Z.brand.brochurePdf)}" download>Download the brochure</a>` : ""}
      ${Z.brand.stayUrl ? `
      <aside class="stay">
        <h3>${esc(Z.stayPitch.title)}</h3>
        <p>${esc(Z.stayPitch.text)}</p>
        <a class="btn ghost" href="${esc(Z.brand.stayUrl)}" target="_blank" rel="noopener">${esc(Z.stayPitch.button)} →</a>
      </aside>` : ""}
    </section>`;

    // 7. Amenities — words light up as you scroll
    out += scene({
      id: "life", ch: "life", len: 2.2, cls: "k-words", image: Z.amenities.image,
      html: `<p class="eyebrow">Chapter 04 · Life here</p>
        <div class="words">${Z.amenities.words.map((w, i) => `<span class="w${i % 2 ? " indent" : ""}">${esc(w)}</span>`).join("")}</div>
        <p class="note">${esc(Z.amenities.note)}</p>`,
    });

    // 7b. Residents
    if (Z.residents && Z.residents.length) out += `
    <section class="flow" data-ch="life">
      <p class="eyebrow">The Zioneers</p>
      <h2 class="big">Ask the people<br><em>who live here.</em></h2>
      <div class="quotes">${Z.residents.map((r) => `
        <figure><blockquote>“${esc(r.quote)}”</blockquote><figcaption><b>${esc(r.who)}</b>${r.where ? ` · ${esc(r.where)}` : ""}</figcaption></figure>`).join("")}
      </div>
    </section>`;

    // 8. Location
    out += `
    <section class="flow" id="location" data-ch="location">
      <p class="eyebrow">Chapter 05</p>
      <h2 class="big">${Z.location.title}</h2>
      <ul class="dist">${Z.location.distances.map((d) => `<li><span>${esc(d.place)}</span><b>${esc(d.time)}</b></li>`).join("")}</ul>
      ${Z.location.note ? `<p class="sub">${esc(Z.location.note)}</p>` : ""}
      <a class="btn ghost" href="${esc(Z.location.mapUrl)}" target="_blank" rel="noopener">Open in Google Maps</a>
    </section>`;

    // 9. Good to know + booking
    out += `
    <section class="flow" id="visit" data-ch="visit">
      <p class="eyebrow">Chapter 06</p>
      <h2 class="big">Good to know</h2>
      <div class="faq">${Z.info.map((f) => `
        <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
      </div>

      <div class="book">
        <h2 class="big">Come see it<br><em>in person.</em></h2>
        <p class="sub">Pick a day and we'll show you around the course, the club and the homes.${Z.contact.hours ? ` ${esc(Z.contact.hours)}.` : ""}</p>
        <form id="visit-form" novalidate>
          <label>Your name<input name="name" autocomplete="name" required></label>
          <label>Phone<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
          <label>Preferred date<input name="date" type="date"></label>
          <label>Interested in
            <select name="villa"><option value="">Not sure yet</option>${Z.villas.map((v) => `<option>${esc(v.name)}</option>`).join("")}</select>
          </label>
          <label>Anything else? <span class="opt">(optional)</span><textarea name="note" rows="2"></textarea></label>
          <p class="err" role="alert" hidden>Please add your name and phone number.</p>
          <button class="btn" type="submit">Book my site visit on WhatsApp</button>
        </form>
        <p class="or">or <a href="tel:${esc(Z.contact.phone)}">call ${esc(Z.contact.phone)}</a> · <a href="mailto:${esc(Z.contact.email)}">${esc(Z.contact.email)}</a></p>
      </div>

      <footer class="foot">
        <p class="lockup small">${esc(Z.brand.name)}</p>
        <p>${esc(Z.contact.siteOffice)}</p>
        <p class="links">
          <a href="${esc(Z.brand.mainWebsite)}" target="_blank" rel="noopener">zionhills.in</a>
          ${Z.brand.instagram ? `<a href="${esc(Z.brand.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ""}
          ${Z.brand.youtube ? `<a href="${esc(Z.brand.youtube)}" target="_blank" rel="noopener">YouTube</a>` : ""}
          ${Z.brand.stayUrl ? `<a href="${esc(Z.brand.stayUrl)}" target="_blank" rel="noopener">Book a stay</a>` : ""}
        </p>
        <p class="fine">Images are indicative. Prices, plans and specifications are subject to change.</p>
      </footer>
    </section>`;

    $("#story").innerHTML = out;
  }

  /* ---------- Contact wiring ---------- */
  function wireContact() {
    const hello = `Hi, I'm on the Zion Hills tour${source ? ` (via ${source})` : ""} and would like to know more.`;
    $("#act-call").href = `tel:${Z.contact.phone}`;
    $("#act-wa").href = waLink(hello);

    const form = $("#visit-form");
    const select = form.elements.villa;

    // "Enquire" on a villa card pre-selects it and jumps to the form
    $$("[data-enquire]").forEach((b) =>
      b.addEventListener("click", () => {
        const opt = [...select.options].find((o) => o.text === b.dataset.enquire);
        if (opt) select.value = opt.value || opt.text;
        $(".book").scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => form.elements.name.focus({ preventScroll: true }), 600);
      })
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements;
      const err = $(".err", form);
      if (!f.name.value.trim() || !f.phone.value.trim()) { err.hidden = false; return; }
      err.hidden = true;
      const lines = [
        "Hi, I'd like to book a site visit at Zion Hills.",
        `Name: ${f.name.value.trim()}`,
        `Phone: ${f.phone.value.trim()}`,
        f.date.value && `Preferred date: ${f.date.value}`,
        `Interested in: ${f.villa.value || "Not sure yet"}`,
        f.note.value.trim() && `Note: ${f.note.value.trim()}`,
        source && `Came from QR: ${source}`,
      ].filter(Boolean);
      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- Scroll engine ---------- */
  function engine() {
    const scenes = $$(".scene");
    const rooms = $$(".k-room");
    const links = $$(".chapters a");
    const bar = $(".progress i");
    const railCount = $(".rail-count");
    const sections = $$("[data-ch]");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false, lastCh = "";

    function update() {
      ticking = false;
      const vh = innerHeight, y = scrollY;
      const max = document.documentElement.scrollHeight - vh;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

      for (const s of scenes) {
        const r = s.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue; // off-screen: skip
        const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
        s.style.setProperty("--p", reduce ? 0.5 : p.toFixed(4));
        if (s.classList.contains("k-words")) {
          const ws = $$(".w", s), lit = Math.floor(p * (ws.length + 1.5));
          ws.forEach((w, i) => w.classList.toggle("on", i < lit));
        }
      }

      // current chapter = last section whose top passed the middle of the screen
      let ch = "arrive";
      for (const s of sections) if (s.getBoundingClientRect().top < vh * 0.5) ch = s.dataset.ch;
      if (ch !== lastCh) {
        lastCh = ch;
        const nav = $(".chapters");
        links.forEach((a) => {
          const on = a.dataset.ch === ch;
          a.classList.toggle("on", on);
          if (on) nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
        });
      }

      // side rail counter shows which room of the tour you're in
      let idx = 0;
      rooms.forEach((rm, i) => { if (rm.getBoundingClientRect().top < vh * 0.5) idx = i + 1; });
      railCount.textContent = idx ? `${pad(idx)}/${pad(rooms.length)}` : "ZH";
    }

    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    update();

    // fade-up for regular (non-pinned) blocks
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    $$(".flow > *, .card-title > *").forEach((el) => io.observe(el));
  }

  build();
  wireContact();
  engine();
})();
