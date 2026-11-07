"use strict";

/* ================= ELEMENTS ================= */

const header = document.querySelector("#header");

const menuToggle = document.querySelector("#menu-toggle");
const navbar = document.querySelector("#navbar");

const cartButton = document.querySelector("#cart-btn");
const cartClose = document.querySelector("#cart-close");
const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-overlay");

const hero = document.querySelector(".hero");
const heroTitle = document.querySelector("#hero-title");
const heroDescription = document.querySelector("#hero-description");
const heroImage = document.querySelector("#hero-image");

const currentSlide = document.querySelector("#current-slide");
const progressBar = document.querySelector(".slider-progress-bar");

const prevButton = document.querySelector("#slider-prev");
const nextButton = document.querySelector("#slider-next");

const scrollProgress = document.querySelector(".scroll-progress");

/* ================= MOBILE MENU ================= */

function closeMenu() {
  navbar.classList.remove("active");
  menuToggle.classList.remove("active");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open Menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("active");

  menuToggle.classList.toggle("active", isOpen);

  menuToggle.setAttribute("aria-expanded", String(isOpen));

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close Menu" : "Open Menu"
  );
});

/* ================= DROPDOWN ================= */

document.querySelectorAll(".dropdown-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const dropdown = button.closest(".dropdown");

    const isOpen = dropdown.classList.toggle("active");

    button.setAttribute("aria-expanded", String(isOpen));

    document.querySelectorAll(".dropdown").forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove("active");

        item.querySelector(".dropdown-toggle")
          .setAttribute("aria-expanded", "false");
      }
    });
  });
});

/* ================= NAVIGATION CLOSE ================= */

document.querySelectorAll(".navbar a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (
    !navbar.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});

/* ================= CART DRAWER ================= */

function openCart() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");

  document.body.classList.add("menu-active");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");

  document.body.classList.remove("menu-active");
}

cartButton.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* ================= HERO SLIDES ================= */

const slides = [
  {
    title: ["FRESH", "BAKED", "PIZZA"],
    description: "Fresh From The Oven Just Only $19.00",
    image: "images/pizza.png",
    alt: "Freshly baked pizza",
  },
  {
    title: ["SUPER", "DELICIOUS", "PIZZA"],
    description: "Start Your Order Just Only $25.00",
    image: "/images/burger.png",
    alt: "Delicious vegetable pizza",
  },
  {
    title: ["HOT &", "CHEESY", "PIZZA"],
    description: "Taste The Happiness Just Only $22.00",
    image: "images/sushi.png",
    alt: "Hot and cheesy pizza",
  },
];

let slideIndex = 1;

const slideDuration = 6000;

let slideInterval;
let progressAnimation;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

/* ================= RENDER SLIDE ================= */

function renderSlide(index) {
  slideIndex = (index + slides.length) % slides.length;

  const slide = slides[slideIndex];

  hero.classList.remove("is-changing");

  heroTitle.replaceChildren();

  slide.title.forEach((line) => {
    const span = document.createElement("span");

    span.textContent = line;

    heroTitle.appendChild(span);
  });

  heroDescription.textContent = slide.description;

  heroImage.src = slide.image;
  heroImage.alt = slide.alt;

  currentSlide.textContent = String(slideIndex + 1).padStart(2, "0");

  void hero.offsetWidth;

  hero.classList.add("is-changing");

  restartProgress();
}

/* ================= SLIDER PROGRESS ================= */

function restartProgress() {
  if (progressAnimation) {
    progressAnimation.cancel();
  }

  progressBar.style.transform = "scaleX(0)";

  if (prefersReducedMotion.matches) {
    return;
  }

  progressAnimation = progressBar.animate(
    [
      { transform: "scaleX(0)" },
      { transform: "scaleX(1)" },
    ],
    {
      duration: slideDuration,
      easing: "linear",
      fill: "forwards",
    }
  );
}

/* ================= AUTOPLAY ================= */

function stopAutoplay() {
  clearInterval(slideInterval);

  if (progressAnimation) {
    progressAnimation.pause();
  }
}

