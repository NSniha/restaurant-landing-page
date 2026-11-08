"use strict";

/* ==========================
   HEADER SECTION START
============================ */

const header = document.querySelector("#header");
const menuToggle = document.querySelector("#menu-toggle");
const navbar = document.querySelector("#navbar");

const cartButton = document.querySelector("#cart-btn");
const cartClose = document.querySelector("#cart-close");
const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-overlay");

const scrollProgress = document.querySelector(".scroll-progress");

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeCart();
  }
});

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

updateScroll();

/* ==========================
   HEADER SECTION END
============================ */


/* ==========================
   HERO SECTION START
============================ */

const hero = document.querySelector(".hero");
const heroTitle = document.querySelector("#hero-title");
const heroDescription = document.querySelector("#hero-description");
const heroImage = document.querySelector("#hero-image");

const currentSlide = document.querySelector("#current-slide");
const progressBar = document.querySelector(".slider-progress-bar");

const prevButton = document.querySelector("#slider-prev");
const nextButton = document.querySelector("#slider-next");

const slides = [
  {
    title: ["FRESH", "BAKED", "PIZZA"],
    description: "Fresh from the oven, loaded with flavor — only $19.00",
    image: "/images/pizza.png",
    alt: "Freshly baked, cheese-filled pizza with a golden crust",
  },
  {
    title: ["DOUBLE", "CHEESE", "BURGER"],
    description: "Double the cheese, double the flavor — only $25.00",
    image: "/images/burger.png",
    alt: "Juicy double cheeseburger with lettuce, tomato and sauce",
  },
  {
    title: ["HOT &", "CRISPY", "CHICKEN"],
    description: "Crunch into golden, juicy chicken — only $22.00",
    image: "/images/sushi.png",
    alt: "Golden crispy fried chicken drumsticks with a flavorful coating",
  },
];

let slideIndex = 1;
const slideDuration = 6000;

let slideInterval;
let progressAnimation;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

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

function restartProgress() {
  if (progressAnimation) {
    progressAnimation.cancel();
  }

  progressBar.style.transform = "scaleX(0)";

  if (prefersReducedMotion.matches) return;

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

function stopAutoplay() {
  clearInterval(slideInterval);

  if (progressAnimation) {
    progressAnimation.pause();
  }
}

function startAutoplay() {
  clearInterval(slideInterval);

  if (prefersReducedMotion.matches || document.hidden) {
    return;
  }

  restartProgress();

  slideInterval = setInterval(() => {
    renderSlide(slideIndex + 1);
  }, slideDuration);
}

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

hero.addEventListener("mouseenter", stopAutoplay);
hero.addEventListener("mouseleave", startAutoplay);

document.addEventListener("keydown", (event) => {
  if (!document.activeElement?.closest?.(".hero-slider-controls")) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    changeSlide(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    changeSlide(1);
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
});

renderSlide(slideIndex);
startAutoplay();

/* ==========================
   HERO SECTION END
============================ */


/* ==========================
   PRODUCTS SECTION START
============================ */

(() => {
  "use strict";

  const productCards = [
    ...document.querySelectorAll(".product-card"),
  ];

  const cartCount = document.querySelector("#cart-count");
  const cartBody = document.querySelector(".cart-body");

  const storageKey = "tastenest-products-cart";

  const products = productCards.map((card) => ({
    id: card.dataset.productId,
    name: card.querySelector("h3").textContent.trim(),
    price: Number(card.dataset.price),
    image: card.querySelector(".product-card__image").src,
  }));

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
      // Continue without storage.
    }
  }

  const formatPrice = (price) => `$${price.toFixed(2)}`;

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

  function updateCartCount() {
    const quantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    if (cartCount) {
      cartCount.textContent = String(quantity);
    }

    const button = document.querySelector("#cart-btn");

    if (button) {
      button.setAttribute(
        "aria-label",
        `Shopping Cart, ${quantity} items`
      );
    }
  }

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

  productCards.forEach((card) => {
    const button = card.querySelector(".product-card__add");

    button.addEventListener("click", () => {
      addProduct(card.dataset.productId, button);
    });
  });

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
        "Your next delicious bite is just a click away.";

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

  const continueShopping = document.querySelector(
    ".cart-shop-btn"
  );

  continueShopping?.addEventListener("click", () => {
    document.querySelector("#cart-close")?.click();
  });

  updateCartCount();
  renderCart();
})();

