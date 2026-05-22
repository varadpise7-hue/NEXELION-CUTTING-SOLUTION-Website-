const productApi = (() => {
  const products = [
    {
      id: "ncs-220",
      name: "NCS 220 Bandsaw Machine",
      category: "Manually Operated",
      sku: "999",
      image: "assets/hero-bandsaw.png",
      description:
        "The NCS 220 Bandsaw Machine is a robust and efficient industrial cutting solution designed for precision metal cutting. Built with advanced engineering and German gearbox technology, it ensures smooth operation, durability, and high cutting accuracy.",
      highlights: ["205 mm cutting capacity", "German gearbox technology", "350 kg industrial build"],
      features: [
        "Complete electrical system including saw drive motor and coolant pump",
        "On/Off contactor with push buttons",
        "V-belt pulley system with variable speed control",
        "Job stopper for precise repeat cuts",
        "Oil-filled gearbox with German technology",
        "Friction-type chip removal wire brush"
      ],
      specifications: [
        ["Cutting Capacity", "205 mm"],
        ["Round", "205 mm"],
        ["Square", "175 x 175 mm"],
        ["Rectangle", "220 x 100 / 200 x 175 mm"],
        ["Blade Dimensions", "3000 x 27 x 0.9 mm"],
        ["Power Requirement", "440V AC, 50Hz, 1 HP"],
        ["Machine Dimensions", "1.7 x 0.6 x 0.9 meters"],
        ["Weight", "350 kg"]
      ]
    }
  ];

  return {
    getProducts() {
      return Promise.resolve(products);
    }
  };
})();

const carouselSlides = [
  {
    image: "assets/hero-bandsaw.png",
    eyebrow: "Machine Architecture",
    title: "Robust Bandsaw Engineering",
    description:
      "A rigid frame, precision vise, coolant support, and durable gearbox architecture support repeatable industrial cutting."
  },
  {
    image: "assets/carousel-cutting.png",
    eyebrow: "Cut Accuracy",
    title: "Controlled Metal Cutting",
    description:
      "Designed for clean cuts across round, square, and rectangular metal profiles with stable operation and reliable handling."
  },
  {
    image: "assets/carousel-workflow.png",
    eyebrow: "Production Flow",
    title: "Ready for Demanding Workshops",
    description:
      "Built for small workshops and large manufacturing facilities that need dependable throughput and long service life."
  }
];

const selectors = {
  header: "#siteHeader",
  menuToggle: "#menuToggle",
  mobileMenu: "#mobileMenu",
  featuredProduct: "#featuredProduct",
  sliderTrack: "#sliderTrack",
  sliderViewport: "#sliderViewport",
  sliderDots: "#sliderDots",
  sliderCounter: "#sliderCounter",
  sliderPrev: "#sliderPrev",
  sliderNext: "#sliderNext",
  contactForm: "#contactForm",
  year: "#year"
};

const sliderState = {
  activeIndex: 0,
  timerId: null,
  touchStartX: 0,
  touchEndX: 0
};

const autoSlideMs = 5600;

function $(selector, scope = document) {
  return scope.querySelector(selector);
}

function $all(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

function createIcon(name, className = "h-5 w-5") {
  return `<i data-lucide="${name}" class="${className}" aria-hidden="true"></i>`;
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({
      attrs: {
        "stroke-width": 1.8
      }
    });
  }
}

