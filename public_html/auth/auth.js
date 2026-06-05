import { isLoggedIn, loadUser } from "../backend/storage.js";
import { loginUser } from "../backend/userEndpoints.js";

document.addEventListener("DOMContentLoaded", async function () {
  await loadUser();
  if (isLoggedIn()) {
    window.location.href = "/commande";
    return;
  }
});

document.getElementById("connecter").addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent form submission

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
    alert("Donner un propre email");
    return;
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
    alert("Donner un propre mot de passe");
    return;
  }

  try {
    const res = await loginUser(email, password);
    if (res.status === 200) {
      window.location.href = sessionStorage.getItem("redirect") ?? "/commande";
    } else if (res.status === 401) {
      alert("Email ou mot de passe incorrecte");
    } else {
      alert("Erreur de connexion. Veuillez réessayer.");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Erreur de réseau. Vérifiez votre connexion.");
  }
});
