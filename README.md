# Zion Hills — QR Tour Site

A scroll-driven storytelling site that people reach by scanning a QR code. It walks a visitor through the property, then gets them to book a site visit. It works alongside the main website and doesn't replace it.

## The story, in order
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