function startAutoplay() {
  clearInterval(slideInterval);

  if (prefersReducedMotion.matches) {
    return;
  }

  restartProgress();

  slideInterval = setInterval(() => {
    renderSlide(slideIndex + 1);
  }, slideDuration);
}

/* ================= MANUAL SLIDER ================= */

function changeSlide(direction) {
  stopAutoplay();

  renderSlide(slideIndex + direction);

  startAutoplay();
}

prevButton.addEventListener("click", () => {
  changeSlide(-1);
});

nextButton.addEventListener("click", () => {
  changeSlide(1);
});

/* ================= PAUSE ON HOVER ================= */

hero.addEventListener("mouseenter", stopAutoplay);

hero.addEventListener("mouseleave", startAutoplay);

/* ================= KEYBOARD ================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeCart();
  }

  if (document.activeElement.closest(".hero-slider-controls")) {
    if (event.key === "ArrowLeft") {
      changeSlide(-1);
    }

    if (event.key === "ArrowRight") {
      changeSlide(1);
    }
  }
});

/* ================= VISIBILITY ================= */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
});

/* ================= SCROLL PROGRESS ================= */

let ticking = false;

function updateScroll() {
  const scrollTop = window.scrollY;

  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    scrollHeight > 0 ? scrollTop / scrollHeight : 0;

  scrollProgress.style.transform = `scaleX(${progress})`;

  header.classList.toggle("is-scrolled", scrollTop > 30);

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  },
  { passive: true }
);

/* ================= SCROLL REVEAL ================= */

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px",
  }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  revealObserver.observe(element);
});

/* ================= INITIALIZE ================= */

renderSlide(slideIndex);
startAutoplay();
updateScroll();



/* ==================================================
   PRODUCT SECTION FUNCTIONALITY
================================================== */

