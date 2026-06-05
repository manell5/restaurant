import { getRecommendations } from "../backend/menuEndpoints.js";
import {
  deleteOrder,
  getOrders,
  subtractOrderQuantity,
  updateOrder,
} from "../backend/orderEndpoints.js";
import {
  getUpdatedMenu,
  getUser,
  isLoggedIn,
  loadUser,
  removeUser,
} from "../backend/storage.js";

const mobile = document.querySelector(".menu-toggle");
const mobileLink = document.querySelector(".sidebar");

mobile.addEventListener("click", function () {
  mobile.classList.toggle("is-active");
  mobileLink.classList.toggle("active");
});

mobileLink.addEventListener("click", function () {
  const menuBars = document.querySelector(".is-active");
  if (window.innerWidth <= 768 && menuBars) {
    mobile.classList.toggle("is-active");
    mobileLink.classList.toggle("active");
  }
});

let originalMenu = [];
let allMenuItems = [];
const articlesPerPage = 12;
let currentPage = 1;
let currentCartData = new Map(); // Store current cart state

var step = 100;
var stepFilter = 60;

$(".back").bind("click", function (e) {
  e.preventDefault();
  $(".highlight-wrapper").animate({
    scrollLeft: "-=" + step + "px",
  });
});

$(".next").bind("click", function (e) {
  e.preventDefault();
  $(".highlight-wrapper").animate({
    scrollLeft: "+=" + step + "px",
  });
});

document.getElementById("pending").addEventListener("click", () => {
  alert("fonction bientot disponible");
});

// Real-time cart update function
async function updateCartDisplay() {
  try {
    const orders = await getOrders();
    const cartItems = document
      .getElementById("cart-items")
      .getElementsByTagName("tbody")[0];

    let total = 0;
    let count = 0;

    // Clear existing rows
    cartItems.innerHTML = "";
    currentCartData.clear();

    // Add new rows with fresh data
    for (const order of orders.data) {
      currentCartData.set(order.product_id, order);

      const newRow = cartItems.insertRow();
      newRow.setAttribute("data-product-id", order.product_id);
      newRow.innerHTML = `
        <td>${order.nom}</td>
        <td class='item-count'>${order.quantity}</td>
        <td class='item-price'>${order.prix}</td>
        <td class='item-total'>${(order.prix * order.quantity).toFixed(2)}</td>
        <td class='item-add'><button class='add-pan' data-order=${
          order.id
        } data-id='${order.product_id}'>+</button></td>
        <td class='item-rem'><button class='rem-pan' data-order=${
          order.id
        } data-id='${order.product_id}'>-</button></td>
        <td class='item-sup'><button class='sup-pan' data-order=${
          order.id
        } data-id='${order.product_id}'>x</button></td>
      `;

      total += order.prix * order.quantity;
      count += order.quantity;
    }

    // Update totals
    document.getElementById("cart-total").textContent = total.toFixed(2);
    document.getElementById("cart-count").textContent = count;

    // Attach event listeners to new buttons
    attachCartEventListeners();
  } catch (error) {
    console.error("Error updating cart display:", error);
  }
}

// Attach event listeners to cart buttons
function attachCartEventListeners() {
  // Remove existing listeners to prevent duplicates
  document.querySelectorAll(".add-pan, .rem-pan, .sup-pan").forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });

  // Add button event listeners
  document.querySelectorAll(".add-pan").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      await handleCartAdd(id);
    });
  });

  // Remove button event listeners
  document.querySelectorAll(".rem-pan").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-order");
      await handleCartRemove(id);
    });
  });

  // Delete button event listeners
  document.querySelectorAll(".sup-pan").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-order");
      await handleCartDelete(id);
    });
  });
}

// Handle cart add operation
async function handleCartAdd(id) {
  try {
    await updateOrder(id);
    await updateCartDisplay();
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Erreur lors de l'ajout au panier");
  }
}

// Handle cart remove operation
async function handleCartRemove(id) {
  try {
    await subtractOrderQuantity(id, 1);
    await updateCartDisplay();
  } catch (error) {
    console.error("Error removing from cart:", error);
    alert("Erreur lors de la suppression du panier");
  }
}

// Handle cart delete operation
async function handleCartDelete(id) {
  try {
    await deleteOrder(id);
    await updateCartDisplay();
  } catch (error) {
    console.error("Error deleting from cart:", error);
    alert("Erreur lors de la suppression du panier");
  }
}

// Legacy loadCart function - now just calls updateCartDisplay
async function loadCart() {
  await updateCartDisplay();
}

