"use strict";

document.documentElement.classList.add("js");

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const money = (amount) => `$${amount.toFixed(2)}`;

const storageKey = "tastenest-cart-v1";

/* ================= HERO SLIDER ================= */

const offers = [
  {
    name: "Classic Oven-Baked Pizza",
    lines: ["FRESH", "BAKED", "PIZZA"],
    price: 19,
    tagline: "Fresh From The Oven Just Only $19.00",
  },
  {
    name: "Super Delicious Pizza",
    lines: ["SUPER", "DELICIOUS", "PIZZA"],
    price: 25,
    tagline: "Star Your Order Just Only $25.00",
  },
  {
    name: "Hot & Cheesy Pizza",
    lines: ["HOT &", "CHEESY", "PIZZA"],
    price: 22,
    tagline: "Your Cheesy Favorite Just Only $22.00",
  },
];

let currentOffer = 1;
let quantity = 1;
let cart = [];
let toastTimer;

/* ================= CART STORAGE ================= */

try {
  const saved = JSON.parse(
    localStorage.getItem(storageKey) || "[]"
  );

  if (Array.isArray(saved)) {
    cart = saved.filter(
      (item) =>
        Number.isInteger(item.id) &&
        offers[item.id] &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  }
} catch {
  cart = [];
}

/* ================= ELEMENTS ================= */

const hero = $(".hero");
const title = $("#hero-title");
const subtitle = $(".hero__subtitle");
const previous = $("#previous-slide");

const orderDialog = $("#order-dialog");
const cartDialog = $("#cart-dialog");
const contactDialog = $("#contact-dialog");

const menuToggle = $("#menu-toggle");
const nav = $("#primary-nav");

/* ================= TOAST ================= */

function toast(message) {
  const element = $("#toast");

  element.textContent = message;
  element.classList.add("is-visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.classList.remove("is-visible");
  }, 3100);
}

/* ================= CHANGE SLIDE ================= */

function renderOffer() {
  const offer = offers[currentOffer];

  title.replaceChildren(
    ...offer.lines.map((line) => {
      const span = document.createElement("span");

      span.textContent = line;

      return span;
    })
  );

  subtitle.textContent = offer.tagline;
  previous.textContent = String(currentOffer + 1);

  hero.classList.remove("is-changing");

  void hero.offsetWidth;

  hero.classList.add("is-changing");

  window.setTimeout(() => {
    hero.classList.remove("is-changing");
  }, 800);
}

/* Previous Slide */

$("#previous-slide").addEventListener("click", () => {
  currentOffer =
    (currentOffer - 1 + offers.length) % offers.length;

  renderOffer();
});

/* Next Slide */

$("#next-slide").addEventListener("click", () => {
  currentOffer = (currentOffer + 1) % offers.length;

  renderOffer();
});

/* ================= DIALOGS ================= */

function syncDialogState() {
  document.body.classList.toggle(
    "dialog-open",
    $$("dialog[open]").length > 0
  );
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  }

  syncDialogState();
}

function closeDialog(dialog) {
  dialog.close();
  syncDialogState();
}

$$("dialog").forEach((dialog) => {
  dialog.addEventListener("close", syncDialogState);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  });
});

/* ================= QUANTITY ================= */

function updateQuantity() {
  $("#quantity-value").value = String(quantity);

  $("#add-to-cart").textContent =
    `Add to basket · ${
      money(offers[currentOffer].price * quantity)
    }`;
}

$("#order-button").addEventListener("click", () => {
  quantity = 1;

  $("#order-description").textContent =
    `${offers[currentOffer].name} · ${
      money(offers[currentOffer].price)
    } each`;

  updateQuantity();
  openDialog(orderDialog);
});

$("#quantity-minus").addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  updateQuantity();
});

$("#quantity-plus").addEventListener("click", () => {
  quantity = Math.min(50, quantity + 1);
  updateQuantity();
});

/* ================= PERSIST CART ================= */

function persistCart() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(cart)
    );
  } catch {
    // Storage may be blocked in private mode.
  }
}

/* ================= RENDER CART ================= */

