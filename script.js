"use strict";

// Scroll suave interno
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Nav botão animação
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

// Só roda se o botão existir (evita erro)
if (menuToggle && navLinks) {

    // Abrir/fechar no botão
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Fechar ao clicar em um link
    navItems.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });

    // Fechar ao clicar fora
    document.addEventListener("click", (event) => {
        const isClickInside =
            navLinks.contains(event.target) ||
            menuToggle.contains(event.target);

        if (!isClickInside) {
            navLinks.classList.remove("active");
        }
    });
}

//Carossel animação
const carrossel = document.querySelector('.carrossel');
const cards = document.querySelectorAll('.card');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

let index = 0;
let interval;

if (carrossel && next && prev && cards.length > 0) {
  function updateCarousel() {
    carrossel.style.transform = `translateX(-${index * 100}%)`;
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
    interval = setInterval(nextSlide, 20000);
  }

  function resetAutoPlay() {
    clearInterval(interval);
    startAutoPlay();
  }

  next.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  prev.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  startAutoPlay();

  // swipe
  let startX = 0;
  let endX = 0;
  const threshold = 50;

  carrossel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carrossel.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoPlay();
    }
  }
}