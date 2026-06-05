import { isLoggedIn, loadUser } from "../backend/storage.js";
import { signupUser } from "../backend/userEndpoints.js";

document.addEventListener("DOMContentLoaded", async function () {
  await loadUser();
  if (isLoggedIn()) {
    window.location.href = "/commande";
    return;
  }
});

document.getElementById("creer-compte").addEventListener("click", async (e) => {
  await loadUser();
  e.preventDefault(); // Prevent form submission
  const obj = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    numero: document.getElementById("phone").value,
    nom: document.getElementById("nom").value,
    prenom: document.getElementById("prenom").value,
  };

  const confirmPassword = document.getElementById("confirm-password").value;

  if (confirmPassword !== obj.password) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  try {
    const res = await signupUser(obj);
    if (res.status === 200) {
      window.location.href = "/auth";
    } else if (res.status === 409) {
      alert("Un compte avec cet email existe déjà. Veuillez en utiliser un autre.");
    } else {
      alert("Erreur de création de compte. Veuillez réessayer.");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Erreur de réseau. Vérifiez votre connexion.");
  }
});
