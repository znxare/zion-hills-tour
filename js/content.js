/* =====================================================================
   ZION HILLS — THE LIVING STORY
   All words, photos and facts for the site live in this file.
   Facts are taken from www.zionhills.in. Lines marked  // TODO  still
   need confirming by the Zion Hills team before they are relied on.

   Photos load from the zionhills.in image library. To use your own,
   put files in /images and write e.g.  image: "images/villa.jpg"
   ===================================================================== */

// Turns a zionhills.in (Wix) media id into a sized image URL
const WIX = (id, w = 1800) => `https://static.wixstatic.com/media/${id}/v1/fit/w_${w},h_${w},q_80,enc_auto/zionhills.jpg`;
const FILM = (q) => `https://video.wixstatic.com/video/6c3b8b_1dccca9d77124653848cb77fbea2ac6b/${q}/mp4/file.mp4`;

const IMG = {
  aerial:      WIX("6c3b8b_3df8f334569d455cbd85b5cd421d4637~mv2.jpg"),
  aerialHomes: WIX("6c3b8b_909fbad5abac4d86a1cf4353b40f8eb6~mv2.png"),
  aerialLake:  WIX("6c3b8b_15a3c8d55d11437a9a54f1f57a039d7b~mv2.png"),
  aerialHole:  WIX("6c3b8b_12b37a7f268f48038f9c175a7a12fb3f~mv2.png"),
  dusk:        WIX("6c3b8b_cf6b064a10c84e92be71e5951dc6c817~mv2.png"),
  sunset:      WIX("6c3b8b_312271f412c94bbb93330ca885c7812a~mv2.png"),
  flameTree:   WIX("6c3b8b_07c1b84c74014e1fb8374bd1ce980cf7~mv2.png"),
  greens:      WIX("6c3b8b_5df898aa186d45759a3a8f1bc8e229ca~mv2.png"),
  learners:    WIX("6c3b8b_9d9c1edb6cd54620869b4194ad46b618~mv2.png"),
  cycling:     WIX("6c3b8b_c5d0a8dd6dd24436b58e3ab7e4b3e14d~mv2.png"),
  verandah:    WIX("6c3b8b_37e8a737bebf47b688baf8fa728f18c7~mv2.png"),
  celebration: WIX("6c3b8b_4f981a48dece40ecb4ef2a47b4d87cbe~mv2.jpeg"),
  family:      WIX("6c3b8b_da9c099a62a14c608e987afd56adc175~mv2.png"),
  clubLawn:    WIX("6c3b8b_fa0a77c3258f431cb7c3de96a32e907d~mv2.png"),
  clubDining:  WIX("6c3b8b_e755790faed445eca094b51ba5989ac4~mv2.png"),
  villa:       WIX("6c3b8b_9c156485fb9f40c7a8205b94da16b09e~mv2.png"),
  villa4:      WIX("6c3b8b_97066a2f0809471888b5846ab7a9f621~mv2.png"),
  condos:      WIX("6c3b8b_a2cd0ad104884588858737bacb63a15e~mv2.png"),
  condosBuilt: WIX("6c3b8b_21e020c3f7c14aa3ba560212f21d2a90~mv2.png"),
  phase2:      WIX("6c3b8b_3f9c2264dff34c71a6611657826cea74~mv2.png"),
  birds:       WIX("6c3b8b_8d6d0b7ed6db46759e9dd057c6ebb146~mv2.png"),
  // Stock photo for "the city" chapter. TODO swap for a Bangalore traffic shot you own.
  city:        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=70",
};

