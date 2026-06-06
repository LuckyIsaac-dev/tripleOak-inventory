import { db, auth } from "./firebase.js";
import { Water } from "./water.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// ── DOM selectors ──
const editQtyInput = document.querySelector(".edit-stock-input");
const updateQtyInput = document.querySelector(".update-qty");
const editStockBtn = document.querySelector(".btn-save");
const editModal = document.querySelector("dialog");
const updateModal = document.querySelector(".update-modal");
const modalProductName = document.getElementById("qty-modal-product-name");
const closeModalBtn = document.querySelector(".modal-close");
const closeEditBtn = document.querySelector(".edit-close");
const updateModalName = document.getElementById("modal-product-name");
const productGrid = document.querySelector(".products-grid");
const updateStockBtn = document.querySelector(".btn-update-stock");
const cancelUpdateBtn = document.querySelector(".btn-cancel-update");
const cancelEditBtn = document.querySelector(".btn-cancel-edit");
document.querySelector(".btn-primary").addEventListener("click", handleLogin);
document.querySelector(".guest-btn").addEventListener("click", guestAccount);
document.querySelector(".btn-logout").addEventListener("click", handleLogout);
const criticalAlert = document.querySelector(".critical");
const warnAlert = document.querySelector(".warn");
const searchInput = document.querySelector(".search-input");

const waters = [
  {
    image: "",
    brand: "Eva",
    name: "Eva 75cl",
    price: 3500,
    quantity: 10,
    type: "bottle water",
    id: "1",
  },
  {
    image: "",
    brand: "Eva",
    name: "Eva 150cl",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "2",
  },
  {
    image: "",
    brand: "CWAY",
    name: "Cway 600ml",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "3",
  },
  {
    image: "",
    brand: "CWAY",
    name: "Cway 750ml",
    price: 3600,
    quantity: 120,
    type: "bottle water",
    id: "4",
  },
  {
    image: "",
    brand: "CWAY",
    name: "Cway 1500ml",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "5",
  },
  {
    image: "",
    brand: "AQUAFINA",
    name: "Aquafina 75cl",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "6",
  },
  {
    image: "",
    brand: "LASIEN",
    name: "Lasien 50cl",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "7",
  },
  {
    image: "",
    brand: "LASIEN",
    name: "Lasien 75cl",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "8",
  },
  {
    image: "",
    brand: "LASIEN",
    name: "Lasien 150cl",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "9",
  },
  {
    image: "",
    brand: "NESTLE",
    name: "Nestle Blue 60cl",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "10",
  },
  {
    image: "",
    brand: "NESTLE",
    name: "Nestle Green 60cl",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "11",
  },
  {
    image: "",
    brand: "NESTLE",
    name: "Nestle 150cl",
    price: 3600,
    quantity: 0,
    type: "bottle water",
    id: "12",
  },
  {
    image: "",
    brand: "CWAY",
    name: "Cway Refill",
    price: 3600,
    quantity: 50,
    type: "refill",
    id: "13",
  },
  {
    image: "",
    brand: "BIMO",
    name: "Bimo Refill",
    price: 3600,
    quantity: 20,
    type: "refill",
    id: "14",
  },
  {
    image: "",
    brand: "JASMINE",
    name: "Jasmine 75cl",
    price: 3600,
    quantity: 60,
    type: "bottle water",
    id: "15",
  },
  {
    image: "",
    brand: "BRACO",
    name: "Braco 100cl",
    price: 3600,
    quantity: 100,
    type: "bottle water",
    id: "16",
  },
];

let products = [];

async function handleLogin() {
  const email = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("iam in");
  } catch (error) {
    document.querySelector(".login-error").style.display = "flex";
  }
}

async function handleLogout() {
  await signOut(auth);
  document.querySelector(".main-wrap").style.display = "none";
  document.querySelector(".topbar").style.display = "none";
  document.getElementById("login-page").style.display = "flex";
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.querySelector(".main-wrap").style.display = "flex";
    document.getElementById("login-page").style.display = "none";
    document.querySelector(".topbar").style.display = "flex";
    await loadProducts(false);
    renderPage();
  }
});

async function guestAccount() {
  document.querySelector(".main-wrap").style.display = "flex";
  document.querySelector(".topbar").style.display = "flex";
  document.getElementById("login-page").style.display = "none";
  await loadProducts(true);
}