function renderFeaturedProduct(products) {
  const mount = $(selectors.featuredProduct);
  if (!mount || !products.length) return;

  const product = products[0];
  const features = product.features
    .map(
      (feature) => `
        <li class="flex gap-3 text-base leading-7 text-zinc-300">
          ${createIcon("check-circle-2", "mt-0.5 h-4 w-4 shrink-0 text-industrial-orange")}
          <span>${feature}</span>
        </li>
      `
    )
    .join("");

  const specs = product.specifications
    .map(
      ([label, value]) => `
        <div class="grid grid-cols-[0.9fr_1.1fr] gap-4 border-b border-white/10 py-3 last:border-b-0">
          <dt class="text-base font-semibold text-zinc-500">${label}</dt>
          <dd class="text-base font-bold text-white">${value}</dd>
        </div>
      `
    )
    .join("");

  const highlights = product.highlights
    .map(
      (highlight) => `
        <span class="rounded-lg border border-industrial-orange/30 bg-industrial-orange/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-industrial-orange">
          ${highlight}
        </span>
      `
    )
    .join("");

  mount.innerHTML = `
    <article class="group reveal overflow-hidden rounded-lg border border-white/10 bg-industrial-panel shadow-2xl transition hover:-translate-y-2 hover:border-industrial-orange/70">
      <div class="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div class="relative min-h-[22rem] overflow-hidden bg-black">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="h-full min-h-[22rem] w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>
          <div class="absolute left-5 top-5 rounded-lg bg-industrial-orange px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
            Featured Product
          </div>
          <div class="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
            ${highlights}
          </div>
        </div>

        <div class="p-6 sm:p-8 lg:p-10">
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold uppercase tracking-[0.18em] text-zinc-300">${product.category}</span>
            <span class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold uppercase tracking-[0.18em] text-zinc-300">SKU ${product.sku}</span>
          </div>

          <h3 class="mt-6 font-display text-4xl font-black text-white sm:text-5xl">${product.name}</h3>
          <p class="mt-5 text-lg leading-8 text-zinc-300">${product.description}</p>

          <div class="mt-8 grid gap-8 xl:grid-cols-2">
            <div>
              <h4 class="flex items-center gap-2 text-base font-black uppercase tracking-[0.18em] text-white">
                ${createIcon("settings-2", "h-4 w-4 text-industrial-orange")}
                Key Features
              </h4>
              <ul class="mt-4 space-y-3">${features}</ul>
            </div>
            <div>
              <h4 class="flex items-center gap-2 text-base font-black uppercase tracking-[0.18em] text-white">
                ${createIcon("table-properties", "h-4 w-4 text-industrial-orange")}
                Specifications
              </h4>
              <dl class="mt-4 rounded-lg border border-white/10 bg-black/25 px-4">${specs}</dl>
            </div>
          </div>

          <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              class="inline-flex items-center justify-center gap-3 rounded-lg bg-industrial-orange px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-1 hover:bg-industrial-burnt"
            >
              Request Details
              ${createIcon("arrow-up-right", "h-4 w-4")}
            </a>
            <a
              href="#contact"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-1 hover:border-industrial-orange hover:text-industrial-orange"
            >
              Read More
              <span class="transition group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  `;

  refreshIcons();
}

function renderCarousel() {
  const track = $(selectors.sliderTrack);
  const dots = $(selectors.sliderDots);
  if (!track || !dots) return;

  track.innerHTML = carouselSlides
    .map(
      (slide) => `
        <article class="relative min-w-full overflow-hidden">
          <img
            src="${slide.image}"
            alt="${slide.title}"
            class="h-[28rem] w-full object-cover sm:h-[34rem]"
            loading="lazy"
            decoding="async"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10"></div>
          <div class="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <p class="text-sm font-black uppercase tracking-[0.22em] text-industrial-orange">${slide.eyebrow}</p>
            <h3 class="mt-3 max-w-2xl font-display text-4xl font-black text-white sm:text-6xl">${slide.title}</h3>
            <p class="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">${slide.description}</p>
          </div>
        </article>
      `
    )
    .join("");

  dots.innerHTML = carouselSlides
    .map(
      (_, index) => `
        <button
          class="slider-dot h-2.5 w-2.5 rounded-full bg-zinc-600 transition-all"
          type="button"
          aria-label="Go to slide ${index + 1}"
          aria-current="${index === 0 ? "true" : "false"}"
          data-slide-index="${index}"
        ></button>
      `
    )
    .join("");

  updateSlider(0);
  refreshIcons();
}