/* ==========================
   PRODUCTS SECTION END
============================ */


/* ==========================
   DEAL OF THE DAY SECTION START
============================ */

(() => {
  "use strict";

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

  const dealSlides = [
    {
      title: ["SMOKY BBQ", "FEAST DAY"],

      price: "$55",

      description:
        "Savor tender, smoky barbecue served with golden fries, " +
        "vibrant vegetables and a rich dipping sauce. " +
        "A hearty feast made for serious food lovers.",

      image: "/images/deal-1.png",

      alt:
        "Smoky grilled barbecue meat with seasoned fries, " +
        "vegetables and dipping sauce",
    },
    {
      title: ["CHEESY PIZZA", "SPECIAL DAY"],

      price: "$39",

      description:
        "Dig into a freshly baked pizza with a golden crust, " +
        "generous layers of melted cheese and bold toppings. " +
        "A delicious favorite made for sharing.",

      image: "/images/deal-2.png",

      alt:
        "Freshly baked pizza topped with melted cheese " +
        "and delicious ingredients",
    },
    {
      title: ["GOLDEN CRISPY", "CHICKEN DAY"],

      price: "$42",

      description:
        "Enjoy perfectly seasoned, golden fried chicken with " +
        "a satisfying crunch and tender, juicy center. " +
        "Pair it with your favorite sides for a complete feast.",

      image: "/images/deal-3.png",

      alt: "Crispy golden chicken served with fresh sides",
    },
  ];

  const SLIDE_DURATION = 6500;
  const TRANSITION_DURATION = 260;

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let activeIndex = 0;
  let autoplayTimer = null;
  let transitionTimer = null;

  let isVisible = false;
  let isChanging = false;
  let isInteracting = false;

  function preloadImages() {
    dealSlides.forEach((slide) => {
      const image = new Image();
      image.src = slide.image;
    });
  }

  function updateTitle(lines) {
    const fragment = document.createDocumentFragment();

    lines.forEach((line) => {
      const span = document.createElement("span");
      span.textContent = line;
      fragment.appendChild(span);
    });

    dealTitle.replaceChildren(fragment);
  }

  function updateSlideContent(index) {
    const slide = dealSlides[index];

    updateTitle(slide.title);

    dealPrice.textContent = slide.price;
    dealDescription.textContent = slide.description;

    dealImage.src = slide.image;
    dealImage.alt = slide.alt;
  }

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

  function changeSlide(direction, isManual = true) {
    if (isChanging) return;

    isChanging = true;

    stopAutoplay();

    const nextIndex =
      (activeIndex + direction + dealSlides.length) %
      dealSlides.length;

    dealSection.classList.add("is-changing");

    transitionTimer = window.setTimeout(() => {
      activeIndex = nextIndex;

      updateSlideContent(activeIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          dealSection.classList.remove("is-changing");

          isChanging = false;

          if (isManual) {
            const current = dealSlides[activeIndex];

            dealStatus.textContent =
              `Deal ${activeIndex + 1} of ` +
              `${dealSlides.length}: ` +
              `${current.title.join(" ")}. ` +
              `Special price ${current.price}.`;
          }

          startAutoplay();
        });
      });
    }, TRANSITION_DURATION);
  }

  nextButton.addEventListener("click", () => {
    changeSlide(1, true);
  });

  prevButton.addEventListener("click", () => {
    changeSlide(-1, true);
  });

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

  sliderControls.addEventListener("mouseenter", () => {
    isInteracting = true;
    stopAutoplay();
  });

  sliderControls.addEventListener("mouseleave", () => {
    isInteracting = false;
    startAutoplay();
  });

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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

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
            dealSection.classList.add("is-inview");
            startAutoplay();
          } else {
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

  function initializeDealSlider() {
    updateSlideContent(activeIndex);
    preloadImages();

    if (!motionPreference.matches) {
      dealSection.classList.add("deal--enhanced");
    }

    initializeScrollAnimation();
  }

  initializeDealSlider();
})();

/* ==========================
   DEAL OF THE DAY SECTION END
============================ */


/* ==========================
   FOOD CATEGORIES SECTION START
============================ */

(() => {
  "use strict";

  const featureSection = document.querySelector(
    ".food-feature-section"
  );

  if (!featureSection) return;

  const featureCards = [
    ...featureSection.querySelectorAll("[data-food-reveal]"),
  ];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function revealAllCards() {
    featureCards.forEach((card) => {
      card.classList.add("is-visible");
    });
  }

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

  initializeFeatureReveal();
})();

