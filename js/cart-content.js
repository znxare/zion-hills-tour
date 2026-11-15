/* =====================================================================
   GOLF-CART PAGE CONTENT  (index.html)
   The QR code on each cart opens this page. Give every cart its own code:
     https://znxare.github.io/zion-hills-tour/?cart=12
   The cart number then appears in every enquiry, so the team knows where
   the visitor is. Photos, contact details and home types come from
   js/content.js.
   ===================================================================== */

window.CART = {
  /* ------------------------------------------------------------------
     OFFERS — set `on: false` to hide any of them. Change wording freely.
     ------------------------------------------------------------------ */
  offers: {
    nineteenth: {
      on: true,
      eyebrow: "After your round",
      seal: "A CUP OF COFFEE · AT THE CLUBHOUSE · ",
      title: "Before you drive back,",
      text: "let's catch up over a cup of coffee to know more about Zion Hills. Tap the WhatsApp button below to reach out for any assistance.",
      button: "Chat with us on WhatsApp",
      dock: "See a home after your round",
    },
    contest: {
      on: false,   // removed at the owner's request
      hole: 13,
      title: "Shot of the day.",
      text: "Snap your best photo from the island green on hole 13 and send it to us on WhatsApp.",
      prize: "The best shot each month wins a weekend stay at Zion Hills.",
      terms: "Winner chosen by the Zion Hills team each month. By entering, you allow Zion Hills to share your photo with credit.",
    },
    brochure: {
      on: true,
      title: "Not today? Take Zion Hills home.",
      text: "Get the homes brochure and prices on WhatsApp. No forms, no calls unless you ask.",
    },
    tonight: {
      on: false,   // removed from the page at the owner's request (kept here in case it's wanted again)
      title: "Don't drive back tonight.",
      text: "Stay the night in a golf-side villa. Wake up to coffee over the fairway and a walk before breakfast.",
      discount: "",   // e.g. "Golfers get 15% off tonight's stay" — leave empty for no offer
    },
  },

  /* ------------------------------------------------------------------
     THE INTRO — "Sink the putt"
     gate:  the putt-to-enter ritual (shown on every visit — owner's choice)
     city:  gritty black-and-white film scene, words build one per scroll
     dream: the switch to Zion Hills — soft light, petals, serif type
     ------------------------------------------------------------------ */
  gate: {
    title: "Sink the putt",
    sub: "to enter",
    hint: "Tap or swipe the ball into the hole",
  },
  city: {
    image: IMG.city,          // real Bangalore traffic photo (CC0)
    // the time shown is the visitor's real day and time, updated live
    words: ["You drove", "an hour", "through traffic", "to play here."],
  },
  dream: {
    // An edit of the Zion Hills film, played in HD (1080p; 720p on slow connections).
    // Each shot is ~3 s on screen in gentle slow motion, cut on the beat of the music.
    // t = where the shot starts in the film (seconds), rate = playback speed.
    film: FILM,
    // Only shots that fill a portrait phone screen (people shots were cropped on phones).
    shots: [
      { t: 86.55, rate: .4 },   // a girl running through golden grass, in slow motion (clean to 88.9 s)
      { t: 128, rate: .7 },     // aerial: villas wrapped around the fairways (clean to 131.9 s)
      { t: 76, rate: .7 },      // drone over the lake and greens (clean to 79.8 s)
      { t: 18.95, rate: .48 },  // sprinklers over the fairway, in slow motion (clean to 21.5 s)
      { t: 57, rate: .7 },      // drone over the course (clean to 61.5 s)
    ],
    cut: 3,                     // seconds per shot (half a chord of the dream music)
    image: IMG.aerial,        // poster / fallback
    words: ["This could be", "your home course."],
    line: "250 acres · 18 holes · A4 Bent Grass",
  },

  hero: {
    image: IMG.flameTree,
    kicker: "Scanned from your golf cart",
    title: "You drove here to play.<br>The people who live here walked.",
    text: "Enjoy your round. We'll tell you their story — one hole at a time.",
  },

  /* YARDAGE BOOK — the PDF in the site folder, built from the hole guide below
     (open yardage.html and "Save as PDF" to rebuild it). To use the official book
     instead, put its link here. */
  yardage: "",   // e.g. "yardage-book.pdf" — removed from the page at the owner's request

  /* THE STORY — one line per hole, shown under each hole's playing tip.
     Front nine: a day in the life. Back nine: becoming a resident.
     `action` adds a button: "contest" (hole 13), "tonight", "nineteenth". */
  story: [
    { text: "If you lived here, this is where your Saturday would start — and the drive home would be a walk." },
    { text: "If you lived here, you could play a couple of holes before breakfast. On a Tuesday." },
    { text: "If you lived here, these bunkers would stop being a problem. You'd have years to practise." },
    { text: "If you lived here, your kids could be training at the Tarun Sardesai Golf Academy right now, while you play." },
    { text: "If you lived here, water and greens like these could be the view from your verandah." },
    { text: "If you lived here, the hardest hole on the front nine would become a story you tell neighbours over dinner." },
    { text: "If you lived here, you'd know the birds by name. More than 50 species live on this estate." },
    { text: "If you lived here, the air you're breathing right now — AQI typically under 20 — would be every day's air." },
    { label: "The turn", text: "Halfway. In the city, you'd be checking the time to beat the traffic home. Here, home would already be in sight." },
    { label: "Look around", text: "See the homes along the fairway? You've been driving past them all morning." },
    { label: "Look around", text: "Over 150 of those homes are already lived in — by families and professionals who chose this over the city." },
    { label: "In their words", text: "“We came here for a two-week break, and never left!” — Joseph Cairns & family, residents for four years." },
    { label: "Signature hole", text: "The most photographed hole at Zion Hills. If you lived here, it would be the view on your evening walk." },
    { text: "If you lived here, you'd have every evening of the year to master the longest par 3 in India." },
    { label: "What's next", text: "Phase II homes are being designed now, with age-in-place features — a home for every stage of your life. Expressions of interest are open." },
    { text: "If you lived here, a view like this would be what you wake up to." },
    { label: "One more hole", text: "In an hour you'll be back in traffic." },
    { label: "The 19th hole", text: "…or not. What if you didn't have to drive back?", action: "nineteenth" },
  ],

  /* Hole guide — par and playing tips from zionhills.in/golf; yardages from the
     course's hole-by-hole drone film (TODO hole 1). Photos: images/holes/hole-01.webp … hole-18.webp
     Handicap index is shown only where the main site lists it (front nine). TODO back nine. */
  holes: [
    { par: 4, hcp: 17, tip: "A good drive avoiding the out of bounds on the right and the bunker on the left sets up a relatively small approach. The green is multi-tiered — be on the right level for a chance at birdie." },
    { yds: 555, par: 5, hcp: 9, tip: "A short par 5. Avoid the bunker on the left from the tee and you might reach this green in two if the wind is with you. The green is well guarded by bunkers; a flag on the top level makes it tough." },
    { yds: 390, par: 4, hcp: 15, tip: "Reachable if you miss the massive bunkers from the tee and the wind is at your back. One of the toughest greens on the course, with a giant rise guarding the back. Don't be long on the approach." },
    { yds: 405, par: 4, hcp: 3, tip: "Out of bounds on the right — keep your drive to the left side of the fairway. The approach to one of the larger greens plays shorter than the yardage, as it is downhill." },
    { yds: 220, par: 3, hcp: 13, tip: "Intimidating, with water all the way up to the green. The green has a big hollow in the middle. A miss to the right gives you a chance to save par." },
    { yds: 565, par: 5, hcp: 1, tip: "Beware the bunkers and out of bounds on both sides off the tee. Only long hitters can reach in two because of the water short of the green. A right-side flag makes for an intimidating approach." },
    { yds: 225, par: 3, hcp: 11, badge: "Toughest par 3", tip: "Water on the left, bunkers on the right. A par on this hole is a great score." },
    { yds: 450, par: 4, hcp: 5, badge: "Toughest hole", tip: "Out of bounds on the right and water along the left — keeping the tee shot in play is everything. Then a challenging approach over the trees; anything left is wet." },
    { yds: 390, par: 4, hcp: 7, tip: "Straightforward, but plays longer than its yardage thanks to the elevated green. Out of bounds right from the tee. Two levels on the green — a two-putt isn't guaranteed." },
    { yds: 565, par: 5, tip: "A dogleg right with a very difficult tee shot — bunkers and hazards on both sides. A large bunker guards the front of the green, with the hazard along the left." },
    { yds: 365, par: 4, tip: "Risk and reward. Long hitters can try driving the green, but a big bunker guards the front and there's out of bounds on both sides. A large contour in the middle of the green." },
    { yds: 405, par: 4, tip: "A short par 4 with hazards and mango trees lining both sides. The green slopes front to back, bunkered all round. Hit the fairway and the approach is relatively easy." },
    { yds: 345, par: 4, badge: "Signature hole · island green", tip: "Set up the approach with a good drive — the contoured island green is surrounded by the lake, so the approach has to be accurate." },
    { yds: 255, par: 3, badge: "Longest par 3 in India", tip: "A real test of the long game, with bunkers on all sides of the green. Aim for the front of the green and play for par." },
    { yds: 410, par: 4, tip: "A dogleg right with two options: play left for a longer approach, or drive past the fairway bunker on the right. Out of bounds all the way down the right. The green slopes front to back." },
    { yds: 210, par: 3, badge: "Picturesque", tip: "A green wrapped in rock on three sides with a bunker on the left. It is uniquely shaped left to right, so check your yardage to the flag carefully." },
    { yds: 470, par: 4, tip: "Long, with a downhill tee shot and an uphill approach. Avoid the creek running across the fairway off the tee." },
    { yds: 660, par: 5, badge: "Longest par 5 in India", tip: "A double dogleg finish. Avoid the hazard left off the tee and the fairway bunkers left on your second; the third plays uphill to a large three-tiered green. Back-left flags are brutal." },
  ],

  /* Little facts shown under the hole guide, one per hole, between shots */
  betweenShots: [
    "Every home at Zion Hills is golf-front. The ones you can see from the cart path are no exception.",
    "You're playing the only Ronald Fream course in India.",
    "These greens are A4 Bent Grass — the only course in India that has it.",
    "Over 150 homes here are already lived in, by full-time and weekend residents.",
    "Kids can train at the Tarun Sardesai Golf Academy, right here, while you play.",
    "Look up: more than 50 species of birds live on the estate.",
    "The air you're breathing typically measures an AQI under 20.",
    "Five to six kilometres of tree-lined roads run inside the gate — perfect for a morning walk or ride.",
    "Phase II homes are now taking expressions of interest, with priority access for early sign-ups.",
  ],

  /* "Make it your Saturday" planner */
  planner: {
    on: false,   // switched off: the hole-by-hole story does this job now
    who: [
      { id: "two", label: "Just the two of us" },
      { id: "kids", label: "Family with kids" },
      { id: "friends", label: "Friends over often" },
      { id: "parents", label: "Parents too" },
    ],
    day: [
      { id: "golf", label: "Golf" },
      { id: "learn", label: "Learning golf" },
      { id: "sport", label: "Pool & sports" },
      { id: "slow", label: "Doing nothing" },
    ],
    // Approximate drive times — TODO confirm with the Zion Hills team
    from: [
      { id: "east", label: "East — Whitefield, KR Puram", mins: "about 60 min" },
      { id: "north", label: "North — Hebbal, airport side", mins: "about 70 min" },
      { id: "central", label: "Central — Indiranagar, Koramangala", mins: "about 75–90 min" },
      { id: "south", label: "South & West", mins: "about 90 min" },
    ],
    // Which home to suggest for each "who" answer (names must match homes in js/content.js)
    match: { two: "Condominium", kids: "4 Bedroom Villa", friends: "3 Bedroom Villa", parents: "Phase II Home" },
  },

  /* IN THEIR WORDS — real residents, their own words and photos, from zionhills.in/gallery.
     Quotes are exact sentences from their testimonials. The first four are shown, in this order. */
  residents: [
    { quote: "We came here for a two-week break, and never left!", who: "Joseph Cairns & family", where: "Residents for four years",
      photo: WIX("6c3b8b_b6343bbfd22c4073abe786b34c2adc56~mv2.png", 1100) },
    { quote: "Zion Hills is the ultimate in immersive golf living, around a championship-level golf course and the best practice facilities and greens in the country.",
      who: "Air Marshal P P Reddy (Retd.) & family", where: "Among the first residents",
      photo: WIX("6c3b8b_b82c5b897e5642b587f1db51865656a3~mv2.png", 1100) },
    { quote: "While it's just an hour away from the bustling city, it feels like a world apart.",
      who: "Vinod Venkatreddygari & family", where: "Moved back from the US to live here",
      photo: WIX("6c3b8b_da9c099a62a14c608e987afd56adc175~mv2.png", 1100) },
    { quote: "The golf course is a true gem, offering a challenging yet enjoyable experience for players of any skill levels, all set against breathtaking views.",
      who: "Milesh Jamburao & family", where: "Avid golfer, Zion Hills resident",
      photo: WIX("6c3b8b_59591fc73ef34f47a7cf0cc8be09b631~mv2.png", 1100) },
    { quote: "When we tire of the hustle and bustle of Koramangala, we drive out to our little retreat and just unwind.", who: "Sanjay Gangwani & family", where: "Owners for about a decade",
      photo: WIX("6c3b8b_ff8bc6f74c0c43df945ae7fef5f1e290~mv2.png", 1100) },
  ],
};
