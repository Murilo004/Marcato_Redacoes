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