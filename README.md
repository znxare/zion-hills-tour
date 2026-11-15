# Zion Hills — QR Tour Site

A scroll-driven storytelling site that people reach by scanning a QR code. It walks a visitor through the property, then gets them to book a site visit. It works alongside the main website and doesn't replace it.

## Publishing updates (important for phones)
Phones cache the CSS/JS files. After editing any file in `css/` or `js/`, bump the `?v=` number
on the `<link>`/`<script>` tags in `index.html` and `story.html` (any new number works), then push.

## Design concept: "Sink the putt" (index.html)
A mix of projject.ai (film grit) and why.zero.university (a dream you take part in):
- **Gate:** sink a putt to enter (flick the ball; aim help after two misses; "Putt for me" and
  "Skip to my hole" for everyone else). Skipped automatically on a re-scan within 6 hours.
- **The city** in grit: black & white, grain, scanlines — "You drove / an hour / through traffic / to play here."
- **The switch** to a dream: mint light, flame-tree petals, floating golf balls — "They / walked."
- **Birdies** (like XP) are earned for taking part; **yards to the 19th** counts down as you scroll.
- One dock button, always: "Your 19th hole is on us", plus a menu sheet.
Intro wording lives in `js/cart-content.js` (`gate`, `city`, `dream`).

## Golf-cart page (index.html) — what the cart QR codes open
Built for someone sitting in a cart mid-round: light, high-contrast, one thumb.
1. **Hero** — "Enjoy your round. Then picture it every Saturday."
2. **Hole-by-hole guide** — par, tips and badges for all 18 holes (remembers the last hole viewed)
3. **Live on the course** — home cards with one-tap "Prices & plan on WhatsApp"
4. **Make it your Saturday** — 3 taps → a personal day plan, drive time and a matched home
5. **See a home after your round** — pick a time, sends a WhatsApp with the cart number
6. **Invite a friend** — for owners (Zion Hills sells by referral)

**One QR code per cart:** `https://znxare.github.io/zion-hills-tour/?cart=12`
The cart number shows on the page and is included in every WhatsApp enquiry.
Edit hole tips, planner answers and drive times in `js/cart-content.js`.

## The Living Story — 12 chapters (story.html)
01 The question · 02 The city · 03 Zion Hills · 04 Golf · 05 Life · 06 Homes · 07 Space ·
08 Evidence · 09 Ownership · 10 Value · 11 Find your home · 12 Visit (private tour booking)

Chapters 1–7 and 12 are full-screen stories: each scroll step is a new "beat" with its own
photo or film. Chapters 8–11 are calm light/dark panels with proof, ownership terms,
a value ledger and a home finder. Bars at the top show progress through all 12 chapters.

## Previous version (for reference)
1. **Arrive**: the zionhills.in hero film, "a modern-day village", Zion Hills in numbers
2. **Walk**: eight full-screen stops (drive in, course, greens, villa, verandah, condos, club, wildlife)
3. **Homes**: swipeable cards (condos, 3-bed villa, 4-bed villa, Phase II) with *Enquire*, plus a "stay a weekend first" link to booking.zionhills.in
4. **Life**: sports and activities that light up as you scroll, plus residents' quotes
5. **Location**: drive times from Bangalore, the airport and Chennai, with a Google Maps link
6. **Visit**: FAQs and the site-visit form

Text and photos come from www.zionhills.in. Photos and the hero video currently load from the zionhills.in image library.

A **Call / WhatsApp / Book a visit** bar stays on screen the whole time.

## Editing content
All text, prices, numbers and photos are in **`js/content.js`**. Search for `TODO` to find every placeholder.
To use your own photos, put them in an `images/` folder and change the paths, e.g. `image: "images/living-room.jpg"`.
Landscape photos at about 1600px wide work best.

## How enquiries arrive
The form opens WhatsApp with a ready-made message to the sales number (`contact.whatsapp`), so no server is needed.

## Tracking which QR code was scanned
Add `?src=` to the link in each QR code:
- `https://your-tour-site.com/?src=hoarding-highway`
- `https://your-tour-site.com/?src=brochure`
- `https://your-tour-site.com/?src=site-office`

The source is added to every WhatsApp message, so sales can see which QR code each lead came from.

## Preview locally
```bash
python -m http.server 5173
```
Then open http://localhost:5173

## Going live
These are plain static files, so any static host works (Netlify, Vercel, GitHub Pages, or your current web host under something like `tour.yourdomain.com`). Generate the QR codes from the final URL.