function updateSlider(index) {
  const track = $(selectors.sliderTrack);
  const counter = $(selectors.sliderCounter);
  const dots = $all(".slider-dot");
  if (!track || !counter) return;

  sliderState.activeIndex = (index + carouselSlides.length) % carouselSlides.length;
  track.style.transform = `translateX(-${sliderState.activeIndex * 100}%)`;
  counter.textContent = `${String(sliderState.activeIndex + 1).padStart(2, "0")} / ${String(carouselSlides.length).padStart(2, "0")}`;

  dots.forEach((dot, dotIndex) => {
    dot.setAttribute("aria-current", String(dotIndex === sliderState.activeIndex));
  });
}

function startSlider() {
  stopSlider();
  sliderState.timerId = window.setInterval(() => {
    updateSlider(sliderState.activeIndex + 1);
  }, autoSlideMs);
}

function stopSlider() {
  if (sliderState.timerId) {
    window.clearInterval(sliderState.timerId);
    sliderState.timerId = null;
  }
}

function initCarousel() {
  renderCarousel();

  $(selectors.sliderNext)?.addEventListener("click", () => {
    updateSlider(sliderState.activeIndex + 1);
    startSlider();
  });

  $(selectors.sliderPrev)?.addEventListener("click", () => {
    updateSlider(sliderState.activeIndex - 1);
    startSlider();
  });

  $(selectors.sliderDots)?.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-slide-index]");
    if (!dot) return;
    updateSlider(Number(dot.dataset.slideIndex));
    startSlider();
  });

  const viewport = $(selectors.sliderViewport);
  viewport?.addEventListener("touchstart", (event) => {
    sliderState.touchStartX = event.changedTouches[0].screenX;
  });

  viewport?.addEventListener("touchend", (event) => {
    sliderState.touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  });

  viewport?.addEventListener("mouseenter", stopSlider);
  viewport?.addEventListener("mouseleave", startSlider);

  startSlider();
}

function handleSwipe() {
  const swipeDistance = sliderState.touchEndX - sliderState.touchStartX;
  const threshold = 48;

  if (Math.abs(swipeDistance) < threshold) return;

  updateSlider(sliderState.activeIndex + (swipeDistance < 0 ? 1 : -1));
  startSlider();
}

function initNavigation() {
  const header = $(selectors.header);
  const toggle = $(selectors.menuToggle);
  const menu = $(selectors.mobileMenu);

  const setHeaderStyle = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const closeMenu = () => {
    menu?.classList.add("hidden");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation menu");
  };

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    menu?.classList.toggle("hidden", isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  });

  $all(".mobile-nav-link").forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("scroll", setHeaderStyle, { passive: true });
  setHeaderStyle();
}

function initRevealAnimations() {
  const elements = $all(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  elements.forEach((element) => observer.observe(element));
}

function getValidationMessage(field, value) {
  const trimmedValue = value.trim();

  if (field === "name" && trimmedValue.length < 3) {
    return "Name must be at least 3 characters.";
  }

  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return "Enter a valid email address.";
  }

  if (field === "message" && trimmedValue.length < 10) {
    return "Message must be at least 10 characters.";
  }

  return "";
}

function validateField(input) {
  const error = $(`#${input.id}Error`);
  const message = getValidationMessage(input.name, input.value);

  input.classList.toggle("is-invalid", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));

  if (error) {
    error.textContent = message;
  }

  return !message;
}

function initContactForm() {
  const form = $(selectors.contactForm);
  const status = $("#formStatus");
  if (!form) return;

  const fields = $all("input, textarea", form);

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      validateField(field);
      status?.classList.add("hidden");
    });
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = fields.every(validateField);

    if (!isValid) return;

    if (status) {
      status.textContent = "Thank you. Your enquiry is ready to be sent to the NEXELION team.";
      status.classList.remove("hidden");
    }

    form.reset();
    fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
  });
}

async function initProducts() {
  const products = await productApi.getProducts();
  renderFeaturedProduct(products);
}

function initFooterYear() {
  const year = $(selectors.year);
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

async function init() {
  initNavigation();
  initCarousel();
  initContactForm();
  initFooterYear();
  await initProducts();
  initRevealAnimations();
  refreshIcons();
}

document.addEventListener("DOMContentLoaded", init);