/* ==========================
   FOOD CATEGORIES SECTION END
============================ */


/* ==========================
   CUSTOMER TESTIMONIALS SECTION START
============================ */

(() => {
  "use strict";

  const reviewSection = document.querySelector(".customer-review");

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

  const reviews = [
    {
      name: "Sophia Bennett",

      designation: "Food Lover",

      quote:
        "“The Crispy Chicken Was So Flavorful And The Fries Were " +
        "Perfectly Golden. Everything Tasted Fresh, And The " +
        "Friendly Atmosphere Made The Visit Even Better.”",

      image: "/images/review-client-1.png",
    },
    {
      name: "Piter Bowman",

      designation: "TasteNest Guest",

      quote:
        "“Every Bite Was Packed With Flavor! The Food Was Fresh, " +
        "The Atmosphere Felt Warm, And The Whole Experience " +
        "Made Our Evening Special. I’m Already Looking Forward " +
        "To Coming Back.”",

      image: "/images/review-client-2.png",
    },
    {
      name: "Emily Carter",

      designation: "Food Enthusiast",

      quote:
        "“The Double Cheeseburger Was Incredible, And The " +
        "Service Made Us Feel Right At Home. From The First " +
        "Bite To The Last, It Was A Meal Worth Remembering.”",

      image: "/images/review-client-3.png",
    },
  ];

  const AUTOPLAY_DELAY = 6000;
  const TRANSITION_DELAY = 240;

  let activeReviewIndex = 1;

  let autoplayTimer = null;
  let transitionTimer = null;

  let isVisible = false;
  let isHovered = false;
  let isFocused = false;
  let isAnimating = false;

  let hasEnteredViewport = false;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function normalizeIndex(index) {
    return (
      (index % reviews.length + reviews.length) %
      reviews.length
    );
  }

  function preloadReviewImages() {
    reviews.forEach((review) => {
      const image = new Image();
      image.src = review.image;
    });
  }

  function updateCustomerContent() {
    const review = reviews[activeReviewIndex];

    reviewName.textContent = review.name;
    reviewDesignation.textContent = review.designation;
    reviewText.textContent = review.quote;
  }

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

  function renderReview() {
    updateCustomerContent();
    updateAvatars();
  }

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

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();

    if (!canAutoplay()) return;

    autoplayTimer = window.setTimeout(() => {
      changeReview(1, false);
    }, AUTOPLAY_DELAY);
  }

  function announceReview() {
    const review = reviews[activeReviewIndex];

    reviewStatus.textContent =
      `Review ${activeReviewIndex + 1} of ` +
      `${reviews.length}. ${review.name}, ` +
      `${review.designation}. ${review.quote}`;
  }

  function changeReview(direction, isManual = true) {
    if (isAnimating) return;

    isAnimating = true;
    stopAutoplay();

    const nextIndex = normalizeIndex(
      activeReviewIndex + direction
    );

    if (reducedMotion.matches) {
      activeReviewIndex = nextIndex;

      renderReview();

      if (isManual) {
        announceReview();
      }

      isAnimating = false;
      return;
    }

    reviewSection.classList.add("is-switching");

    transitionTimer = window.setTimeout(() => {
      activeReviewIndex = nextIndex;

      renderReview();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          reviewSection.classList.remove("is-switching");

          if (isManual) {
            announceReview();
          }

          isAnimating = false;
          startAutoplay();
        });
      });
    }, TRANSITION_DELAY);
  }

  avatarButtons.previous.addEventListener("click", () => {
    changeReview(-1, true);
  });

  avatarButtons.next.addEventListener("click", () => {
    changeReview(1, true);
  });

  const reviewNavigation = reviewSection.querySelector(
    ".customer-review__navigation"
  );

  reviewNavigation.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      changeReview(1, true);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeReview(-1, true);
    }
  });

  reviewSection.addEventListener("mouseenter", () => {
    isHovered = true;
    stopAutoplay();
  });

  reviewSection.addEventListener("mouseleave", () => {
    isHovered = false;
    startAutoplay();
  });

  reviewNavigation.addEventListener("focusin", () => {
    isFocused = true;
    stopAutoplay();
  });

  reviewNavigation.addEventListener("focusout", (event) => {
    if (
      event.relatedTarget &&
      reviewNavigation.contains(event.relatedTarget)
    ) {
      return;
    }

    isFocused = false;
    startAutoplay();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  function handleMotionChange() {
    startAutoplay();
  }

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener(
      "change",
      handleMotionChange
    );
  } else if (
    typeof reducedMotion.addListener === "function"
  ) {
    reducedMotion.addListener(handleMotionChange);
  }

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

          if (entry.isIntersecting) {
            if (!hasEnteredViewport) {
              reviewSection.classList.add("is-inview");
              hasEnteredViewport = true;
            }

            startAutoplay();
          } else {
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

  function initializeReviewSlider() {
    renderReview();
    preloadReviewImages();
    initializeScrollReveal();
  }

  initializeReviewSlider();
})();