async function loadProducts(isGuest) {
  const snapshot = await getDocs(collection(db, "product"));

  if (snapshot.empty) {
    products = waters.map((w) => new Water(w));
    alertPill();

    generateHTML(isGuest);
    renderSearchResult(isGuest);
    await saveToStorage();
  } else {
    products = snapshot.docs.map((d) => new Water(d.data()));
    alertPill();
    generateHTML(isGuest);
    renderSearchResult(isGuest);
  }
}

async function saveToStorage() {
  try {
    const { writeBatch, doc } = await import("firebase/firestore");
    const batch = writeBatch(db);

    products.forEach((product) => {
      const ref = doc(db, "product", product.id);
      batch.set(ref, {
        image: product.image,
        brand: product.brand,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        type: product.type,
        id: product.id,
      });
    });

    await batch.commit();
  } catch (error) {
    console.error("❌ batch failed:", error);
  }
}

function getStockStatus(quantity) {
  if (quantity === 0) return { label: "Out of Stock", class: "out-of-stock" };
  if (quantity <= 10) return { label: "Low Stock", class: "low-stock" };
  return { label: "In Stock", class: "in-stock" };
}
function alertPill() {
  let brandName = [];
  let outOfStock = 0;
  let lowStock = 0;
  let inStock = 0;
  let totalQuantity = 0;

  let stockValue = 0;

  products.forEach((product) => {
    //

    if (!brandName.includes(product.brand)) {
      brandName.push(product.brand);
    }
    totalQuantity += product.quantity;
    stockValue += product.price * product.quantity;

    if (product.quantity === 0) {
      outOfStock++;
    } else if (product.quantity <= 10) {
      lowStock++;
    } else {
      inStock++;
    }
  });

  document.querySelector(".total-product").innerHTML = brandName.length;
  document.querySelector(".total-quantity").innerHTML = totalQuantity;
  document.querySelector(".in-stock").innerHTML = inStock;
  document.querySelector(".stock-value").innerHTML =
    `${formatValue(stockValue)}`;
  document.querySelector(".low-stock").innerHTML = lowStock;
  document.querySelector(".out-of-stock").innerHTML = outOfStock;

  if (lowStock === 0) {
    return;
  } else {
    warnAlert.style.display = "flex";
    warnAlert.innerHTML = `<i class="fa-solid fa-clock"></i> ${lowStock}  products reach threshold by end of week`;
  }

  if (outOfStock === 0) {
    return;
  } else {
    criticalAlert.style.display = "flex";
    criticalAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${outOfStock}  products critically low — restock urgently`;
  }
}

function renderSearchResult(isGuest = false) {
  let searchResult = [];

  searchInput.addEventListener("input", (e) => {
    let userInput = searchInput.value.toLowerCase().trim();
    searchResult = products.filter((product) => {
      let productBrand = product.brand.toLowerCase();
      return productBrand.includes(userInput);
    });
    if (searchResult.length === 0) {
    }
    console.log(userInput);
    console.log(searchResult);

    let productHTML = "";
    searchResult.forEach((bottleWater) => {
      const stock = getStockStatus(bottleWater.quantity);
      const quantity = quantityWarning(bottleWater.quantity);
      productHTML += `
      <div class="product-card" style="animation-delay: 0s">
        <div class="card-image-wrap">
          <img
            src="${bottleWater.image}"
            alt="${bottleWater.name}"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
            style="display: none"
          />
          <div class="placeholder-img" style="display: flex">💧</div>
          <span class="stock-badge ${stock.class}">${stock.label}</span>
        </div>
        <div class="card-body">
          <div class="card-brand">${bottleWater.brand}</div>
          <div class="card-name">${bottleWater.name}</div>
          <div class="card-stats">
            <div class="card-stat">
              <div class="stat-label">Quantity</div>
              <div class="stat-value ${quantity}">${bottleWater.quantity}</div>
            </div>
            <div class="card-stat">
              <div class="stat-label">Price / Pack</div>
              <div class="stat-value">₦${bottleWater.price.toLocaleString()}</div>
            </div>
          </div>
          <div class="card-actions">
            ${
              isGuest
                ? `<p class="guest-account"> View only</p>`
                : `
              <button class="btn-card btn-edit" data-product-id="${bottleWater.id}">Edit</button>
              <button class="btn-card btn-update" data-product-id="${bottleWater.id}">Restock</button>
            `
            }
          </div>
        </div>
      </div>`;
    });
    document.querySelector(".products-grid").innerHTML = productHTML;
    // console.log(productHTML);
  });
}

function quantityWarning(quantity) {
  if (quantity === 0) return "empty";

  if (quantity <= 10) return "low";
  return "";
}

function getProduct(productId) {
  return products.find((p) => p.id === productId);
}

function closeModal() {
  updateModal.close();
  updateQtyInput.value = "";
}

function closeEditModal() {
  editModal.close();
  editQtyInput.value = "";
}

// ── Render ──
function generateHTML(isGuest = false) {
  let productHTML = "";
  products.forEach((bottleWater) => {
    const stock = getStockStatus(bottleWater.quantity);
    const quantity = quantityWarning(bottleWater.quantity);
    productHTML += `
      <div class="product-card" style="animation-delay: 0s">
        <div class="card-image-wrap">
          <img
            src="${bottleWater.image}"
            alt="${bottleWater.name}"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
            style="display: none"
          />
          <div class="placeholder-img" style="display: flex">💧</div>
          <span class="stock-badge ${stock.class}">${stock.label}</span>
        </div>
        <div class="card-body">
          <div class="card-brand">${bottleWater.brand}</div>
          <div class="card-name">${bottleWater.name}</div>
          <div class="card-stats">
            <div class="card-stat">
              <div class="stat-label">Quantity</div>
              <div class="stat-value ${quantity}">${bottleWater.quantity}</div>
            </div>
            <div class="card-stat">
              <div class="stat-label">Price / Pack</div>
              <div class="stat-value">₦${bottleWater.price.toLocaleString()}</div>
            </div>
          </div>
          <div class="card-actions">
            ${
              isGuest
                ? `<p class="guest-account"> View only</p>`
                : `
              <button class="btn-card btn-edit" data-product-id="${bottleWater.id}">Edit</button>
              <button class="btn-card btn-update" data-product-id="${bottleWater.id}">Restock</button>
            `
            }
          </div>
        </div>
      </div>`;
  });
  document.querySelector(".products-grid").innerHTML = productHTML;
}

cancelUpdateBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
cancelEditBtn.addEventListener("click", closeEditModal);
closeEditBtn.addEventListener("click", closeEditModal);

function renderPage() {
  productGrid.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-edit");
    const updateBtn = e.target.closest(".btn-update");

    if (editBtn) {
      const productId = editBtn.dataset.productId;
      const product = getProduct(productId);
      modalProductName.innerHTML = product.name;
      editModal.showModal();
      editStock(productId);
    }

    if (updateBtn) {
      const productId = updateBtn.dataset.productId;
      const product = getProduct(productId);
      updateModalName.innerHTML = product.name;
      updateModal.showModal();
      updateStock(productId);
    }
  });
}

function editStock(productId) {
  editStockBtn.addEventListener(
    "click",
    () => {
      const value = Number(editQtyInput.value);
      const product = getProduct(productId);
      let refill = product.editQuantity(value, productId);

      if (refill) {
        products.forEach((product) => {
          if (product.type === "cway-empties") {
            console.log(product);
            product.quantity += value;
          }
        });
      }

      editModal.close();
      alertPill();
      editQtyInput.value = "";
      generateHTML();
      saveToStorage();
    },
    { once: true },
  );
}

function updateStock(productId) {
  updateStockBtn.addEventListener(
    "click",
    () => {
      const newQuantity = Number(updateQtyInput.value);
      const product = getProduct(productId);
      let refillEmpty = product.updateQuantity(newQuantity, productId);

      if (refillEmpty) {
        products.forEach((product) => {
          if (product.type === "cway-empties") {
            console.log(product);
            product.quantity -= newQuantity;
          }
        });
      }
      updateModal.close();
      console.log();
      alertPill();
      generateHTML();
      updateQtyInput.value = "";
      saveToStorage();
    },
    { once: true },
  );
}

function formatValue(value) {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(1)}K`;
  } else {
    return `₦${value.toLocaleString()}`;
  }
}
