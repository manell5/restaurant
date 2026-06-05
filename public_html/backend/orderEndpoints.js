import { config } from "./config.js";
import { getToken } from "./storage.js";

export async function updateOrder(product_id) {
  const res = await fetch("${config.backend}/orders", {
    method: "POST",
    body: JSON.stringify({
      product_id,
      quantity: 1,
    }),
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export async function getOrders() {
  const res = await fetch("${config.backend}/orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return await res.json();
}

export async function deleteOrder(order_id) {
  const res = await fetch(`${config.backend}/orders/${order_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (res.status !== 200) {
    console.error(res);
    throw new Error(
      "Erreur lors de la récupération du nombre d'éléments du menu"
    );
  }
  return await res.json();
}

export async function subtractOrderQuantity(order_id, quantity) {
  const res = await fetch(`${config.backend}/orders/${order_id}/subtract`, {
    method: "PUT",
    body: JSON.stringify({
      quantity,
    }),
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    console.error(res);
    throw new Error(
      "Erreur lors de la récupération du nombre d'éléments du menu"
    );
  }
  return await res.json();
}