/* ==========================
   CUSTOMER TESTIMONIALS SECTION END
============================ */


/* ==========================
   NEWS & BLOG SECTION START
============================ */

(() => {
  "use strict";

  const section = document.querySelector(".news-blog-section");

  if (!section) return;

  const revealElements = [
    ...section.querySelectorAll("[data-news-reveal]"),
  ];

  const dialog = section.querySelector("#news-blog-dialog");

  const dialogTitle = section.querySelector(
    "#news-blog-dialog-title"
  );

  const dialogImage = section.querySelector(
    "#news-blog-dialog-image"
  );

  const dialogCategory = section.querySelector(
    "#news-blog-dialog-category"
  );

  const dialogDate = section.querySelector(
    "#news-blog-dialog-date"
  );

  const dialogDescription = section.querySelector(
    "#news-blog-dialog-description"
  );

  const closeButton = section.querySelector(
    ".news-blog-dialog-close"
  );

  const posts = {
    1: {
      paragraphs: [
        "A great fast-food feast is about balance: crispy textures, juicy fillings, fresh vegetables and sauces that bring every bite together. Our menu takes inspiration from those simple pleasures.",

        "Start with a stacked burger or a loaded chicken wrap, add a generous serving of golden fries, and finish with the sauce you love most. Mixing favorites makes a casual meal feel like an occasion.",

        "Explore the TasteNest menu for crunchy chicken, satisfying burgers and crowd-pleasing combos, all brought together by our love of bold flavor.",
      ],
    },

    2: {
      paragraphs: [
        "Great flavor starts long before the food reaches your plate. Thoughtful seasoning, careful preparation and the right cooking technique all make a difference.",

        "Whether it is barbecue sizzling over heat, a freshly assembled wrap or chicken fried until golden, each step adds texture and character. Fresh vegetables and a flavorful sauce finish the dish.",

        "Step behind the grill with TasteNest and discover the small details that turn familiar favorites into memorable meals.",
      ],
    },

    3: {
      paragraphs: [
        "Sometimes the best part of a meal is the moment around it: a warm cup of coffee, something delicious to share and time to catch up with people who matter.",

        "From relaxed breakfasts to afternoon catch-ups, cozy dining spaces invite us to slow down and enjoy the simple things. A welcoming table can make an ordinary day feel special.",

        "At TasteNest, we celebrate those everyday dining moments and the food, drinks and conversations that bring people together.",
      ],
    },
  };

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function revealAll() {
    revealElements.forEach((element) => {
      element.classList.add("is-news-visible");
    });
  }

  function initializeScrollReveal() {
    if (
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      revealAll();
      return;
    }

    section.classList.add("is-news-animated");

    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-news-visible");
          instance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  function openBlogPost(postId) {
    const post = posts[postId];

    if (!post || !dialog || dialog.open) return;

    const button = section.querySelector(
      `.news-blog-card [data-blog-open="${postId}"]`
    );

    const card = button?.closest(".news-blog-card");

    if (!card) return;

    const image = card.querySelector(".news-blog-image img");
    const title = card.querySelector(".news-blog-title");
    const category = card.querySelector(".news-blog-category");
    const date = card.querySelector(".news-blog-meta time");

    dialogTitle.textContent = title.textContent.trim();

    dialogImage.src = image.getAttribute("src");
    dialogImage.alt = image.alt;

    dialogCategory.textContent = category.textContent.trim();

    dialogDate.textContent = date.textContent.trim();
    dialogDate.dateTime = date.dateTime;

    dialogDescription.replaceChildren();

    post.paragraphs.forEach((paragraph) => {
      const element = document.createElement("p");

      element.textContent = paragraph;

      dialogDescription.appendChild(element);
    });

    dialog.showModal();
  }

  section.addEventListener("click", (event) => {
    const button = event.target.closest("[data-blog-open]");

    if (!button || !section.contains(button)) return;

    openBlogPost(button.dataset.blogOpen);
  });

  closeButton?.addEventListener("click", () => {
    dialog.close();
  });

  dialog?.addEventListener("click", (event) => {
    if (event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();

    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      dialog.close();
    }
  });

  initializeScrollReveal();
})();

/* ==========================
   NEWS & BLOG SECTION END
============================ */



/* ==========================
   NEWSLETTER SECTION START
============================ */

(() => {
  "use strict";

  const forms = document.querySelectorAll(".tn-subscribe-form");

  const privacyDialog = document.querySelector(
    "#tn-privacy-dialog"
  );

  document.querySelectorAll(
    "[data-tn-open-privacy]"
  ).forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      privacyDialog?.showModal();
    });
  });

  privacyDialog?.querySelector(
    ".tn-privacy-dialog__close"
  )?.addEventListener("click", () => {
    privacyDialog.close();
  });

  privacyDialog?.querySelector(
    ".tn-privacy-dialog__button"
  )?.addEventListener("click", () => {
    privacyDialog.close();
  });

  privacyDialog?.addEventListener("click", (event) => {
    if (event.target === privacyDialog) {
      privacyDialog.close();
    }
  });

  forms.forEach((form) => {
    const input = form.querySelector('input[type="email"]');

    const status = form.querySelector(
      "[data-newsletter-status]"
    );

    const button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const email = input.value.trim();

      const endpoint = form.dataset.endpoint?.trim();

      if (!endpoint) {
        status.textContent =
          "Newsletter signup is not active yet. Please connect a subscription service.";

        return;
      }

      const originalText = button.textContent;

      button.disabled = true;
      button.textContent = "Subscribing...";

      status.textContent = "";

      try {
        const response = await fetch(endpoint, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        });

        if (!response.ok) {
          throw new Error("Subscription failed");
        }

        status.textContent =
          "Thank you! Your subscription request was received.";

        form.reset();
      } catch (error) {
        status.textContent =
          "Unable to subscribe right now. Please try again.";
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  });
})();