(() => {
  "use strict";

  const productCards = [
    ...document.querySelectorAll(".product-card"),
  ];

  const cartCount = document.querySelector("#cart-count");
  const cartBody = document.querySelector(".cart-body");

  const storageKey = "tastenest-products-cart";

  /* ================= PRODUCT DATA ================= */

  const products = productCards.map((card) => ({
    id: card.dataset.productId,
    name: card.querySelector("h3").textContent.trim(),
    price: Number(card.dataset.price),
    image: card.querySelector(".product-card__image").src,
  }));

  /* ================= LOCAL STORAGE ================= */

  let cart = [];

  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    if (Array.isArray(saved)) {
      cart = saved.filter(
        (item) =>
          products.some((product) => product.id === item.id) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0
      );
    }
  } catch {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // Continue without local storage.
    }
  }

  /* ================= CURRENCY ================= */

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  /* ================= NOTIFICATION ================= */

  const notification = document.createElement("div");

  notification.className = "product-toast";
  notification.setAttribute("role", "status");
  notification.setAttribute("aria-live", "polite");

  document.body.appendChild(notification);

  let notificationTimer;

  function showNotification(message) {
    notification.replaceChildren();

    const icon = document.createElement("ion-icon");

    icon.setAttribute("name", "checkmark-circle-outline");
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");

    text.textContent = message;

    notification.append(icon, text);

    notification.classList.add("show");

    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(() => {
      notification.classList.remove("show");
    }, 2500);
  }

  /* ================= UPDATE CART COUNT ================= */

  function updateCartCount() {
    const quantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    if (cartCount) {
      cartCount.textContent = String(quantity);
    }

    const cartButton = document.querySelector("#cart-btn");

    if (cartButton) {
      cartButton.setAttribute(
        "aria-label",
        `Shopping Cart, ${quantity} items`
      );
    }
  }

  /* ================= ADD PRODUCT ================= */

  function addProduct(productId, button) {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return;

    const existing = cart.find(
      (item) => item.id === productId
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: productId,
        quantity: 1,
      });
    }

    saveCart();
    updateCartCount();
    renderCart();

    showNotification(`${product.name} added to cart`);

    button.classList.add("added");

    const icon = button.querySelector("ion-icon");

    icon.setAttribute("name", "checkmark-outline");

    clearTimeout(button._resetTimer);

    button._resetTimer = setTimeout(() => {
      button.classList.remove("added");
      icon.setAttribute("name", "bag-add-outline");
    }, 1200);
  }

  /* ================= PRODUCT BUTTONS ================= */

  productCards.forEach((card) => {
    const button = card.querySelector(".product-card__add");

    button.addEventListener("click", () => {
      addProduct(card.dataset.productId, button);
    });
  });

  /* ================= CREATE CART ITEM ================= */

  function createCartItem(item) {
    const product = products.find(
      (entry) => entry.id === item.id
    );

    const row = document.createElement("div");

    row.className = "cart-product-item";

    const image = document.createElement("img");

    image.src = product.image;
    image.alt = "";
    image.width = 70;
    image.height = 70;

    const info = document.createElement("div");

    info.className = "cart-product-info";

    const name = document.createElement("h4");

    name.textContent = product.name;

    const price = document.createElement("p");

    price.textContent =
      `${item.quantity} × ${formatPrice(product.price)}`;

    info.append(name, price);

    const remove = document.createElement("button");

    remove.type = "button";
    remove.className = "cart-remove";

    remove.setAttribute(
      "aria-label",
      `Remove ${product.name}`
    );

    const removeIcon = document.createElement("ion-icon");

    removeIcon.setAttribute("name", "trash-outline");
    removeIcon.setAttribute("aria-hidden", "true");

    remove.append(removeIcon);

    remove.addEventListener("click", () => {
      cart = cart.filter(
        (entry) => entry.id !== product.id
      );

      saveCart();
      updateCartCount();
      renderCart();

      showNotification(`${product.name} removed`);
    });

    row.append(image, info, remove);

    return row;
  }

  /* ================= RENDER CART ================= */

  function renderCart() {
    if (!cartBody) return;

    cartBody.replaceChildren();

    if (!cart.length) {
      const icon = document.createElement("ion-icon");

      icon.setAttribute("name", "basket-outline");
      icon.setAttribute("aria-hidden", "true");

      const title = document.createElement("h3");

      title.textContent = "Your cart is empty";

      const description = document.createElement("p");

      description.textContent =
        "Delicious food is waiting for you!";

      cartBody.append(icon, title, description);

      return;
    }

    const list = document.createElement("div");

    list.style.width = "100%";

    cart.forEach((item) => {
      list.appendChild(createCartItem(item));
    });

    const subtotal = cart.reduce((total, item) => {
      const product = products.find(
        (entry) => entry.id === item.id
      );

      return total + product.price * item.quantity;
    }, 0);

    const totalRow = document.createElement("div");

    totalRow.className = "cart-total";

    const label = document.createElement("span");

    label.textContent = "Subtotal";

    const amount = document.createElement("strong");

    amount.textContent = formatPrice(subtotal);

    totalRow.append(label, amount);

    cartBody.append(list, totalRow);
  }

  /* ================= CONTINUE SHOPPING ================= */

  const continueShopping = document.querySelector(
    ".cart-shop-btn"
  );

  continueShopping?.addEventListener("click", () => {
    document.querySelector("#cart-close")?.click();
  });

  /* ================= INITIALIZE ================= */

  updateCartCount();
  renderCart();
})();




/* ==========================================================
   SECTION 04 — DEAL OF THE DAY SLIDER

   Features:
   - Automatic Slider
   - Previous / Next Navigation
   - Smooth Image Transitions
   - Text Fade Animations
   - Scroll Reveal
   - Pause When Out of View
   - Pause While Interacting
   - Pause on Hidden Tab
   - Image Preloading
   - Reduced Motion Support
   - Accessible Announcements
========================================================== */

