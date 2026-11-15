/* =====================================================================
   ZION HILLS GOLF COUNTY — ALL SITE CONTENT LIVES HERE
   Edit this file to change text, photos, phone numbers, etc.
   Content is taken from www.zionhills.in. Anything marked  // TODO
   still needs confirming by the Zion Hills team.

   Photos currently load from the zionhills.in image library (Wix).
   To use your own files instead, put them in /images and write e.g.
   image: "images/villa.jpg"
   ===================================================================== */

// Helper: turns a Wix media id from zionhills.in into a sized image URL
const WIX = (id, w = 1800) => `https://static.wixstatic.com/media/${id}/v1/fit/w_${w},h_${w},q_80,enc_auto/zionhills.jpg`;

window.ZION = {
  brand: {
    name: "Zion Hills",
    tagline: "Play your way. Live your way.",
    mainWebsite: "https://www.zionhills.in",
    stayUrl: "https://booking.zionhills.in/",
    instagram: "http://instagram.com/zionhillsgolfcounty.blr",
    youtube: "https://youtube.com/@zionhillsgolfcounty",
    brochurePdf: "",          // TODO add a homes brochure PDF if you have one
  },

  contact: {
    phone: "+919019231923",
    whatsapp: "919019231923",  // TODO confirm this number is on WhatsApp
    email: "homes@zionhills.in",
    siteOffice: "Zion Hills Golf County, Kolar, Karnataka",
    hours: "",                 // TODO e.g. "Site visits every day, 10 am – 6 pm"
  },

  /* Opening scenes */
  intro: {
    video: "https://video.wixstatic.com/video/6c3b8b_1dccca9d77124653848cb77fbea2ac6b/480p/mp4/file.mp4",
    videoHD: "https://video.wixstatic.com/video/6c3b8b_1dccca9d77124653848cb77fbea2ac6b/720p/mp4/file.mp4",
    image: WIX("6c3b8b_3df8f334569d455cbd85b5cd421d4637~mv2.jpg"),
    kicker: "Golf County · Kolar, near Bangalore",
  },
  statement: {
    image: WIX("6c3b8b_cf6b064a10c84e92be71e5951dc6c817~mv2.png"),
    text: "Not just a gated community.<br><em>A modern-day village.</em>",
  },
  land: {
    image: WIX("6c3b8b_3df8f334569d455cbd85b5cd421d4637~mv2.jpg"),
    title: "Zion Hills in numbers",
    stats: [
      { value: "250", unit: "acres", label: "gated estate" },
      { value: "18", unit: "holes", label: "championship golf" },
      { value: "20k+", unit: "trees", label: "planted & growing" },
      { value: "<20", unit: "AQI", label: "air you can taste" },
    ],
  },

  /* The guided walk — one full-screen scene per stop */
  tourTitle: "The Walk",
  tourSub: "Eight stops through Zion Hills. Keep scrolling to walk in.",
  tourButton: { label: "Watch Zion Hills on YouTube", url: "https://youtube.com/@zionhillsgolfcounty" },
  tour: [
    {
      room: "The drive in",
      image: WIX("6c3b8b_c5d0a8dd6dd24436b58e3ab7e4b3e14d~mv2.png"),
      line: "Five to six kilometres of tree-lined roads inside the gate. The city stays behind you.",
      spec: "Gated · 250 acres",
    },
    {
      room: "The course",
      image: WIX("6c3b8b_07c1b84c74014e1fb8374bd1ce980cf7~mv2.png"),
      line: "An 18-hole championship course by Ronald Fream — his only one in India.",
      spec: "150 acres · granite shelves · lakes",
    },
    {
      room: "The greens",
      image: WIX("6c3b8b_5df898aa186d45759a3a8f1bc8e229ca~mv2.png"),
      line: "The only course in India with A4 Bent Grass — the same class of turf as Augusta National.",
      spec: "A4 Bent Grass greens",
    },
    {
      room: "Your villa",
      image: WIX("6c3b8b_9c156485fb9f40c7a8205b94da16b09e~mv2.png"),
      line: "Three- and four-bedroom duplex villas. Every single home faces the golf course.",
      spec: "3,500 – 6,000 sq ft",
    },
    {
      room: "The verandah",
      image: WIX("6c3b8b_37e8a737bebf47b688baf8fa728f18c7~mv2.png"),
      line: "Large verandahs for alfresco dinners and slow mornings over the fairway.",
      spec: "Seamless indoor-outdoor living",
    },
    {
      room: "The condos",
      image: WIX("6c3b8b_a2cd0ad104884588858737bacb63a15e~mv2.png"),
      line: "Low-rise condominiums with open plans, natural light and panoramic course views.",
      spec: "1 – 3 bed penthouses · 1,600 – 3,500 sq ft",
    },
    {
      room: "The club",
      image: WIX("6c3b8b_fa0a77c3258f431cb7c3de96a32e907d~mv2.png"),
      line: "Club Zion — tennis, squash, pickleball, swimming, and long evenings on the lawn.",
      spec: "Members' club",
    },
    {
      room: "The wild",
      image: WIX("6c3b8b_8d6d0b7ed6db46759e9dd057c6ebb146~mv2.png"),
      line: "Once a eucalyptus plantation. Now home to more than 50 species of birds.",
      spec: "Spotted owlets · kingfishers · orioles",
    },
  ],

  /* Home types — swipeable cards with an Enquire button */
  homesTitle: "Choose your home",
  homesSub: "All homes are golf-front. Over 150 are complete and lived in. Swipe to compare.",
  villas: [
    {
      name: "Condominiums",
      config: "1 – 3 bedroom penthouses",
      rows: [["Size", "1,600 – 3,500 sq ft"], ["Setting", "Low-rise, golf-front"]],
      price: "Price on request",          // TODO add "₹ X Cr onwards" if you want prices shown
      status: "Golf-front",
      image: WIX("6c3b8b_a2cd0ad104884588858737bacb63a15e~mv2.png", 1000),
    },
    {
      name: "3 Bedroom Villa",
      config: "Duplex villa",
      rows: [["Size", "3,500 sq ft"], ["Outdoors", "Large verandahs"]],
      price: "Price on request",          // TODO
      status: "Golf-front",
      image: WIX("6c3b8b_9c156485fb9f40c7a8205b94da16b09e~mv2.png", 1000),
    },
    {
      name: "4 Bedroom Villa",
      config: "Resort-style duplex villa",
      rows: [["Size", "4,300 – 6,000 sq ft"], ["Plot", "Up to a third of an acre"]],
      price: "Price on request",          // TODO
      status: "Golf-front",
      image: WIX("6c3b8b_97066a2f0809471888b5846ab7a9f621~mv2.png", 1000),
    },
    {
      name: "Phase II Homes",
      config: "Designed by Arun Nalapat",
      rows: [["Design", "Age-in-place features"], ["Status", "Upcoming"]],
      price: "Register for priority access",
      status: "EOI open",
      image: WIX("6c3b8b_3f9c2264dff34c71a6611657826cea74~mv2.png", 1000),
    },
  ],
  stayPitch: {
    title: "Not sure yet? Stay a weekend first.",
    text: "Book one of our golf-side villas, play a round, walk the trails — then decide.",
    button: "Book a stay at Zion Hills",
  },

  /* Life here — words light up as you scroll */
  amenities: {
    image: WIX("6c3b8b_0888279fa9b6460c8ac782978c9a9299~mv2.png"),
    words: ["Golf", "Tennis", "Squash", "Pickleball", "Swimming", "Archery", "Fishing", "Camping"],
    note: "Plus basketball, badminton, grass bowling, darts, cycling trails, bird walks, BBQ pits and star-filled skies.",
  },

  /* Residents' words (from the zionhills.in gallery) */
  residents: [
    { quote: "What started as a blind date with Zion Hills has culminated in a lovely home with spectacular golf views.", who: "Dr Kamal Karl & family", where: "New Zealand" },
    { quote: "When we tire of the hustle and bustle of Koramangala, we drive out to our little retreat and just unwind.", who: "Sanjay Gangwani & family", where: "Bangalore" },
    { quote: "We came here for a two-week break, and never left!", who: "Joseph Cairns & family", where: "Residents for four years" },
    { quote: "Zion Hills is the ultimate in immersive golf living.", who: "Air Marshal P P Reddy (Retd.) & family", where: "Among the first residents" },
  ],

  /* Location */
  location: {
    title: "An easy drive.<br><em>A world away.</em>",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Zion+Hills+Golf+County+Kolar",
    distances: [
      { place: "Most of Bangalore", time: "60–90 min" },
      { place: "Bengaluru airport", time: "≈ 70 min" },
      { place: "Chennai", time: "< 4 hrs" },
      { place: "Kolar Gold Fields & ancient temples", time: "Nearby" },
    ],
    note: "The upcoming Bengaluru–Chennai Industrial Corridor is expected to bring Chennai within two hours.",
  },

  /* Good to know — accordion */
  info: [
    { q: "Do I need to play golf?", a: "Not at all. Residents swim, cycle, play tennis, squash and pickleball, fish, camp and watch birds. You just have to enjoy living on your own terms." },
    { q: "How far is it from Bangalore?", a: "About 60 to 90 minutes from most parts of Bangalore, near Kolar. Bengaluru airport is around 70 minutes away." },
    { q: "Is it already lived in?", a: "Yes. Over 150 homes are complete, with a community of full-time and part-time residents. Zion Hills is planned for about 600 homes." },
    { q: "What's new in Phase II?", a: "Phase II homes are designed by Arun Nalapat with age-in-place features — a secure, adaptable home for every stage of life. Register now for priority access and limited EOI offers." },
    { q: "Who is behind Zion Hills?", a: "A joint venture between Confident Group (land owner) and Zion Hills Homes. The course was designed by Ronald Fream, shaped by Bill Kessener, and the back nine completed by George Philpott." },
    { q: "Can I stay before I buy?", a: "Yes. Golf-side villas and camp sites can be booked for getaways, with serviced apartments coming soon." },
    { q: "How does buying work?", a: "Sales are referral and invitation based, to keep a like-minded community. Book a site visit and our team will take you through availability and pricing." },
  ],
};
