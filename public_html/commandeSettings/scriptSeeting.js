import { getUser, isLoggedIn, loadUser } from "../backend/storage.js";
import { updateUser } from "../backend/userEndpoints.js";

document.addEventListener("DOMContentLoaded", async function () {
  await loadUser();
  if (!isLoggedIn()) {
    window.location.href = "/auth";
    sessionStorage.setItem("redirect", "/commandeSettings");
    alert("Veuillez vous connecter pour continuer.");
    return;
  }
  const user = getUser();
  if (!user) return;
  if (user.image)
    document.getElementById(
      "profile-image"
    ).src = `data:image/png;base64,${user.image}`;
  document.getElementById("nom").value = user.nom || "";
  document.getElementById("prenom").value = user.prenom || "";
  document.getElementById("phone-number").value = user.phone || "";
});

document
  .getElementById("profile-upload")
  .addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        document.getElementById("profile-image").src = event.target.result;

        const res = await updateUser({ image: event.target.result });

        if (res.status != 200) {
          alert("Erreur lors de la mise à jour de l'image");
          return;
        }

        const successMsg = document.getElementById("profile-success");
        successMsg.style.display = "block";
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  });

document
  .getElementById("profile-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;

    const res = await updateUser({ nom, prenom });
    if (res.status === 200) {
      const user = JSON.parse(sessionStorage.getItem("user")) || {};
      user.nom = nom;
      upload;
      user.prenom = prenom;
      sessionStorage.setItem("user", JSON.stringify(user));

      const successMsg = document.getElementById("profile-success");
      successMsg.style.display = "block";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);
    } else {
      alert("Erreur lors de la mise à jour du profil");
    }
  });

// Gestion du changement de mot de passe
document
  .getElementById("password-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("current-password").value;
    /**
     * @type {string}
     */
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validation simple
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas!");
      return;
    }

    if (newPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (newPassword === currentPassword) {
      alert("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      alert("Le mot de passe doit contenir au moins une majuscule");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      alert("Le mot de passe doit contenir au moins une miniscule");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      alert("Le mot de passe doit contenir au moins une chiffre");
      return;
    }

    if (!/[A-Z]/.test(currentPassword)) {
      alert("Le mot de passe actuel doit contenir au moins une majuscule");
      return;
    }

    if (!/[a-z]/.test(currentPassword)) {
      alert("Le mot de passe actual doit contenir au moins une miniscule");
      return;
    }

    if (!/[0-9]/.test(currentPassword)) {
      alert("Le mot de passe actuel doit contenir au moins une chiffre");
      return;
    }

    const res = await updateUser({ oldPassword: currentPassword, newPassword });

    if (res.status === 401) {
      alert("Mot de passe actuel incorrect");
      return;
    }

    if (res.status !== 200) {
      alert("Erreur lors de la mise à jour du mot de passe");
      return;
    }

    // Afficher le message de succès
    document.getElementById("password-success").style.display = "block";
    setTimeout(() => {
      document.getElementById("password-success").style.display = "none";
    }, 3000);

    // Réinitialiser le formulaire
    this.reset();
  });

// Gestion du changement de numéro de téléphone
document
  .getElementById("phone-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const phoneNumber = document.getElementById("phone-number").value;

    // Validation simple
    if (!phoneNumber.match(/^\+?[\d\s-]{10,}$/)) {
      alert("Veuillez entrer un numéro de téléphone valide");
      return;
    }

    // Ici, vous ajouteriez le code pour envoyer les données au serveur
    const res = await updateUser({
      phone: phoneNumber,
    });

    if (res.status !== 200) {
      alert("Erreur lors de la mise à jour du numéro de téléphone");
      return;
    }
    // Afficher le message de succès
    document.getElementById("phone-success").style.display = "block";
    setTimeout(() => {
      document.getElementById("phone-success").style.display = "none";
    }, 3000);

    // Réinitialiser le formulaire
    this.reset();
  });