/* ==========================
   NEWSLETTER SECTION END
============================ */




/* ==========================
   FOOD GALLERY SECTION START
============================ */

(() => {
  "use strict";

  const gallery = document.querySelector(".tn-gallery");

  if (!gallery) return;

  const items = [
    ...gallery.querySelectorAll(".tn-gallery__item"),
  ];

  const lightbox = gallery.querySelector(
    "#tn-gallery-lightbox"
  );

  const lightboxImage = lightbox.querySelector(
    ".tn-gallery__lightbox-image"
  );

  const closeButton = lightbox.querySelector(
    ".tn-gallery__close"
  );

  const prevButton = lightbox.querySelector(
    ".tn-gallery__arrow--prev"
  );

  const nextButton = lightbox.querySelector(
    ".tn-gallery__arrow--next"
  );

  const currentCounter = lightbox.querySelector(
    "#tn-gallery-current"
  );

  const totalCounter = lightbox.querySelector(
    "#tn-gallery-total"
  );

  let currentIndex = 0;

  const images = items.map((item) => {
    const image = item.querySelector("img");

    return {
      src: image.currentSrc || image.src,
      alt: image.alt,
    };
  });

  totalCounter.textContent = String(
    images.length
  ).padStart(2, "0");

  function updateImage(index) {
    currentIndex =
      (index + images.length) % images.length;

    const image = images[currentIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    currentCounter.textContent = String(
      currentIndex + 1
    ).padStart(2, "0");
  }

  function openGallery(index) {
    updateImage(index);

    if (!lightbox.open) {
      lightbox.showModal();
    }
  }

  function closeGallery() {
    if (lightbox.open) {
      lightbox.close();
    }
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      openGallery(index);
    });
  });

  prevButton.addEventListener("click", () => {
    updateImage(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    updateImage(currentIndex + 1);
  });

  closeButton.addEventListener("click", closeGallery);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeGallery();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();

      updateImage(currentIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      updateImage(currentIndex - 1);
    }
  });
})();

/* ==========================
   FOOD GALLERY SECTION END
============================ */