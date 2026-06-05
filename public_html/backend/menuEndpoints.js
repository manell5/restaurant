import { config } from "./config.js";

export async function getMenu() {
  const res = await fetch(`${config.backend}/menu`, {
    method: `GET`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    console.error(res);
    throw new Error(`Erreur lors de la récupération du menu`);
  }
  return await res.json();
}

export async function getMenuCount() {
  const res = await fetch(`${config.backend}/menu/count`, {
    method: `GET`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    console.error(res);
    throw new Error(
      `Erreur lors de la récupération du nombre d'éléments du menu`
    );
  }
  return await res.json();
}

export async function getMenuNames() {
  const res = await fetch(`${config.backend}/menu/names`, {
    method: `GET`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    console.error(res);
    throw new Error(`Erreur lors de la récupération des noms du menu`);
  }
  return await res.json();
}

export async function getRecommendations() {
  const res = await fetch(`${config.backend}/menu/recommendations`, {
    method: `GET`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    console.error(res);
    throw new Error(`Erreur lors de la récupération des recommandations`);
  }
  return await res.json();
}

export async function searchMenu(query) {
  const res = await fetch(`${config.backend}/menu/search/` + query, {
    method: `GET`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    console.error(res);
    throw new Error(`Erreur lors de la recherche dans le menu`);
  }
  return await res.json();
}