window.ZION = {
  brand: {
    name: "Zion Hills",
    full: "Zion Hills Golf County",
    mainWebsite: "https://www.zionhills.in",
    stayUrl: "https://booking.zionhills.in/",
    instagram: "http://instagram.com/zionhillsgolfcounty.blr",
    youtube: "https://youtube.com/@zionhillsgolfcounty",
  },

  contact: {
    phone: "+919019231923",
    whatsapp: "919019231923",   // TODO confirm this number is on WhatsApp
    email: "homes@zionhills.in",
    address: "Zion Hills Golf County, Kolar, Karnataka",
  },

  /* ------------------------------------------------------------------
     THE 12 CHAPTERS
     type "story": full-screen scenes. Each beat is one screen of scroll.
       A beat with `media` changes the picture/film; without it, the
       previous picture stays and only the words change.
     Other types are rendered as designed sections (see js/app.js).
     ------------------------------------------------------------------ */
  chapters: [
    {
      label: "The question", type: "story",
      beats: [
        { media: { video: FILM("480p"), videoHD: FILM("720p"), poster: IMG.aerial },
          kicker: "Zion Hills Golf County · Bangalore",
          title: "What if your home was your favourite destination?" },
        { title: "Imagine waking up somewhere that feels like a holiday.",
          text: "Even on an ordinary Tuesday." },
      ],
    },
    {
      label: "The city", type: "story",
      beats: [
        { media: { image: IMG.city, mono: true },
          title: "We built bigger cities.<br>But did we build better lives?" },
        { title: "Traffic. Noise.<br>Crowded spaces.",
          text: "Weekends spent planning an escape." },
        { media: { image: IMG.dusk },
          title: "What if you didn't have to escape your everyday life?" },
      ],
    },
    {
      label: "Zion Hills", type: "story",
      beats: [
        { media: { video: FILM("480p"), videoHD: FILM("720p"), poster: IMG.aerialHomes, start: 40 },
          kicker: "Introducing Zion Hills",
          title: "A different world.<br>Just beyond the city.",
          facts: ["60–90 min from most of Bangalore"] },
        { media: { image: IMG.aerial },
          title: "250 acres.",
          text: "About 150 of them are golf course. A place designed around nature, space and a more rewarding way of living.",
          facts: ["250-acre gated estate", "≈150 acres of golf"] },
      ],
    },
    {
      label: "Golf", type: "story",
      beats: [
        { media: { image: IMG.flameTree },
          title: "Not a home beside a golf course.<br>A life around one." },
        { media: { image: IMG.aerialLake },
          title: "18 holes by Ronald Fream.",
          text: "His only course in India. Granite shelves, rusty boulders and lakes woven through rolling greens.",
          facts: ["Championship 18 holes", "Fream courses in 65 countries"] },
        { media: { image: IMG.greens },
          title: "Greens worthy of Augusta.",
          text: "The only course in India with A4 Bent Grass, the turf of the world's elite clubs." },
        { media: { image: IMG.learners },
          title: "Never held a golf club?",
          text: "This is a world waiting to be discovered. The course challenges experts and inspires learners." },
      ],
    },
    {
      label: "Life", type: "story",
      beats: [
        { media: { image: IMG.cycling },
          title: "Make weekends worth looking forward to.",
          text: "Five to six kilometres of tree-lined roads for morning walks and rides." },
        { media: { image: IMG.family },
          title: "Morning walks. Golf.<br>Family time." },
        { media: { image: IMG.celebration },
          title: "Celebrations under open skies." },
        { media: { image: IMG.clubLawn },
          title: "A community that gives you more reasons to step outside.",
          facts: ["Tennis", "Squash", "Pickleball", "Swimming", "Archery", "Fishing", "Camping"] },
      ],
    },
    {
      label: "Homes", type: "story",
      beats: [
        { media: { image: IMG.villa },
          kicker: "The homes",
          title: "Designed around the way you want to live." },
        { media: { image: IMG.villa4 },
          title: "Golf-front villas.",
          text: "Three- and four-bedroom duplex homes with large verandahs, up to a third of an acre.",
          facts: ["3,500 – 6,000 sq ft"] },
        { media: { image: IMG.condos },
          title: "Condos & penthouses.",
          text: "Low-rise, light-filled homes with panoramic course views.",
          facts: ["1 – 3 bedrooms", "1,600 – 3,500 sq ft"] },
        { media: { image: IMG.phase2 },
          title: "Phase II.",
          text: "New homes by architect Arun Nalapat, with age-in-place design for every stage of life.",
          facts: ["Now taking expressions of interest"] },
      ],
    },
    {
      label: "Space", type: "story",
      beats: [
        { media: { image: IMG.aerialHole },
          title: "Sometimes, luxury is simply having more room to breathe." },
        { media: { image: IMG.aerial },
          stats: [
            { value: "250", label: "acres in all" },
            { value: "≈150", label: "acres of golf" },
            { value: "20,000+", label: "trees" },
            { value: "<20", label: "typical AQI" },
          ] },
      ],
    },

    /* 08 — Evidence */
    {
      label: "Evidence", type: "proof",
      eyebrow: "A vision you can experience today",
      title: "Not a promise.<br>A place you can visit this weekend.",
      text: "Everything below is built, open and lived in.",
      items: [
        { image: IMG.aerialHomes, tag: "Open", title: "The course", text: "All 18 holes are built and played." },
        { image: IMG.condosBuilt, tag: "Complete", title: "150+ homes", text: "Finished and lived in by full-time and weekend residents." },
        { image: IMG.clubDining, tag: "Operational", title: "Club Zion", text: "Dining, pool, courts and events, running today." },
        { image: IMG.birds, tag: "Grown", title: "20,000+ trees", text: "A former eucalyptus plantation, now home to 50+ bird species." },
      ],
      quotes: [
        { quote: "We came here for a two-week break, and never left!", who: "Joseph Cairns & family", where: "Residents for four years" },
        { quote: "When we tire of the hustle and bustle of Koramangala, we drive out to our little retreat and just unwind.", who: "Sanjay Gangwani & family", where: "Owners for about a decade" },
        { quote: "Zion Hills is the ultimate in immersive golf living.", who: "Air Marshal P P Reddy (Retd.) & family", where: "Among the first residents" },
      ],
    },

    /* 09 — Ownership */
    {
      label: "Ownership", type: "ownership",
      eyebrow: "The ownership proposition",
      title: "More than an address.<br>A lifestyle you can own.",
      text: "Your home is your private space. The course, the club and the community add another dimension to it.",
      yours: ["Your golf-front home", "Your verandah and garden", "Your view of the course"],
      // For each shared privilege, set `terms` to "Included with ownership" or "Separately chargeable".
      // Left empty, the site shows "Terms shared on your visit".
      shared: [
        { name: "18-hole championship course", terms: "" },   // TODO
        { name: "Club Zion membership", terms: "" },          // TODO
        { name: "Pool, courts and sports", terms: "" },       // TODO
        { name: "Trails, lakes and camping", terms: "" },     // TODO
        { name: "Gated security and estate upkeep", terms: "" }, // TODO
      ],
      note: "We'll show you, line by line, what comes with your home and what is charged separately — before you decide anything.",
    },

    /* 10 — Value */
    {
      label: "Value", type: "value",
      eyebrow: "The investment perspective",
      title: "Don't just compare the price.<br>Understand what you are buying.",
      rows: [
        ["Land", "A 250-acre gated estate near Kolar, 60–90 minutes from Bangalore"],
        ["Open space", "About 150 acres of golf, plus lakes and 20,000+ trees"],
        ["Golf", "18-hole Ronald Fream course with A4 Bent Grass greens"],
        ["Lifestyle", "Club Zion, pool, tennis, squash, pickleball, archery, trails"],
        ["Homes", "Golf-front villas of 3,500 – 6,000 sq ft and condos of 1,600 – 3,500 sq ft"],
        ["Density", "About 600 homes planned across the whole estate"],
        ["Today", "150+ homes complete, course open, club running"],
      ],
      note: "We don't promise appreciation or guaranteed returns. Look at what is here, and judge the value for yourself.",
    },

    /* 11 — Find your home */
    {
      label: "Find your home", type: "homes",
      eyebrow: "Find your home",
      title: "There is a Zion Hills for the way you want to live.",
      filters: ["All", "Condos", "Villas", "Phase II"],
      homes: [
        { name: "Condominium", kind: "Condos", beds: "1 – 3 bedroom penthouses", size: "1,600 – 3,500 sq ft", status: "Golf-front", price: "Price on request", image: WIX("6c3b8b_a2cd0ad104884588858737bacb63a15e~mv2.png", 1000) },
        { name: "3 Bedroom Villa", kind: "Villas", beds: "3 bedroom duplex", size: "3,500 sq ft", status: "Golf-front", price: "Price on request", image: WIX("6c3b8b_9c156485fb9f40c7a8205b94da16b09e~mv2.png", 1000) },
        { name: "4 Bedroom Villa", kind: "Villas", beds: "4 bedroom resort-style duplex", size: "4,300 – 6,000 sq ft", status: "Golf-front", price: "Price on request", image: WIX("6c3b8b_97066a2f0809471888b5846ab7a9f621~mv2.png", 1000) },
        { name: "Phase II Home", kind: "Phase II", beds: "Age-in-place design", size: "Sizes on request", status: "EOI open", price: "Register for priority access", image: WIX("6c3b8b_3f9c2264dff34c71a6611657826cea74~mv2.png", 1000) },
      ],
      // TODO add prices ("₹ X Cr onwards"), availability and floor-plan PDFs per home when ready
      stay: { title: "Not ready to decide? Stay a weekend first.", text: "Book a golf-side villa, play a round, walk the trails.", button: "Book a stay" },
    },

    /* 12 — The visit */
    {
      label: "Visit", type: "story", id: "visit-story",
      beats: [
        { media: { image: IMG.sunset },
          title: "Some places are better experienced than explained.",
          text: "Come see the greens. Walk through the homes. Experience the destination.",
          cta: true },
      ],
    },
  ],

  faq: [
    { q: "How far is it from Bangalore?", a: "About 60 to 90 minutes from most parts of Bangalore, near Kolar. Bengaluru airport is around 70 minutes away." },
    { q: "Do I need to play golf?", a: "Not at all. Residents swim, cycle, play tennis, squash and pickleball, fish, camp and watch birds." },
    { q: "Who is behind Zion Hills?", a: "A joint venture between Confident Group (land owner) and Zion Hills Homes. The course is by Ronald Fream, shaped by Bill Kessener, with the back nine completed by George Philpott." },
    { q: "How does buying work?", a: "Sales are referral and invitation based, to keep a like-minded community. Book a private tour and our team will take you through availability and pricing." },
    { q: "Can I stay before I buy?", a: "Yes. Golf-side villas and camp sites can be booked for getaways, with serviced apartments coming soon." },
  ],
};
