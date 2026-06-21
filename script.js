"use strict";

/* ==========================================================================
   Proteção contra clickjacking (defesa extra via JS)
   O ideal é bloquear isso por header HTTP (X-Frame-Options / CSP frame-ancestors)
   na hospedagem, que tem prioridade sobre isso. Este trecho é uma segunda
   camada: se o site for carregado dentro de um <iframe> de outro domínio,
   força a navegação a sair do iframe.
   ========================================================================== */
if (window.top !== window.self) {
  window.top.location = window.self.location;
}

/* ==========================================================================
   Scroll suave interno (fallback para navegadores sem CSS scroll-behavior
   e para fechar o menu mobile ao navegar)
   ========================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const targetId = link.getAttribute("href");
    if (targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", targetId);
    }
  });
});

/* ==========================================================================
   Header: sombra ao rolar a página
   ========================================================================== */
const header = document.querySelector(".header");

if (header) {
  const toggleHeaderShadow = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  toggleHeaderShadow();
  window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
}

/* ==========================================================================
   Menu mobile
   ========================================================================== */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

if (menuToggle && navLinks) {

  const closeMenu = () => {
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navItems.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const isClickInside =
      navLinks.contains(event.target) ||
      menuToggle.contains(event.target);

    if (!isClickInside) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/* ==========================================================================
   Carrossel de depoimentos
   ========================================================================== */
const carrossel = document.querySelector(".carrossel");
const cards = document.querySelectorAll(".depo-card");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dotsWrap = document.getElementById("carrosselDots");

let index = 0;
let interval;

if (carrossel && nextBtn && prevBtn && cards.length > 0) {

  // Monta os indicadores (dots) dinamicamente
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para depoimento ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      index = i;
      updateCarousel();
      resetAutoPlay();
    });
    dotsWrap?.appendChild(dot);
  });

  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  function updateCarousel() {
    carrossel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  function nextSlide() {
    index = (index + 1) % cards.length;
    updateCarousel();
  }

  function prevSlide() {
    index = (index - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  function startAutoPlay() {
    interval = setInterval(nextSlide, 7000);
  }

  function resetAutoPlay() {
    clearInterval(interval);
    startAutoPlay();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
  });

  startAutoPlay();

  const carrosselContainer = document.querySelector(".carrossel-container");
  carrosselContainer?.addEventListener("mouseenter", () => clearInterval(interval));
  carrosselContainer?.addEventListener("mouseleave", startAutoPlay);

  // swipe (touch)
  let startX = 0;
  let endX = 0;
  const threshold = 50;

  carrossel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  carrossel.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = startX - endX;
    if (Math.abs(diff) > threshold) {
      diff > 0 ? nextSlide() : prevSlide();
      resetAutoPlay();
    }
  }
}

/* ==========================================================================
   FAQ — fecha as demais perguntas ao abrir uma nova
   ========================================================================== */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      faqItems.forEach(other => {
        if (other !== item) other.removeAttribute("open");
      });
    }
  });
});

/* ==========================================================================
   Revelação de elementos ao rolar a página
   ========================================================================== */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("is-visible"));
}
