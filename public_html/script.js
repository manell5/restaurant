// Complete updated script.js - replace your existing file with this
import { isLoggedIn, loadUser } from "./backend/storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadUser();
  const body = document.body;
  const scrollSections = document.querySelectorAll(".scroll-section");
  const imageContainer = document.querySelector(".image-container");
  const reserveLink = document.getElementById("openReservationModal");
  const modal = document.getElementById("reservationModal");
  const closeModal = document.getElementsByClassName("close")[0];

  const checkScroll = () => {
    const imageContainerBottom = imageContainer.getBoundingClientRect().bottom;
    // Vérifier si l'utilisateur a scrollé au-delà de l'image
    if (window.scrollY > imageContainerBottom) {
      body.classList.add("white-background");
    } else {
      body.classList.remove("white-background");
    }
    // Animation des sections
    scrollSections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      // Si la section est dans la vue (80% de la hauteur de la fenêtre)
      if (sectionTop < windowHeight * 0.8) {
        section.classList.add("active");
      }
    });
  };

  // Ouvrir la fenêtre modale lorsque le lien "Réserver" est cliqué
  if (reserveLink) {
    reserveLink.onclick = function (event) {
      event.preventDefault(); // Empêche le comportement par défaut du lien
      if (!isLoggedIn()) {
        window.location.href = "/auth";
        sessionStorage.setItem("redirect", "/");
        alert("Veuillez vous connecter pour réserver.");
        return;
      }
      modal.style.display = "block"; // Ouvre la fenêtre modale
      setTimeout(() => {
        modal.querySelector(".modal-content").classList.add("show"); // Ajoute la classe pour l'animation
      }, 10); // Petit délai pour permettre l'ajout de la classe
    };
  }

  // Fermer la fenêtre modale
  if (closeModal) {
    closeModal.onclick = function () {
      modal.querySelector(".modal-content").classList.remove("show"); // Retire la classe pour l'animation
      setTimeout(() => {
        modal.style.display = "none"; // Cache la fenêtre après l'animation
      }, 300); // Délai pour laisser le temps à l'animation de se terminer
    };
  }

  // Fermer la fenêtre modale si l'utilisateur clique en dehors de la fenêtre
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.querySelector(".modal-content").classList.remove("show"); // Retire la classe pour l'animation
      setTimeout(() => {
        modal.style.display = "none"; // Cache la fenêtre après l'animation
      }, 300); // Délai pour laisser le temps à l'animation de se terminer
    }
  };

  // Handle reservation form submission
  const reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {
    reservationForm.onsubmit = function (event) {
      event.preventDefault();
      alert("Réservation envoyée !");
      modal.style.display = "none";
    };
  }

  window.addEventListener("scroll", checkScroll);
  checkScroll();

  // Enhanced Mobile Navigation Toggle Functionality
  const toggle = document.getElementById("menuToggle");
  const container = document.querySelector(".nav-container");

  if (toggle && container) {
    toggle.addEventListener("click", function () {
      container.classList.toggle("active");
    });
  }
});
