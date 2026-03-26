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

//Nav botão animação
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

//Carossel animação
const carrossel = document.querySelector('.carrossel');
const cards = document.querySelectorAll('.card');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

let index = 0;
let interval;

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
  interval = setInterval(nextSlide, 20000); // 30 segundos
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

//Carossel delize
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