(() => {
  "use strict";

  /* ================= ELEMENTS ================= */

  const dealSection = document.querySelector(".deal-section");

  if (!dealSection) return;

  const dealImage = dealSection.querySelector("#deal-image");
  const dealTitle = dealSection.querySelector("#deal-title");
  const dealPrice = dealSection.querySelector("#deal-price");

  const dealDescription = dealSection.querySelector(
    "#deal-description"
  );

  const nextButton = dealSection.querySelector("#deal-next");
  const prevButton = dealSection.querySelector("#deal-prev");

  const sliderControls = dealSection.querySelector(
    ".deal-slider-controls"
  );

  const dealStatus = dealSection.querySelector("#deal-status");

  /* ==================================================
     SLIDER DATA

     Replace image paths with your own food images.
  ================================================== */

  const dealSlides = [
    {
      title: [
        "TODAY’S The",
        "Hamburger’ DAY",
      ],

      price: "$55",

      description:
        "Savor the perfect symphony of flavors. " +
        "Experience quick and efficient dining with our " +
        "signature hamburger, freshly prepared to " +
        "delight your taste buds.",

      image: "/images/deal-1.png",

      alt:
        "Delicious grilled barbecue platter with " +
        "golden fries and fresh vegetables",
    },

    {
      title: [
        "SPECIAL",
        "PIZZA DAY",
      ],

      price: "$39",

      description:
        "Discover the irresistible taste of our " +
        "freshly baked pizza, prepared with premium " +
        "ingredients, rich melted cheese, and bold " +
        "flavors in every delicious slice.",

      image: "/images/deal-2.png",

      alt:
        "Freshly baked pizza topped with melted cheese " +
        "and delicious ingredients",
    },

    {
      title: [
        "CRISPY CHICKEN",
        "SPECIAL DAY",
      ],

      price: "$42",

      description:
        "Enjoy our perfectly seasoned crispy chicken, " +
        "served hot and fresh with delicious sides. " +
        "A mouthwatering combination of taste, " +
        "quality, and unforgettable flavor.",

      image: "/images/deal-3.png",

      alt:
        "Crispy fried chicken served with fresh " +
        "vegetables and delicious sides",
    },
  ];

  /* ================= SETTINGS ================= */

  const SLIDE_DURATION = 6500;
  const TRANSITION_DURATION = 260;

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* ================= STATE ================= */

  let activeIndex = 0;
  let autoplayTimer = null;
  let transitionTimer = null;

  let isVisible = false;
  let isChanging = false;
  let isInteracting = false;

  /* ==================================================
     PRELOAD IMAGES
  ================================================== */

  function preloadImages() {
    dealSlides.forEach((slide) => {
      const image = new Image();

      image.src = slide.image;
    });
  }

  /* ==================================================
     TITLE GENERATOR
  ================================================== */

  function updateTitle(lines) {
    const fragment = document.createDocumentFragment();

    lines.forEach((line) => {
      const span = document.createElement("span");

      span.textContent = line;

      fragment.appendChild(span);
    });

    dealTitle.replaceChildren(fragment);
  }

  /* ==================================================
     UPDATE CONTENT
  ================================================== */

  function updateSlideContent(index) {
    const slide = dealSlides[index];

    updateTitle(slide.title);

    dealPrice.textContent = slide.price;
    dealDescription.textContent = slide.description;

    dealImage.src = slide.image;
    dealImage.alt = slide.alt;
  }

  /* ==================================================
     AUTOPLAY CONTROLS
  ================================================== */

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      clearInterval(autoplayTimer);

      autoplayTimer = null;
    }
  }

  function canAutoplay() {
    return (
      isVisible &&
      !document.hidden &&
      !motionPreference.matches &&
      !isInteracting &&
      !isChanging
    );
  }

  function startAutoplay() {
    stopAutoplay();

    if (!canAutoplay()) return;

    autoplayTimer = window.setInterval(() => {
      changeSlide(1, false);
    }, SLIDE_DURATION);
  }

  /* ==================================================
     CHANGE SLIDE
  ================================================== */

  function changeSlide(direction, isManual = true) {
    if (isChanging) return;

    isChanging = true;

    stopAutoplay();

    const nextIndex =
      (activeIndex + direction + dealSlides.length) %
      dealSlides.length;

    /* Start Exit Animation */

    dealSection.classList.add("is-changing");

    /* Wait for Smooth Fade Out */

    transitionTimer = window.setTimeout(() => {
      activeIndex = nextIndex;

      /* Update Slide Data */

      updateSlideContent(activeIndex);

      /* Restart Browser Paint */

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          dealSection.classList.remove("is-changing");

          isChanging = false;

          /* Accessible Announcement */

          if (isManual) {
            const current = dealSlides[activeIndex];

            dealStatus.textContent =
              `Deal ${activeIndex + 1} of ` +
              `${dealSlides.length}: ` +
              `${current.title.join(" ")}. ` +
              `Special price ${current.price}.`;
          }

          /* Restart Autoplay */

          startAutoplay();
        });
      });
    }, TRANSITION_DURATION);
  }

  /* ==================================================
     NEXT SLIDE
  ================================================== */

  nextButton.addEventListener("click", () => {
    changeSlide(1, true);
  });

  /* ==================================================
     PREVIOUS SLIDE
  ================================================== */

  prevButton.addEventListener("click", () => {
    changeSlide(-1, true);
  });

  /* ==================================================
     KEYBOARD NAVIGATION
  ================================================== */

  sliderControls.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();

      changeSlide(1, true);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      changeSlide(-1, true);
    }
  });

  /* ==================================================
     PAUSE ON CONTROLS HOVER
  ================================================== */

  sliderControls.addEventListener("mouseenter", () => {
    isInteracting = true;

    stopAutoplay();
  });

  sliderControls.addEventListener("mouseleave", () => {
    isInteracting = false;

    startAutoplay();
  });

  /* ==================================================
     PAUSE ON KEYBOARD FOCUS
  ================================================== */

  sliderControls.addEventListener("focusin", () => {
    isInteracting = true;

    stopAutoplay();
  });

  sliderControls.addEventListener("focusout", (event) => {
    if (
      event.relatedTarget &&
      sliderControls.contains(event.relatedTarget)
    ) {
      return;
    }

    isInteracting = false;

    startAutoplay();
  });

  /* ==================================================
     PAUSE WHEN BROWSER TAB IS HIDDEN
  ================================================== */

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  /* ==================================================
     REDUCED MOTION CHANGES
  ================================================== */

  function handleMotionChange() {
    startAutoplay();
  }

  if (typeof motionPreference.addEventListener === "function") {
    motionPreference.addEventListener(
      "change",
      handleMotionChange
    );
  } else if (
    typeof motionPreference.addListener === "function"
  ) {
    motionPreference.addListener(handleMotionChange);
  }

  /* ==================================================
     SCROLL REVEAL + VISIBILITY DETECTION
  ================================================== */

  function initializeScrollAnimation() {
    if (!("IntersectionObserver" in window)) {
      isVisible = true;

      dealSection.classList.add("is-inview");

      startAutoplay();

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;

          if (entry.isIntersecting) {
            /* Reveal Section */

            dealSection.classList.add("is-inview");

            /* Start Slider */

            startAutoplay();
          } else {
            /* Stop Slider When Out of View */

            stopAutoplay();
          }
        });
      },
      {
        threshold: 0.15,

        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(dealSection);
  }

  /* ==================================================
     INITIALIZE SLIDER
  ================================================== */

  function initializeDealSlider() {
    /* Set First Slide */

    updateSlideContent(activeIndex);

    /* Preload Remaining Images */

    preloadImages();

    /* Enable Scroll Animation */

    if (!motionPreference.matches) {
      dealSection.classList.add("deal--enhanced");
    }

    /* Initialize IntersectionObserver */

    initializeScrollAnimation();
  }

  initializeDealSlider();

})();