document.getElementById("cart-close").addEventListener("click", function () {
  const cartPopup = document.getElementById("cart-popup");
  cartPopup.classList.remove("active");
});

document.addEventListener("scroll", function () {
  const cartPopup = document.getElementById("cart-popup");
  if (cartPopup.classList.contains("active")) {
    cartPopup.classList.remove("active");
  }
});

document.getElementById("cart").addEventListener("click", function (e) {
  e.preventDefault();
  toggleCartPopup();
});

// Improved addToCart function with real-time updates
async function addToCart(id) {
  try {
    console.log("Adding to cart:", id);
    await updateOrder(id);

    // Update cart display immediately
    await updateCartDisplay();

    // Show success message
    showTemporaryMessage("Produit ajouté au panier!");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Erreur lors de l'ajout au panier");
  }
}

// Show temporary success message
function showTemporaryMessage(message) {
  // Remove existing message if any
  const existingMessage = document.querySelector(".temp-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = "temp-message";
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 10000;
    animation: fadeInOut 2s ease-in-out;
  `;

  // Add CSS animation if not already present
  if (!document.querySelector("#temp-message-style")) {
    const style = document.createElement("style");
    style.id = "temp-message-style";
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(messageDiv);

  // Remove message after animation
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 2000);
}

function updateCartCountAndTotal() {
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const cartItems = document.querySelectorAll("#cart-items tbody tr");

  let totalCount = 0;
  let total = 0;

  cartItems.forEach((item) => {
    const itemCount = parseInt(item.querySelector(".item-count").textContent);
    const itemTotal = parseFloat(item.querySelector(".item-total").textContent);

    totalCount += itemCount;
    total += itemTotal;
  });

  cartCount.textContent = totalCount;
  cartTotal.textContent = total.toFixed(2);
}

// Enhanced add to cart button handler with real-time updates
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const id = e.target.dataset.id;
    await addToCart(id);
  }
});

function renderMenuPage(page) {
  const wrapper = document.getElementById("detail-wrapper");
  wrapper.innerHTML = "";

  const start = (page - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  const itemsToShow = allMenuItems
    .sort((a, b) => b.categorie.localeCompare(a.categorie))
    .slice(start, end);

  itemsToShow.forEach((item) => {
    const card = document.createElement("div");
    card.className = "detail-card";

    card.setAttribute("data-category", item.categorie);
    card.setAttribute("data-active", "true");

    const img = document.createElement("img");
    img.className = "detail-img";
    img.src = item.image;
    img.alt = item.nom;

    const detailDesc = document.createElement("div");
    detailDesc.className = "detail-desc";

    const detailName = document.createElement("div");
    detailName.className = "detail-name";

    const title = document.createElement("h3");
    title.textContent = item.nom;

    const description = document.createElement("p");
    description.className = "detail-sub";
    description.innerHTML = item.description.replace(/\\n/g, "<br>");

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `${item.prix} €`;

    const button = document.createElement("button");
    button.className = "add-to-cart-btn";
    button.setAttribute("data-id", item.id);
    button.textContent = "Ajouter au panier";

    const icon = document.createElement("ion-icon");
    icon.className = "detail-favorites";
    icon.setAttribute("name", "bookmark-outline");

    detailName.appendChild(title);
    detailName.appendChild(description);
    detailName.appendChild(price);
    detailName.appendChild(button);

    detailDesc.appendChild(detailName);
    detailDesc.appendChild(icon);

    card.appendChild(img);
    card.appendChild(detailDesc);

    wrapper.appendChild(card);
  });

  renderPagination(page);
}

function renderPagination(page) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;
  const pageCount = Math.ceil(allMenuItems.length / articlesPerPage);
  let html = "";

  for (let i = 1; i <= pageCount; i++) {
    html += `<button class="page-btn${
      i === page ? " active" : ""
    }" data-page="${i}">${i}</button>`;
  }
  pagination.innerHTML = html;

  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.onclick = function () {
      currentPage = Number(this.dataset.page);
      renderMenuPage(currentPage);

      const mainDetail = document.querySelector(".promotions");
      if (mainDetail) {
        mainDetail.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
  });
}

document
  .getElementById("search-btn")
  .addEventListener("click", async function () {
    const input = document.getElementById("search-query").value;
    const wrapper = document.getElementById("detail-wrapper");

    wrapper.innerHTML = "";

    if (!input.length) {
      loadMenu();
      return;
    }

    const res = originalMenu.filter((e) =>
      e.nom.toLowerCase().includes(input.toLowerCase())
    );

    if (!res.length) {
      const error = document.createElement("p");
      error.className = "error";
      error.textContent = "Aucun plat trouvé";
      wrapper.appendChild(error);
      document.getElementById("pagination").innerHTML = "";
      return;
    }

    allMenuItems = res;
    currentPage = 1;
    renderMenuPage(currentPage);
  });

