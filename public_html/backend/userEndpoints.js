import { config } from "./config.js";
import { getToken, storeUser } from "./storage.js";

export async function updateUser(userData) {
  const res = await fetch(`${config.backend}/users/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return await res.json();
}

export async function userProfile() {
  const res = await fetch(`${config.backend}/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 401) {
    return { status: 401, message: "Token incorrecte" };
  }

  if (res.status !== 200) {
    console.error(res);
    return {
      status: res.status,
      message: "Erreur lors de la récupération du profil",
    };
  }

  return await res.json();
}

export async function signupUser(obj) {
  const res = await fetch(`${config.backend}/users/register`, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${config.backend}/users/login`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  if (json.status === 200) await storeUser(json.data.token);

  return json;
}
