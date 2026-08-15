# City Motors — Website Front End

A responsive, animated front-end for City Motors car showroom (Jhang), built with
plain HTML, CSS, and JavaScript — no build step, no framework, ready to publish
as a static site (GitHub Pages, Netlify, Vercel, or any static host).

## What's inside

```
city-motors/
├── index.html          → all page markup/sections
├── css/style.css        → design system + animations + responsive layout
├── js/script.js         → preloader, nav, search, inventory, carousels, modal
├── assets/
│   └── owner-amir-shah.png   → the owner photo you uploaded
└── README.md
```

Open `index.html` directly in a browser to preview it locally, or push the
whole folder to a GitHub repo and enable GitHub Pages (Settings → Pages →
deploy from branch, root folder).

## What you'll want to customize before going live

**1. Phone numbers & address**
Search the project for `+923001234567`, `0300 1234567`, `0321 4567890`, and
"Chowk Road, Jhang" (in `index.html`) and replace with your real numbers and
showroom address. These currently appear in the nav bar, hero, owner section,
and contact footer.

**2. Car inventory**
Open `js/script.js` and find the `CARS` array near the top. Each entry is one
listing:

```js
{ id: "cm-101", name: "Toyota Corolla Altis", type: "sedan", accent: "blue",
  year: 2021, price: 6250000, mileage: "38,000 km", fuel: "Petrol",
  trans: "Automatic", engine: "1.6L", isNew: true,
  desc: "One owner, full service history..." }
```

Add, remove, or edit entries to reflect your actual daily stock — the grid,
filters, search box, and detail popup all render from this array automatically.
`type` must be `sedan`, `suv`, or `hatchback` to work with the filter chips.

**3. Car photos**
The cars currently show generated vector illustrations (side/front/rear) as
placeholders so the site works with zero external images. To use real photos:
in `js/script.js`, find the `carSlides()` function and replace its returned
array with your own image paths, e.g.:

```js
function carSlides(car) {
  return [
    { label: "Front", img: "assets/cars/" + car.id + "-1.jpg" },
    { label: "Side",  img: "assets/cars/" + car.id + "-2.jpg" },
    { label: "Rear",  img: "assets/cars/" + car.id + "-3.jpg" }
  ];
}
```
and swap the `<svg>` output in the two places that render slides
(`buildCard` and `openModal`) for `<img src="${s.img}" alt="${s.label}">`.
Drop your photos in `assets/cars/`.

**4. About / History and Owner bio copy**
Written as realistic placeholder copy in `index.html` (`#about` and `#owner`
sections). Replace with your actual founding story and Amir Shah's real bio.

**5. Reviews**
Sample reviews live in the `REVIEWS` array in `js/script.js` — swap in real
client feedback when you have it.

**6. Hero video**
The hero section (top of the homepage) now has an empty video slot instead of
the illustrated car, ready for your real footage. Drop your clip in as:

```
assets/showroom-video.mp4
```

That's it — the placeholder text disappears automatically once a real video
loads there (see `heroVideo` in `js/script.js`). Recommended: a wide/cinematic
crop, muted, a few seconds long, looping cleanly (it autoplays muted + loops).
You can also add a `assets/video-poster.jpg` still frame to show while the
video loads.

**7. Logo**
Your City Motor Jhang shield logo is in `assets/logo.png` and is already
wired into the navbar and footer. Swap that file for an updated version any
time — no HTML changes needed as long as the filename stays the same.

**8. Partners section**
A new "Our Partners" section sits between Reviews and Contact with 4 sample
placeholder partners (finance, insurance, registration, parts). Edit the
`#partners` block in `index.html` — replace the two-letter badge, name, and
blurb for each with your real partners. To use actual partner logo images
instead of the initials badge, swap the `<div class="partner-card__logo">AF</div>`
markup for an `<img>` tag pointing at a logo file in `assets/`.

**9. Contact form**
The "Request a Call Back" form is front-end only (no backend) — it currently
just shows a confirmation message on submit. To actually receive submissions,
connect it to a form service (e.g. Formspree, Getform) or your own backend by
editing the `contactForm.addEventListener("submit", ...)` handler in
`js/script.js`.

## Notes on the build

- No dependencies, no npm install — just three files plus your assets.
- Fonts (Rajdhani, Manrope, Space Mono) load from Google Fonts via `<link>` in
  `index.html` — an internet connection is required for them to load; the site
  still works with fallback fonts if offline.
- Respects `prefers-reduced-motion` — animations are minimized for users who
  have that OS setting on.
- Tested responsive down to 390px-wide mobile screens.