async function loadMenu() {
  const wrapper = document.getElementById("detail-wrapper");

  if (!originalMenu.length) {
    wrapper.innerHTML = ``;
    const error = document.createElement("p");
    error.className = "error";
    error.textContent = "Aucun plat trouvé";
    wrapper.appendChild(error);
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  allMenuItems = originalMenu;
  currentPage = 1;
  renderMenuPage(currentPage);
}

async function loadRecommendations() {
  const wrapper = document.getElementById("highlight-wrapper");
  const recommendations = await getRecommendations();

  wrapper.innerHTML = "";

  if (!recommendations.data.length) {
    const error = document.createElement("p");
    error.className = "error";
    error.textContent = "Aucune recommandation trouvée";
    wrapper.appendChild(error);
    return;
  }

  recommendations.data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "highlight-card";

    const img = document.createElement("img");
    img.className = "highlight-img";
    img.src = item.image;
    img.alt = item.nom;

    const desc = document.createElement("div");
    desc.className = "highlight-desc";

    const title = document.createElement("h4");
    title.textContent = item.nom;

    const price = document.createElement("p");
    price.textContent = `${item.prix} €`;

    desc.appendChild(title);
    desc.appendChild(price);

    card.appendChild(img);
    card.appendChild(desc);

    wrapper.appendChild(card);
  });
}

[...document.getElementsByClassName("filter-card")].forEach((card) => {
  card.addEventListener("click", function () {
    const allMenu = card.getAttribute("data-category") === "all";

    if (allMenu) {
      if (card.getAttribute("data-active") === "true") return;

      const activeCards = document.querySelectorAll(
        ".filter-card[data-active]"
      );
      activeCards.forEach((activeCard) => {
        activeCard.removeAttribute("data-active");
      });
      card.setAttribute("data-active", "true");
      allMenuItems = originalMenu;
      currentPage = 1;
      renderMenuPage(currentPage);
      return;
    }

    const allMenusButton = document.querySelector(
      ".filter-card[data-category='all']"
    );

    if (card.getAttribute("data-active") === "true") {
      card.removeAttribute("data-active");
      const allActiveCards = document.querySelectorAll(
        ".filter-card[data-active='true']"
      );
      if (allActiveCards.length === 0) {
        const allCards = document.querySelectorAll(".detail-card");
        allCards.forEach((item) => {
          item.style.display = "block";
        });

        allMenusButton.setAttribute("data-active", "true");
        allMenuItems = originalMenu;
        currentPage = 1;
      } else {
        document.querySelectorAll(".detail-card").forEach((item) => {
          if (
            card.getAttribute("data-category") ===
            item.getAttribute("data-category")
          )
            item.style.display = "none";
        });
        allMenuItems = allMenuItems.filter(
          (e) => e.categorie != card.getAttribute("data-category")
        );
        currentPage = 1;
      }
      renderMenuPage(currentPage);
      return;
    }
    card.setAttribute("data-active", "true");

    const allActiveCards = document.querySelectorAll(
      ".filter-card[data-active='true']"
    );

    if (
      allActiveCards.length ===
      document.querySelectorAll(".filter-card").length - 1
    ) {
      allActiveCards.forEach((activeCard) => {
        activeCard.removeAttribute("data-active");
      });

      allMenusButton.setAttribute("data-active", "true");

      allMenuItems = originalMenu;
      currentPage = 1;
      renderMenuPage(currentPage);
      return;
    }

    allMenusButton.removeAttribute("data-active");

    const activeCategories = [
      ...document.querySelectorAll(".filter-card[data-active='true']"),
    ].map((e) => e.getAttribute("data-category"));
    allMenuItems = originalMenu.filter((item) =>
      activeCategories.includes(item.categorie)
    );
    currentPage = 1;
    renderMenuPage(currentPage);
  });
});

document.getElementById("deconnexion").addEventListener("click", function () {
  removeUser();
  window.location.href = "/";
});

