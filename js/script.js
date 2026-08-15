/* =========================================================
   CITY MOTORS — script.js
   Vanilla JS. No dependencies. No backend — this is a
   front-end template; wire the form up to your own
   number / CRM when you deploy it.
========================================================= */
(function () {
  "use strict";

  // Declared up-front: several render functions below reference these via
  // closures before their "natural" section runs, so they must exist early.
  let revealObserver;
  let modalSlideIndex = 0;
  let modalSlideCount = 3;

  /* ---------- SVG CAR ICONS (placeholder inventory art) ----------
     Three simple body-type silhouettes drawn as inline SVG so the
     template works with zero external images. Swap car.images for
     real photo URLs/paths per vehicle when you have them — the
     carousel markup does not need to change.
  -------------------------------------------------------------- */
  function carSVG(type, accent) {
    const shadow = `<ellipse cx="200" cy="150" rx="150" ry="10" fill="#000" opacity=".35"/>`;
    const wheel = (cx) => `<circle cx="${cx}" cy="150" r="26" fill="#0c0d10" stroke="#c9cdd3" stroke-width="2"/><circle cx="${cx}" cy="150" r="11" fill="#3a3d44"/>`;
    let body = "";
    if (type === "suv") {
      body = `<path d="M40 130c-8 0-14-6-14-13 0-8 7-14 16-14l10-1 22-34c7-10 19-17 33-18l96-6c22-1 44 5 60 17l30 22 26 4c9 2 15 9 15 18v9c0 7-6 13-14 13H310c-2-15-15-26-31-26s-29 11-31 26H120c-2-15-15-26-31-26s-29 11-31 26z" fill="${accent}"/>
        <path d="M108 95l16-25c5-7 13-12 22-13l52-5c11-1 22 1 30 8l22 17-142 18z" fill="#cfe2ff" opacity=".9"/>`;
    } else if (type === "hatchback") {
      body = `<path d="M46 132c-8 0-14-6-14-13 0-7 6-13 14-13l14-1 20-28c6-9 17-15 29-16l82-5c17-1 34 5 46 16l20 18 18 3c7 1 12 7 12 14v5c0 6-5 11-12 11l-16 1c-2-14-14-25-29-25s-27 11-29 25H128c-2-14-14-25-29-25s-27 11-29 25z" fill="${accent}"/>
        <path d="M116 100l14-20c4-6 12-11 20-12l46-4c9-1 19 2 26 8l16 14-122 14z" fill="#cfe2ff" opacity=".9"/>`;
    } else {
      body = `<path d="M32 128c-8 0-14-6-14-13 0-8 7-14 16-14l16-1 19-28c6-10 19-17 33-18l100-8c21-2 42 4 58 16l30 21 27 4c8 2 14 8 14 16v6c0 7-6 13-14 13l-18 1c-2-15-15-26-31-26s-29 11-31 26H210c-2-15-15-26-31-26s-29 11-31 26H62c-2-15-15-26-31-26z" fill="${accent}"/>
        <path d="M104 92l15-23c4-6 12-11 20-12l53-6c10-1 21 1 29 8l25 19-142 17z" fill="#cfe2ff" opacity=".9"/>`;
    }
    return `<svg viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">${shadow}${body}${wheel(140)}${wheel(300)}</svg>`;
  }

  // Same silhouette reused for 3 "angles" with different framing so each
  // car has a genuine multi-image carousel experience.
 function carSlides(car) {
  if (car.images && car.images.length) {
    return car.images.map((url, i) => ({ label: "Photo " + (i + 1), img: url }));
  }
  const accent = ACCENTS[car.accent];
  return [
    { label: "Side Profile", svg: carSVG(car.type, accent) },
    { label: "Front Quarter", svg: carSVG(car.type, accent) },
    { label: "Rear Quarter", svg: carSVG(car.type, accent) }
  ];
}

  const ACCENTS = { blue: "#2761e0", red: "#d6272c", chrome: "#8b8f97", ink: "#3a3c41" };

  /* ---------- INVENTORY DATA ----------
     Placeholder listing. In production, generate this array from
     whatever you use to track daily stock (spreadsheet export, small
     JSON file, simple CMS) — the render/filter/search logic below
     doesn't care where it comes from.
  ------------------------------------- */
  // const CARS = [
  //  { id: "cm-101", name: "Mehran", type: "sedan", accent: "blue", year: 2021, price: 6250000, mileage: "38,000 km", fuel: "Petrol", trans: "Automatic", engine: "1.6L", isNew: true, 
  //     desc: "One owner, full service history at authorized dealership. Clean interior, no accident history, ready to drive today.",
  //      },
  //   { id: "cm-102", name: "Honda Civic Oriel", type: "sedan", accent: "red", year: 2020, price: 7100000, mileage: "51,000 km", fuel: "Petrol", trans: "Automatic", engine: "1.8L",
  //     desc: "Top-spec Oriel trim with sunroof and paddle shifters. Recently serviced, new tyres fitted this month." },
  //   { id: "cm-103", name: "Suzuki Cultus VXL", type: "hatchback", accent: "chrome", year: 2022, price: 3450000, mileage: "19,000 km", fuel: "Petrol", trans: "Manual", engine: "1.0L", isNew: true,
  //     desc: "Practical city runabout, excellent fuel average, still under manufacturer warranty." },
  //   { id: "cm-104", name: "Toyota Fortuner Sigma", type: "suv", accent: "ink", year: 2019, price: 12800000, mileage: "62,000 km", fuel: "Diesel", trans: "Automatic", engine: "2.8L",
  //     desc: "4x4 capable, well-maintained fleet-free unit. Ideal for family and long-distance touring." },
  //   { id: "cm-105", name: "Honda City Aspire", type: "sedan", accent: "blue", year: 2021, price: 5450000, mileage: "27,000 km", fuel: "Petrol", trans: "Automatic", engine: "1.5L",
  //     desc: "Low mileage, single-owner car with original paint throughout. Comes with 30-day check-in support." },
  //   { id: "cm-106", name: "Suzuki Alto VXR", type: "hatchback", accent: "red", year: 2023, price: 2650000, mileage: "8,500 km", fuel: "Petrol", trans: "Manual", engine: "660cc", isNew: true,
  //     desc: "Near-showroom condition, ideal first car. Registered, taxes clear, ready for immediate transfer." },
  //   { id: "cm-107", name: "Toyota Yaris ATIV X", type: "sedan", accent: "chrome", year: 2022, price: 5150000, mileage: "22,000 km", fuel: "Petrol", trans: "CVT", engine: "1.3L",
  //     desc: "CVT smoothness with strong resale value. Full option including cruise control and rear camera." },
  //   { id: "cm-108", name: "KIA Sportage AWD", type: "suv", accent: "ink", year: 2020, price: 9600000, mileage: "44,000 km", fuel: "Petrol", trans: "Automatic", engine: "2.0L",
  //     desc: "AWD variant, panoramic sunroof, well-kept cabin. Inspected 210-point before listing." }
  // ];

const CARS = [
    { id: "cm-101", name: "Prado", type: "TX", accent: "grey", year: 1997, price: 57000000, mileage: "38,000 km", fuel: "Diesel", trans: "Automatic", engine: "2800", isNew: true,
      desc: "One owner, full service history at authorized dealership. Clean interior, no accident history, ready to drive today.",
      images: ["assets/car1.11.jpeg", "assets/car1.3.jpeg", "assets/car1.2.jpeg"] },
    { id: "cm-102", name: "Yaris", type: "Toyota", accent: "White", year: 2023, price: 47000000, mileage: "57,0000 km", fuel: "Petrol", trans: "Manual", engine: "1500CC ",
      desc: "Modal is of December 2022 and Registered in 2023,Total origional with the Push-Start",
      images: ["assets/car2.1.jpeg", "assets/car2.2.jpeg", "assets/car2.3.jpeg"] },
    { id: "cm-103", name: "Suzuki Cultus VXL", type: "hatchback", accent: "chrome", year: 2022, price: 3450000, mileage: "19,000 km", fuel: "Petrol", trans: "Manual", engine: "1.0L", isNew: true,
      desc: "Practical city runabout, excellent fuel average, still under manufacturer warranty.",
      images: ["assets/car3.1.jpg", "assets/car3.2.jpg", "assets/car3.3.jpg"] },
    { id: "cm-104", name: "Toyota Fortuner Sigma", type: "suv", accent: "ink", year: 2019, price: 12800000, mileage: "62,000 km", fuel: "Diesel", trans: "Automatic", engine: "2.8L",
      desc: "4x4 capable, well-maintained fleet-free unit. Ideal for family and long-distance touring.",
      images: ["assets/car4.1.jpg", "assets/car4.2.jpg", "assets/car4.3.jpg"] },
    { id: "cm-105", name: "Honda City Aspire", type: "sedan", accent: "blue", year: 2021, price: 5450000, mileage: "27,000 km", fuel: "Petrol", trans: "Automatic", engine: "1.5L",
      desc: "Low mileage, single-owner car with original paint throughout. Comes with 30-day check-in support.",
      images: ["assets/car5.1.jpg", "assets/car5.2.jpg", "assets/car5.3.jpg"] },
    { id: "cm-106", name: "Suzuki Alto VXR", type: "hatchback", accent: "red", year: 2023, price: 2650000, mileage: "8,500 km", fuel: "Petrol", trans: "Manual", engine: "660cc", isNew: true,
      desc: "Near-showroom condition, ideal first car. Registered, taxes clear, ready for immediate transfer.",
      images: ["assets/car6.1.jpg", "assets/car6.2.jpg", "assets/car6.3.jpg"] },
    { id: "cm-107", name: "Toyota Yaris ATIV X", type: "sedan", accent: "chrome", year: 2022, price: 5150000, mileage: "22,000 km", fuel: "Petrol", trans: "CVT", engine: "1.3L",
      desc: "CVT smoothness with strong resale value. Full option including cruise control and rear camera.",
      images: ["assets/car7.1.jpg", "assets/car7.2.jpg", "assets/car7.3.jpg"] },
    { id: "cm-108", name: "KIA Sportage AWD", type: "suv", accent: "ink", year: 2020, price: 9600000, mileage: "44,000 km", fuel: "Petrol", trans: "Automatic", engine: "2.0L",
      desc: "AWD variant, panoramic sunroof, well-kept cabin. Inspected 210-point before listing.",
      images: ["assets/car8.1.jpg", "assets/car8.2.jpg", "assets/car8.3.jpg"] }
  ];




  function pkr(n) {
    return "PKR " + n.toLocaleString("en-PK");
  }

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById("preloader");
  document.body.classList.add("is-loading");

  function leavePreloader() {
    if (!preloader) return;
    preloader.classList.add("is-leaving");
    document.body.classList.remove("is-loading");
    setTimeout(() => {
      preloader.classList.add("is-hidden");
    }, 1500);
  }
  window.addEventListener("load", () => setTimeout(leavePreloader, 900));
  // Safety net in case load event is delayed by slow fonts/assets.
  setTimeout(leavePreloader, 3200);

  /* ---------- SPEEDOMETER SCROLL PROGRESS ----------
     Declared early so the nav scroll handler below can call it. */
  const speedo = document.getElementById("speedo");
  const speedoFill = document.getElementById("speedoFill");
  const CIRC = 188.5;
  function updateSpeedo() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? Math.min(scrollTop / height, 1) : 0;
    speedoFill.style.strokeDashoffset = String(CIRC - CIRC * pct);
    speedo.classList.toggle("is-visible", scrollTop > 500);
  }
  speedo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- NAVBAR ---------- */
  const nav = document.getElementById("siteNav");
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
    updateSpeedo();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById("navBurger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-menu-open");
    burger.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("is-menu-open"))
  );

  /* ---------- SEARCH PANEL ---------- */
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  const searchInput = document.getElementById("carSearch");
  const searchClose = document.getElementById("searchClose");

  function openSearch() {
    searchPanel.classList.add("is-open");
    searchToggle.setAttribute("aria-expanded", "true");
    setTimeout(() => searchInput.focus(), 350);
  }
  function closeSearch() {
    searchPanel.classList.remove("is-open");
    searchToggle.setAttribute("aria-expanded", "false");
  }
  searchToggle.addEventListener("click", () => {
    searchPanel.classList.contains("is-open") ? closeSearch() : openSearch();
  });
  searchClose.addEventListener("click", closeSearch);

  /* ---------- INVENTORY RENDER ---------- */
  const carGrid = document.getElementById("carGrid");
  const emptyMsg = document.getElementById("inventoryEmpty");
  let activeFilter = "all";
  let activeQuery = "";

  function buildCard(car) {
    const slides = carSlides(car);
    const card = document.createElement("article");
    card.className = "car-card reveal";
    card.dataset.type = car.type;
    card.dataset.slide = "0";

    card.innerHTML = `
      <div class="car-card__visual">
        <span class="car-card__badge">${car.year} &middot; ${car.type.toUpperCase()}</span>
        ${car.isNew ? '<span class="car-card__new">NEW ARRIVAL</span>' : ""}
       <div class="car-card__slides">
          ${slides.map((s) => `<div class="car-card__slide">${s.img ? `<img src="${s.img}" alt="${s.label}">` : s.svg}<span class="car-card__slide-label">${s.label}</span></div>`).join("")}
        </div>
        <button class="car-card__nav car-card__nav--l" aria-label="Previous photo">&#10094;</button>
        <button class="car-card__nav car-card__nav--r" aria-label="Next photo">&#10095;</button>
        <div class="car-card__dots">${slides.map((_, i) => `<span class="${i === 0 ? "is-active" : ""}"></span>`).join("")}</div>
      </div>
      <div class="car-card__body">
        <div class="car-card__top">
          <span class="car-card__name">${car.name}</span>
          <span class="car-card__price">${pkr(car.price)}</span>
        </div>
        <div class="car-card__meta">
          <span>${car.mileage}</span><span>&middot;</span>
          <span>${car.trans}</span><span>&middot;</span>
          <span>${car.engine}</span>
        </div>
        <div class="car-card__more">More Details
          <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </div>
      </div>
    `;

    const slideTrack = card.querySelector(".car-card__slides");
    const dots = card.querySelectorAll(".car-card__dots span");
    function setSlide(i) {
      const n = slides.length;
      const idx = (i + n) % n;
      card.dataset.slide = idx;
      slideTrack.style.transform = `translateX(-${idx * (100 / 3)}%)`;
      dots.forEach((d, di) => d.classList.toggle("is-active", di === idx));
    }
    card.querySelector(".car-card__nav--l").addEventListener("click", (e) => {
      e.stopPropagation();
      setSlide(parseInt(card.dataset.slide, 10) - 1);
    });
    card.querySelector(".car-card__nav--r").addEventListener("click", (e) => {
      e.stopPropagation();
      setSlide(parseInt(card.dataset.slide, 10) + 1);
    });

    // subtle 3D tilt on hover
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

    card.addEventListener("click", () => openModal(car));
    return card;
  }

  function render() {
    const q = activeQuery.trim().toLowerCase();
    const budgetMatch = q.match(/under\s*([\d,]+)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ""), 10) : null;

    const filtered = CARS.filter((car) => {
      if (activeFilter !== "all" && car.type !== activeFilter) return false;
      if (budget && car.price > budget) return false;
      if (q && !budget) {
        const haystack = `${car.name} ${car.type} ${car.year} ${car.fuel} ${car.trans}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    carGrid.innerHTML = "";
    filtered.forEach((car) => carGrid.appendChild(buildCard(car)));
    emptyMsg.hidden = filtered.length !== 0;
    observeReveals();
  }

  document.getElementById("filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeFilter = chip.dataset.filter;
    render();
  });

  let searchTimer;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      activeQuery = e.target.value;
      render();
      if (activeQuery.trim()) {
        document.getElementById("inventory").scrollIntoView({ behavior: "smooth", block: "start" });
        closeSearch();
      }
    }, 250);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });

  render();

  /* ---------- CAR DETAIL MODAL ---------- */
  const modal = document.getElementById("carModal");
  const modalTrack = document.getElementById("modalTrack");
  const modalDots = document.getElementById("modalDots");
  const modalTag = document.getElementById("modalTag");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalSpecs = document.getElementById("modalSpecs");
  const modalDesc = document.getElementById("modalDesc");
  const modalVin = document.getElementById("modalVin");
  function openModal(car) {
   const slides = carSlides(car); 
    modalSlideCount = slides.length;
    modalSlideIndex = 0;
    modalTrack.innerHTML = slides.map((s) => `<div>${s.img ? `<img src="${s.img}" alt="${s.label}">` : s.svg}</div>`).join("");
    modalDots.innerHTML = slides.map((_, i) => `<span class="${i === 0 ? "is-active" : ""}"></span>`).join("");
    setModalSlide(0);

    modalTag.textContent = car.type.toUpperCase();
    modalTitle.textContent = `${car.name} · ${car.year}`;
    modalPrice.textContent = pkr(car.price);
    modalDesc.textContent = car.desc;
    modalVin.textContent = `VIN — ${car.id.toUpperCase()}`;
    modalSpecs.innerHTML = `
      <div><span>Year</span><b>${car.year}</b></div>
      <div><span>Mileage</span><b>${car.mileage}</b></div>
      <div><span>Fuel</span><b>${car.fuel}</b></div>
      <div><span>Transmission</span><b>${car.trans}</b></div>
      <div><span>Engine</span><b>${car.engine}</b></div>
      <div><span>Body Type</span><b>${car.type[0].toUpperCase() + car.type.slice(1)}</b></div>
    `;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function setModalSlide(i) {
    modalSlideIndex = (i + modalSlideCount) % modalSlideCount;
    modalTrack.style.transform = `translateX(-${modalSlideIndex * 100}%)`;
    modalDots.querySelectorAll("span").forEach((d, di) => d.classList.toggle("is-active", di === modalSlideIndex));
  }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeModal);
  document.getElementById("modalPrev").addEventListener("click", () => setModalSlide(modalSlideIndex - 1));
  document.getElementById("modalNext").addEventListener("click", () => setModalSlide(modalSlideIndex + 1));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- REVIEWS ---------- */
  const REVIEWS = [
    { name: "Muhammad Ammar", role: "Bought a Corolla Altis", text: "Straightforward from the first call. Amir sahab was upfront about the car's history and the price didn't move — exactly as promised on the phone.", rating: 5 },
    { name: "Qaiser Shah", role: "Bought a Cultus VXL", text: "First time buying without a dealer I already knew, and it went smoother than expected. Car was exactly as described, paperwork sorted same day.", rating: 5 },
    { name: "Zaryab Akhtar", role: "Bought a Fortuner Sigma", text: "Called about the Fortuner in the morning, test-drove it by afternoon. No pressure, no games — just showed me the inspection report and let me decide.", rating: 4 },
    { name: "Ali Shair", role: "Bought a Civic Oriel", text: "Followed up a month later just to check how the car was running. Didn't expect that kind of after-sale attention from a showroom.", rating: 5 },
    { name: "Fatima Shahid", role: "Bought an Alto VXR", text: "Good first-car experience for my daughter. Fair trade-in value on our old car and clear about every cost upfront.", rating: 5 }
  ];

  const reviewsTrack = document.getElementById("reviewsTrack");
  const reviewDots = document.getElementById("reviewDots");
  let reviewIndex = 0;

  function perView() {
    return window.innerWidth <= 760 ? 1 : window.innerWidth <= 1080 ? 2 : 3;
  }

  function buildReviews() {
    reviewsTrack.innerHTML = REVIEWS.map(
      (r) => `
      <div class="review-card">
        <div class="review-card__stars">${"&#9733;".repeat(r.rating)}${"&#9734;".repeat(5 - r.rating)}</div>
        <p>&ldquo;${r.text}&rdquo;</p>
        <div class="review-card__who">
          <div class="review-card__avatar">${r.name.split(" ").map((w) => w[0]).join("")}</div>
          <div><b>${r.name}</b><span>${r.role}</span></div>
        </div>
      </div>`
    ).join("");

    const maxIndex = Math.max(0, REVIEWS.length - perView());
    reviewDots.innerHTML = "";
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => goToReview(i));
      reviewDots.appendChild(dot);
    }
    goToReview(0);
  }

  function goToReview(i) {
    const maxIndex = Math.max(0, REVIEWS.length - perView());
    reviewIndex = Math.min(Math.max(i, 0), maxIndex);
    const cardWidth = 100 / perView();
    reviewsTrack.style.transform = `translateX(-${reviewIndex * cardWidth}%)`;
    reviewDots.querySelectorAll("span").forEach((d, di) => d.classList.toggle("is-active", di === reviewIndex));
  }

  document.getElementById("reviewPrev").addEventListener("click", () => goToReview(reviewIndex - 1));
  document.getElementById("reviewNext").addEventListener("click", () => goToReview(reviewIndex + 1));
  window.addEventListener("resize", () => buildReviews());
  buildReviews();

  // /* ---------- CONTACT FORM (front-end only) ---------- */
  // const contactForm = document.getElementById("contactForm");
  // const formNote = document.getElementById("formNote");
  // contactForm.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   const name = contactForm.name.value.trim();
  //   formNote.textContent = `Thanks${name ? ", " + name.split(" ")[0] : ""} — save this number and expect a call from the showroom shortly: 0300 1234567.`;
  //   formNote.classList.add("is-success");
  //   contactForm.reset();
  // });

  /* ---------- SCROLL REVEAL ---------- */
  function observeReveals() {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
    }
    els.forEach((el) => revealObserver.observe(el));
  }
  document.querySelectorAll(
    ".about__copy, .about__visual, .owner__portrait, .owner__copy, .inventory__head, .reviews .inventory__head, .contact__copy, .contact__form"
  ).forEach((el) => el.classList.add("reveal"));
  observeReveals();

  updateSpeedo();

  /* ---------- HERO VIDEO SLOT ----------
     Shows a placeholder until a real video file is present at
     assets/showroom-video.mp4. Once you add that file, this hides
     the placeholder automatically — no code changes needed. */
  const heroVideo = document.getElementById("heroVideo");
  const heroVideoPlaceholder = document.getElementById("heroVideoPlaceholder");
  if (heroVideo && heroVideoPlaceholder) {
    heroVideo.addEventListener("loadeddata", () => {
      heroVideoPlaceholder.style.display = "none";
    });
    heroVideo.addEventListener("error", () => {
      heroVideoPlaceholder.style.display = "";
    });
  }

  /* ---------- HERO PARALLAX (mouse) ---------- */
  const heroScene = document.getElementById("heroScene");
  window.addEventListener("mousemove", (e) => {
    if (window.scrollY > 200 || window.innerWidth < 900) return;
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    heroScene.style.transform = `rotateY(${px * 4}deg) rotateX(${-py * 3}deg)`;
  });

  /* ---------- YEAR ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