/* ==========================================================
   SECTIONS 05 & 06 — FOOD FEATURES + INFINITE MARQUEE

   Features:
   - Staggered Food Card Entrance
   - IntersectionObserver Scroll Animation
   - Infinite Text Slider (CSS)
   - Responsive Layout Support
   - Reduced Motion Accessibility

   Add this code at the bottom of script.js
========================================================== */

(() => {
  "use strict";

  /* ================= ELEMENTS ================= */

  const featureSection = document.querySelector(
    ".food-feature-section"
  );

  if (!featureSection) return;

  const featureCards = [
    ...featureSection.querySelectorAll(
      "[data-food-reveal]"
    ),
  ];

  /* ================= MOTION PREFERENCE ================= */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* ==================================================
     REVEAL ALL CARDS
  ================================================== */

  function revealAllCards() {
    featureCards.forEach((card) => {
      card.classList.add("is-visible");
    });
  }

  /* ==================================================
     INITIALIZE SCROLL REVEAL
  ================================================== */

  function initializeFeatureReveal() {
    if (
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      revealAllCards();
      return;
    }

    featureSection.classList.add("is-enhanced");

    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          instance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    featureCards.forEach((card) => {
      observer.observe(card);
    });
  }

  /* ==================================================
     INITIALIZE
  ================================================== */

  initializeFeatureReveal();

})();