document.addEventListener("DOMContentLoaded", async function () {
  await loadUser();
  if (!isLoggedIn()) {
    window.location.href = "/auth";
    sessionStorage.setItem("redirect", "/commande");
    alert("Veuillez vous connecter pour continuer.");
    return;
  }
  originalMenu = await getUpdatedMenu();

  const user = getUser();

  const username = user ? user.nom + " " + user.prenom : "";
  const email = user.email || "";
  if (username)
    document.getElementById("popup-username").textContent = username;
  if (email) document.getElementById("popup-email").textContent = email;

  const userIcon = document.getElementById("user");
  const userPopup = document.getElementById("user-popup");

  userIcon.addEventListener("mouseenter", () => {
    console.log("Mouse entered user icon");
    userPopup.style.display = "block";
    const rect = userPopup.getBoundingClientRect();
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    if (rect.right > vw) {
      userPopup.style.left = "auto";
      userPopup.style.right = "0";
      userPopup.style.transform = "none";
    } else if (rect.left < 0) {
      userPopup.style.left = "0";
      userPopup.style.right = "auto";
      userPopup.style.transform = "none";
    } else {
      userPopup.style.left = "50%";
      userPopup.style.right = "auto";
      userPopup.style.transform = "translateX(-50%)";
    }
  });
  userIcon.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!userPopup.matches(":hover")) userPopup.style.display = "none";
    }, 100);
  });
  userPopup.addEventListener("mouseleave", () => {
    userPopup.style.display = "none";
  });
  userPopup.addEventListener("mouseenter", () => {
    userPopup.style.display = "block";
  });

  loadMenu();
  loadRecommendations();
  await updateCartDisplay(); // Use the new function
});

function toggleCartPopup() {
  const cartPopup = document.getElementById("cart-popup");
  cartPopup.classList.toggle("active");

  // Refresh cart when opening
  if (cartPopup.classList.contains("active")) {
    updateCartDisplay();
  }
}

function closeCart() {
  const cartPopup = document.getElementById("cart-popup");
  cartPopup.classList.remove("active");
}

function getInvoices() {
  return JSON.parse(localStorage.getItem("invoices")) || [];
}

function saveInvoice(invoice) {
  const invoices = getInvoices();
  invoices.push(invoice);
  localStorage.setItem("invoices", JSON.stringify(invoices));
}

async function validateCart() {
  const cartItems = document.querySelectorAll("#cart-items tbody tr");
  if (cartItems.length === 0) {
    alert("Votre panier est vide");
    return;
  }

  const invoice = {
    date: new Date().toLocaleString(),
    items: Array.from(cartItems).map((item) => ({
      name: item.cells[0].textContent,
      quantity: parseInt(item.cells[1].textContent),
      price: parseFloat(item.cells[2].textContent),
      total: parseFloat(item.cells[3].textContent),
    })),
    total: parseFloat(document.getElementById("cart-total").textContent),
  };

  saveInvoice(invoice);
  alert("Commande validée avec succès!");

  // Clear cart by deleting all orders
  const productIds = Array.from(currentCartData.keys());
  for (const productId of productIds) {
    await deleteOrder(productId);
  }

  // Update display
  await updateCartDisplay();
  closeCart();
}

function toggleInvoicePopup() {
  const invoicePopup = document.getElementById("invoice-popup");
  invoicePopup.style.display =
    invoicePopup.style.display === "none" ? "block" : "none";
  if (invoicePopup.style.display === "block") {
    showInvoices();
  }
}

function closeInvoice() {
  const invoicePopup = document.getElementById("invoice-popup");
  invoicePopup.style.display = "none";
}

function showInvoices() {
  const invoiceItems = document
    .getElementById("invoice-items")
    .getElementsByTagName("tbody")[0];
  invoiceItems.innerHTML = "";

  const invoices = getInvoices();
  invoices.forEach((invoice) => {
    const row = invoiceItems.insertRow();
    // Implementation for invoice display can be added here
  });
}

// Set up periodic cart refresh (optional - for extra real-time feel)
setInterval(async () => {
  const cartPopup = document.getElementById("cart-popup");
  if (cartPopup && cartPopup.classList.contains("active")) {
    await updateCartDisplay();
  }
}, 5000); // Refresh every 5 seconds when cart is open

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".filter-wrapper");
  const next = document.querySelector(".next-menus");
  const back = document.querySelector(".back-menus");

  if (wrapper && next && back) {
    wrapper.style.scrollBehavior = "smooth";

    let isAnimating = false;

    next.addEventListener("click", (e) => {
      e.preventDefault();
      if (!isAnimating) {
        isAnimating = true;
        wrapper.scrollBy({ left: 200, behavior: "smooth" });
        setTimeout(() => {
          isAnimating = false;
        }, 300);
      }
    });

    back.addEventListener("click", (e) => {
      e.preventDefault();
      if (!isAnimating) {
        isAnimating = true;
        wrapper.scrollBy({ left: -200, behavior: "smooth" });
        setTimeout(() => {
          isAnimating = false;
        }, 300);
      }
    });
  }
});

// Make validateCart globally accessible
window.validateCart = validateCart;
