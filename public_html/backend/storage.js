import { getMenu, getMenuCount, getMenuNames } from "./menuEndpoints.js";
import { storeMenuInDB, getMenuFromDB } from "./indexedDBStorage.js";
import { userProfile } from "./userEndpoints.js";

export async function storeUser(token) {
  localStorage.setItem("token", token);
  await loadUser();
}

export async function getUpdatedMenu() {
  try {
    const menuNames = (await getMenuNames()).data;
    const storedMenu = await getMenuFromDB();
    if (
      !storedMenu.length ||
      storedMenu.length != (await getMenuCount()).data ||
      storedMenu.some((item) => !menuNames.some(e => e.nom == item.nom))
    ) {
      
      console.log("Menu is outdated or incomplete, fetching from API...");
      const newMenu = await getMenu();
      await storeMenuInDB(newMenu.data);
      return newMenu.data;
    }

    return storedMenu;
  } catch (error) {
    console.error("Failed to update menu:", error);
    // Fallback to API call if storage fails
    const newMenu = await getMenu();
    return newMenu.data;
  }
}

export async function loadUser() {
  if (!isLoggedIn()) return;
  const res = await userProfile(getToken());
  if (res.status === 401) {
    removeUser();
    return;
  }
  if (res.status !== 200) {
    console.error(res);
    return;
  }
  const { password, ...user } = res.data;
  sessionStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  const user = sessionStorage.getItem("user");
  if (user && user !== "undefined") {
    return JSON.parse(user);
  }
  return null;
}

export function getToken() {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  }
  return null;
}

export function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Get payload from JWT token
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token has expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      // Token has expired, remove it
      removeUser();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token format:", error);
    removeUser();
    return false;
  }
}

export function removeUser() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("user");
}