/* ==========================================================
   SECTION 07 — CUSTOMER TESTIMONIAL SLIDER

   Features:
   - Automatic Infinite Slider
   - Clickable Customer Avatars
   - Smooth Content Transitions
   - Active Center Avatar
   - Previous / Next Navigation
   - Keyboard Navigation
   - Scroll Reveal Animation
   - Pause on Hover
   - Pause on Keyboard Focus
   - Pause Outside Viewport
   - Pause When Browser Tab Is Hidden
   - Reduced Motion Support
   - Accessible Slider Announcements

   Add at the bottom of script.js
========================================================== */

(() => {
  "use strict";

  /* ==================================================
     ELEMENTS
  ================================================== */

  const reviewSection = document.querySelector(
    ".customer-review"
  );

  if (!reviewSection) return;

  const reviewName = reviewSection.querySelector(
    ".customer-review__name"
  );

  const reviewDesignation = reviewSection.querySelector(
    ".customer-review__designation"
  );

  const reviewText = reviewSection.querySelector(
    "#customer-review-text"
  );

  const reviewStatus = reviewSection.querySelector(
    "#customer-review-status"
  );

  const avatarButtons = {
    previous: reviewSection.querySelector(
      '[data-review-slot="previous"]'
    ),

    active: reviewSection.querySelector(
      '[data-review-slot="active"]'
    ),

    next: reviewSection.querySelector(
      '[data-review-slot="next"]'
    ),
  };

  /* ==================================================
     TESTIMONIAL DATA

     Replace demo reviews with real customer feedback.
  ================================================== */

  const reviews = [
    {
      name: "Sophia Bennett",

      designation: "Food Enthusiast",

      quote:
        "“Absolutely Loved The Food And The Atmosphere! " +
        "Every Dish Was Fresh, Delicious, And Beautifully " +
        "Presented. The Service Was Wonderful, And I " +
        "Can't Wait To Visit Again.”",

      image: "/images/review-client-1.png",
    },

    {
      name: "Piter Bowman",

      designation: "Business CEO & Co Founder",

      quote:
        "“Thank You For Dinner Last Night. It Was Amazing!! " +
        "I Have Say It’s The Best Meal I Have Had In Quite " +
        "Some Time. Will Definitely Be Seeing More Eating " +
        "Next Year.”",

      image: "/images/review-client-2.png",
    },

    {
      name: "Emily Carter",

      designation: "Restaurant Guest",

      quote:
        "“What An Incredible Dining Experience! From The " +
        "First Bite To The Last, Everything Was Perfect. " +
        "The Flavors Were Outstanding, The Staff Was " +
        "Friendly, And The Food Was Truly Unforgettable.”",

      image: "/images/review-client-3.png",
    },
  ];

  /* ==================================================
     SLIDER SETTINGS
  ================================================== */

  const AUTOPLAY_DELAY = 6000;

  const TRANSITION_DELAY = 240;

  /* ==================================================
     SLIDER STATE
  ================================================== */

  let activeReviewIndex = 1;

  let autoplayTimer = null;
  let transitionTimer = null;

  let isVisible = false;
  let isHovered = false;
  let isFocused = false;
  let isAnimating = false;

  let hasEnteredViewport = false;

  /* ==================================================
     REDUCED MOTION
  ================================================== */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* ==================================================
     INDEX NORMALIZATION
  ================================================== */

  function normalizeIndex(index) {
    return (
      (index % reviews.length + reviews.length) %
      reviews.length
    );
  }

  /* ==================================================
     PRELOAD AVATAR IMAGES
  ================================================== */

  function preloadReviewImages() {
    reviews.forEach((review) => {
      const image = new Image();

      image.src = review.image;
    });
  }

  /* ==================================================
     UPDATE CUSTOMER INFORMATION
  ================================================== */

  function updateCustomerContent() {
    const review = reviews[activeReviewIndex];

    reviewName.textContent = review.name;

    reviewDesignation.textContent = review.designation;

    reviewText.textContent = review.quote;
  }

  /* ==================================================
     UPDATE AVATAR BUTTON
  ================================================== */

  function updateAvatarButton(button, reviewIndex, slot) {
    const review = reviews[reviewIndex];

    const image = button.querySelector("img");

    image.src = review.image;
    image.alt = "";

    button.dataset.reviewIndex = String(reviewIndex);

    const isActive = slot === "active";

    button.setAttribute(
      "aria-pressed",
      String(isActive)
    );

    if (isActive) {
      button.setAttribute(
        "aria-label",
        `Current customer review: ${review.name}`
      );
    } else {
      button.setAttribute(
        "aria-label",
        `View ${slot} review by ${review.name}`
      );
    }
  }

  /* ==================================================
     UPDATE ALL AVATARS

     Previous | Active | Next

     Active Avatar Always Stays in the Center
  ================================================== */

  function updateAvatars() {
    const previousIndex = normalizeIndex(
      activeReviewIndex - 1
    );

    const nextIndex = normalizeIndex(
      activeReviewIndex + 1
    );

    updateAvatarButton(
      avatarButtons.previous,
      previousIndex,
      "previous"
    );

    updateAvatarButton(
      avatarButtons.active,
      activeReviewIndex,
      "active"
    );

    updateAvatarButton(
      avatarButtons.next,
      nextIndex,
      "next"
    );
  }

  /* ==================================================
     RENDER CURRENT REVIEW
  ================================================== */

  function renderReview() {
    updateCustomerContent();

    updateAvatars();
  }

  /* ==================================================
     AUTOPLAY CONDITION
  ================================================== */

  function canAutoplay() {
    return (
      isVisible &&
      !document.hidden &&
      !reducedMotion.matches &&
      !isHovered &&
      !isFocused &&
      !isAnimating
    );
  }

  /* ==================================================
     STOP AUTOPLAY
  ================================================== */

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      window.clearTimeout(autoplayTimer);

      autoplayTimer = null;
    }
  }

  /* ==================================================
     START AUTOPLAY
  ================================================== */

  function startAutoplay() {
    stopAutoplay();

    if (!canAutoplay()) return;

    autoplayTimer = window.setTimeout(() => {
      changeReview(1, false);
    }, AUTOPLAY_DELAY);
  }

  /* ==================================================
     ACCESSIBLE ANNOUNCEMENT
  ================================================== */

  function announceReview() {
    const review = reviews[activeReviewIndex];

    reviewStatus.textContent =
      `Review ${activeReviewIndex + 1} of ` +
      `${reviews.length}. ${review.name}, ` +
      `${review.designation}. ${review.quote}`;
  }

  /* ==================================================
     CHANGE REVIEW

     Steps:
     1. Stop Autoplay
     2. Start Fade-Out
     3. Update Review Content
     4. Update Customer Avatars
     5. Start Fade-In
     6. Restart Autoplay
  ================================================== */

  function changeReview(direction, isManual = true) {
    if (isAnimating) return;

    isAnimating = true;

    stopAutoplay();

    const nextIndex = normalizeIndex(
      activeReviewIndex + direction
    );

    /* Reduced Motion: Instant Update */

    if (reducedMotion.matches) {
      activeReviewIndex = nextIndex;

      renderReview();

      if (isManual) {
        announceReview();
      }

      isAnimating = false;

      return;
    }

    /* Fade Out */

    reviewSection.classList.add("is-switching");

    transitionTimer = window.setTimeout(() => {
      activeReviewIndex = nextIndex;

      /* Update Content */

      renderReview();

      /* Allow Browser to Paint New Content */

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          /* Fade In */

          reviewSection.classList.remove("is-switching");

          if (isManual) {
            announceReview();
          }

          isAnimating = false;

          /* Resume Autoplay */

          startAutoplay();
        });
      });
    }, TRANSITION_DELAY);
  }

  /* ==================================================
     PREVIOUS CUSTOMER
  ================================================== */

  avatarButtons.previous.addEventListener(
    "click",
    () => {
      changeReview(-1, true);
    }
  );

  /* ==================================================
     NEXT CUSTOMER
  ================================================== */

  avatarButtons.next.addEventListener(
    "click",
    () => {
      changeReview(1, true);
    }
  );

  /* ==================================================
     ACTIVE CUSTOMER
  ================================================== */

  avatarButtons.active.addEventListener(
    "click",
    () => {
      /* Active review is already displayed. */
    }
  );

  /* ==================================================
     KEYBOARD NAVIGATION
  ================================================== */

  const reviewNavigation = reviewSection.querySelector(
    ".customer-review__navigation"
  );

  reviewNavigation.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();

        changeReview(1, true);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        changeReview(-1, true);
      }
    }
  );

  /* ==================================================
     PAUSE ON HOVER
  ================================================== */

  reviewSection.addEventListener("mouseenter", () => {
    isHovered = true;

    stopAutoplay();
  });

  reviewSection.addEventListener("mouseleave", () => {
    isHovered = false;

    startAutoplay();
  });

  /* ==================================================
     PAUSE ON KEYBOARD FOCUS
  ================================================== */

  reviewNavigation.addEventListener("focusin", () => {
    isFocused = true;

    stopAutoplay();
  });

  reviewNavigation.addEventListener(
    "focusout",
    (event) => {
      if (
        event.relatedTarget &&
        reviewNavigation.contains(event.relatedTarget)
      ) {
        return;
      }

      isFocused = false;

      startAutoplay();
    }
  );

  /* ==================================================
     PAUSE WHEN BROWSER TAB IS HIDDEN
  ================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  );

  /* ==================================================
     REDUCED MOTION CHANGE
  ================================================== */

  function handleMotionChange() {
    startAutoplay();
  }

  if (
    typeof reducedMotion.addEventListener === "function"
  ) {
    reducedMotion.addEventListener(
      "change",
      handleMotionChange
    );
  } else if (
    typeof reducedMotion.addListener === "function"
  ) {
    reducedMotion.addListener(handleMotionChange);
  }

  /* ==================================================
     SCROLL REVEAL
  ================================================== */

  function initializeScrollReveal() {
    if (
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      isVisible = true;

      reviewSection.classList.add("is-inview");

      startAutoplay();

      return;
    }

    reviewSection.classList.add("is-enhanced");

    const reviewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;

          /* Section Entered Viewport */

          if (entry.isIntersecting) {
            if (!hasEnteredViewport) {
              reviewSection.classList.add("is-inview");

              hasEnteredViewport = true;
            }

            startAutoplay();
          } else {
            /* Pause Slider Outside Viewport */

            stopAutoplay();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    reviewObserver.observe(reviewSection);
  }

  /* ==================================================
     INITIALIZE SLIDER
  ================================================== */

  function initializeReviewSlider() {
    /* Render Default Customer */

    renderReview();

    /* Preload Avatar Images */

    preloadReviewImages();

    /* Initialize Scroll Animation */

    initializeScrollReveal();
  }

  initializeReviewSlider();

})();