function renderCart() {
  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + offers[item.id].price * item.quantity,
    0
  );

  $("#cart-count").textContent = String(itemCount);

  $("#cart-button").setAttribute(
    "aria-label",
    `Open basket, ${itemCount} ${
      itemCount === 1 ? "item" : "items"
    }`
  );

  $("#cart-subtotal").textContent = money(subtotal);

  const list = $("#cart-items");

  list.replaceChildren();

  if (!cart.length) {
    const message = document.createElement("p");

    message.className = "cart-empty";

    message.textContent =
      "Your basket is empty. Let's find something delicious!";

    list.append(message);

    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");

    row.className = "cart-row";

    const photo = document.createElement("img");

    photo.src = "assets/pizza.png";
    photo.alt = "";
    photo.width = 64;
    photo.height = 64;

    const details = document.createElement("div");

    details.className = "cart-row__details";

    const name = document.createElement("strong");

    name.textContent = offers[item.id].name;

    const amount = document.createElement("small");

    amount.textContent =
      `${item.quantity} × ${money(offers[item.id].price)}`;

    details.append(name, amount);

    const remove = document.createElement("button");

    remove.type = "button";
    remove.className = "cart-row__remove";
    remove.textContent = "Remove";

    remove.setAttribute(
      "aria-label",
      `Remove ${offers[item.id].name} from basket`
    );

    remove.addEventListener("click", () => {
      cart = cart.filter(
        (entry) => entry.id !== item.id
      );

      persistCart();
      renderCart();
    });

    row.append(photo, details, remove);

    list.append(row);
  });
}

/* ================= ADD TO CART ================= */

$("#add-to-cart").addEventListener("click", () => {
  const existing = cart.find(
    (entry) => entry.id === currentOffer
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: currentOffer,
      quantity,
    });
  }

  persistCart();
  renderCart();

  closeDialog(orderDialog);

  toast(
    `${quantity} ${
      quantity === 1 ? "pizza" : "pizzas"
    } added to your basket!`
  );
});

/* ================= CART ACTIONS ================= */

$("#cart-button").addEventListener("click", () => {
  renderCart();
  openDialog(cartDialog);
});

$("#continue-shopping").addEventListener("click", () => {
  closeDialog(cartDialog);
});

/* ================= CONTACT ================= */

$("#contact-button").addEventListener("click", () => {
  openDialog(contactDialog);
});

$("#close-contact").addEventListener("click", () => {
  closeDialog(contactDialog);
});

renderCart();

/* ================= NAV DROPDOWNS ================= */

function closeDropdowns(except = null) {
  $$(".dropdown-trigger").forEach((button) => {
    if (button !== except) {
      button.setAttribute("aria-expanded", "false");
    }
  });
}

$$(".dropdown-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const willOpen =
      button.getAttribute("aria-expanded") !== "true";

    closeDropdowns(button);

    button.setAttribute(
      "aria-expanded",
      String(willOpen)
    );
  });
});

/* ================= MOBILE MENU ================= */

function setMenu(open) {
  nav.classList.toggle("is-open", open);

  menuToggle.classList.toggle("is-open", open);

  menuToggle.setAttribute(
    "aria-expanded",
    String(open)
  );

  menuToggle.setAttribute(
    "aria-label",
    open
      ? "Close navigation menu"
      : "Open navigation menu"
  );

  if (!open) {
    closeDropdowns();
  }
}

menuToggle.addEventListener("click", () => {
  setMenu(!nav.classList.contains("is-open"));
});

/* Close Menu Outside */

document.addEventListener("click", (event) => {
  if (!event.target.closest(".has-dropdown")) {
    closeDropdowns();
  }

  if (
    nav.classList.contains("is-open") &&
    !event.target.closest(
      "#primary-nav, #menu-toggle"
    )
  ) {
    setMenu(false);
  }
});

/* Escape Key */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

/* ================= NAVIGATION LINKS ================= */

$$("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = $(link.getAttribute("href"));

    if (!target) {
      event.preventDefault();

      toast("This section is coming soon.");
    }

    setMenu(false);
  });
});

/* ================= SCROLL REVEAL ================= */

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (
  "IntersectionObserver" in window &&
  !reduceMotion
) {
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

  $$("[data-reveal]").forEach((element, index) => {
    if (element.dataset.revealDelay) {
      element.style.setProperty(
        "--reveal-delay",
        `${Number(element.dataset.revealDelay) || 0}ms`
      );
    } else if (element.classList.contains("card")) {
      element.style.setProperty(
        "--reveal-delay",
        `${(index % 4) * 90}ms`
      );
    }

    observer.observe(element);
  });
} else {
  $$("[data-reveal]").forEach((element) => {
    element.classList.add("is-visible");
  });
}

/* ================= SCROLL PROGRESS ================= */

let frame = 0;

window.addEventListener(
  "scroll",
  () => {
    if (frame) return;

    frame = requestAnimationFrame(() => {
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        maxScroll > 0
          ? window.scrollY / maxScroll
          : 0;

      $(".scroll-progress").style.transform =
        `scaleX(${
          Math.min(1, Math.max(0, progress))
        })`;

      frame = 0;
    });
  },
  { passive: true }
);