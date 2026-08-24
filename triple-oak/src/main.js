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
//NEW FEATURES TO ADD
/*
-------------------FUNTIONALITY-------------------
MAKE USER BE ABLE TO ADD NEW PRODUCT
KEEP HISTORY OF WHO UPDATED THE QUATITY LAST AND HOW MANY THEY ADDED OR REMOVED
MAKE THE INVENTORY MANAGEMENT SYSETEM SEND REPORT EVERY FRIDAY
ADD MOST REQUESTED GOODS
SHOW MOST SOLD PRODUCT AT THE END OF THE WEEK
SHOW WHEN LAST A PRODUCT WAS UPDATED WHEN EDITING OR RESTOCKING
ADD THE PLUS AND MINUS BTN ON THE EDIT MODAL
SHOW GOODS WITH THE  HIGHEST  PROFIT OR GOODS THAT MADE THE HIGHEST PROFIT IN A WEEK/Changed to filter/
SHOW A BETTER CONFIRMATION MESSAGE WHEN EDITING OR RESTOCKING PRODUCT
BE ABLE TO EDIT PRODUCT PRICE

-------------------UI DESIGN-------------------
UPDATE THE UI FOR EDITING STOCK AN RESTOCK MODAL
BETTER NAV UI 
BETTER WARNING NOTIFICATION
BETTER SUCCESSFUL MESSAGE AFTER RESTOCK OR EDIT STOCK


*/
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
const toast = document.querySelector(".toast");
const productQuantity = document.getElementById("product-quantity");
const restockQuantity = document.querySelector(".update-product-quantity");
const errorMessage = document.querySelector(".error-message");
const stockHint = document.querySelector(".restock-hint");

// const waters = [
//   {
//     image: "",
//     brand: "Eva",
//     name: "Eva 75cl",
//     price: 3500,
//     quantity: 10,
//     type: "bottle water",
//     id: "1",
//   },
//   {
//     image: "",
//     brand: "Eva",
//     name: "Eva 150cl",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "2",
//   },
//   {
//     image: "",
//     brand: "CWAY",
//     name: "Cway 600ml",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "3",
//   },
//   {
//     image: "",
//     brand: "CWAY",
//     name: "Cway 750ml",
//     price: 3600,
//     quantity: 120,
//     type: "bottle water",
//     id: "4",
//   },
//   {
//     image: "",
//     brand: "CWAY",
//     name: "Cway 1500ml",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "5",
//   },
//   {
//     image: "",
//     brand: "AQUAFINA",
//     name: "Aquafina 75cl",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "6",
//   },
//   {
//     image: "",
//     brand: "LASIEN",
//     name: "Lasien 50cl",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "7",
//   },
//   {
//     image: "",
//     brand: "LASIEN",
//     name: "Lasien 75cl",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "8",
//   },
//   {
//     image: "",
//     brand: "LASIEN",
//     name: "Lasien 150cl",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "9",
//   },
//   {
//     image: "",
//     brand: "NESTLE",
//     name: "Nestle Blue 60cl",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "10",
//   },
//   {
//     image: "",
//     brand: "NESTLE",
//     name: "Nestle Green 60cl",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "11",
//   },
//   {
//     image: "",
//     brand: "NESTLE",
//     name: "Nestle 150cl",
//     price: 3600,
//     quantity: 0,
//     type: "bottle water",
//     id: "12",
//   },
//   {
//     image: "",
//     brand: "CWAY",
//     name: "Cway Refill",
//     price: 3600,
//     quantity: 50,
//     type: "refill",
//     id: "13",
//   },
//   {
//     image: "",
//     brand: "BIMO",
//     name: "Bimo Refill",
//     price: 3600,
//     quantity: 20,
//     type: "refill",
//     id: "14",
//   },
//   {
//     image: "",
//     brand: "JASMINE",
//     name: "Jasmine 75cl",
//     price: 3600,
//     quantity: 60,
//     type: "bottle water",
//     id: "15",
//   },
//   {
//     image: "",
//     brand: "BRACO",
//     name: "Braco 100cl",
//     price: 3600,
//     quantity: 100,
//     type: "bottle water",
//     id: "16",
//   },
// ];

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
    document.querySelector(".main-wrap").style.display = "block";
    document.getElementById("login-page").style.display = "none";
    document.querySelector(".topbar").style.display = "flex";
    await loadProducts(false);
    renderPage();
  }
});

async function guestAccount() {
  document.querySelector(".main-wrap").style.display = "block";
  document.querySelector(".topbar").style.display = "flex";
  document.getElementById("login-page").style.display = "none";
  await loadProducts(true);
}

async function loadProducts(isGuest) {
  const snapshot = await getDocs(collection(db, "product"));

  if (snapshot.empty) {
    products = waters.map((w) => new Water(w));
    // alertPill();

    generateHTML(isGuest);
    renderSearchResult(isGuest);
    await saveToStorage(isGuest);
  } else {
    products = snapshot.docs.map((d) => new Water(d.data()));
    console.log(products);
    filterProduct(isGuest);
    // alertPill();
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
    console.error("batch failed:", error);
  }
}

function getStockStatus(quantity) {
  if (quantity === 0) return { label: "Out of Stock", class: "out-of-stock" };
  if (quantity <= 10) return { label: "Low Stock", class: "low-stock" };
  return { label: "In Stock", class: "in-stock" };
}
// function alertPill() {
//   let brandName = [];
//   let outOfStock = 0;
//   let lowStock = 0;
//   let inStock = 0;
//   let totalQuantity = 0;

//   let stockValue = 0;

//   products.forEach((product) => {
//     //

//     if (!brandName.includes(product.brand)) {
//       brandName.push(product.brand);
//     }
//     totalQuantity += product.quantity;
//     stockValue += product.price * product.quantity;

//     if (product.quantity === 0) {
//       outOfStock++;
//     } else if (product.quantity <= 10) {
//       lowStock++;
//     } else {
//       inStock++;
//     }
//   });

//   if (lowStock === 0) {
//     return;
//   } else {
//     warnAlert.style.display = "flex";
//     warnAlert.innerHTML = `<i class="fa-solid fa-clock"></i> ${lowStock}  products reach threshold by end of week`;
//   }

//   if (outOfStock === 0) {
//     return;
//   } else {
//     criticalAlert.style.display = "flex";
//     criticalAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${outOfStock}  products critically low — restock urgently`;
//   }
// }

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
            alt="${bottleWater.name}"/>
          
          <span class="stock-badge ${stock.class}">${stock.label}</span>
        </div>
        <div class="card-body">
            <div class="card-name"> ${bottleWater.name}</div>
        <p class="product-price">₦${bottleWater.price}</p> 
           <div class="quantity-info">
              <p class="quantity-text">
                <span class="product-quantity ${quantity}">${bottleWater.quantity}</span> packs left in store
              </p>
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
          
          />
          <span class="stock-badge ${stock.class}">${stock.label}</span>
        </div>
        <div class="card-body">
             <div class="card-name"> ${bottleWater.name}</div>
        <p class="product-price">₦${bottleWater.price}</p> 
           <div class="quantity-info">
              <p class="quantity-text">
                <span class="product-quantity ${quantity}">${bottleWater.quantity}</span> packs left in store
              </p>
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
  let currentProductId = null;
  let restockId = null;
  productGrid.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-edit");
    const updateBtn = e.target.closest(".btn-update");

    if (editBtn) {
      currentProductId = editBtn.dataset.productId;
      const product = getProduct(currentProductId);
      modalProductName.innerHTML = product.name;
      productQuantity.innerHTML = `Current Quantity : ${product.quantity}`;
      editModal.showModal();
    }

    if (updateBtn) {
      restockId = updateBtn.dataset.productId;
      const product = getProduct(restockId);
      updateModalName.innerHTML = product.name;
      restockQuantity.innerHTML = product.quantity;
      updateModal.showModal();
    }
  });

  editStockBtn.addEventListener("click", () => {
    editStock(currentProductId);
  });

  updateStockBtn.addEventListener("click", () => {
    updateStock(restockId);
  });
}

function editStock(productId) {
  let matchingProduct;
  const value = Number(editQtyInput.value);
  matchingProduct = getProduct(productId);
  if (isNaN(value) || value <= 0 || matchingProduct.quantity - value < 0) {
    editQtyInput.classList.add("input-error-message");
    errorMessage.classList.add("show");
  } else {
    errorMessage.classList.remove("show");
    editQtyInput.classList.remove("input-error-message");
    editModal.close();

    let refill = matchingProduct.editQuantity(value, productId);

    if (refill) {
      products.forEach((product) => {
        if (product.type === "cway-empties") {
          product.quantity += value;
        }
      });
    }
    editQtyInput.value = "";
    alertPill();
    generateHTML();
    saveToStorage();
    toast.innerHTML = "<p> Edit sucessful</p>";
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
}

function updateStock(productId) {
  let matchingProduct = null;
  let newQuantity = Number(updateQtyInput.value);
  matchingProduct = getProduct(productId);
  if (isNaN(newQuantity) || newQuantity <= 0) {
    updateQtyInput.classList.add("input-error-message");
    stockHint.innerHTML = `Invalid input try again`;
    stockHint.classList.add("error-message");
    stockHint.classList.add("show");
  } else {
    stockHint.innerHTML = `New total will update automatically`;
    stockHint.classList.remove("error-message");
    stockHint.classList.remove("show");
    updateQtyInput.classList.remove("input-error-message");
    matchingProduct = getProduct(productId);

    let refillEmpty = matchingProduct.updateQuantity(newQuantity, productId);

    //
    if (refillEmpty) {
      products.forEach((product) => {
        if (product.type === "cway-empties") {
          product.quantity -= newQuantity;
        }
      });
    }
    updateModal.close();
    generateHTML();
    alertPill;
    updateQtyInput.value = "";
    saveToStorage();
    toast.innerHTML = "<p> Update sucessful</p>";
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
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
console.log(products);
function filterProduct(isGuest) {
  let filteredProducts;
  const btnArray = [];
  let html = "";

  products.forEach((product) => {
    if (btnArray.includes(product.brand)) {
      return;
    } else if (product.brand === "CWAY/BIMO") {
      return;
    } else {
      btnArray.push(product.brand);
    }
  });

  const filterSection = document.querySelector(".filter-grid");

  btnArray.forEach((brandName) => {
    html += `<span class="filter" data-filterBrand="${brandName}">${brandName.toLowerCase()}</span>`;
  });

  filterSection.innerHTML += html;

  filterSection.addEventListener("click", (e) => {
    const filterBtn = e.target.closest(".filter");

    if (filterBtn) {
      const spans = document.querySelectorAll(".filter");
      spans.forEach((span) => {
        span.classList.remove("active");
      });

      filterBtn.classList.add("active");
      const filter = filterBtn.dataset.filterbrand.toLowerCase();

      if (filter === "all") {
        generateHTML();
      } else {
        filteredProducts = products.filter((product) => {
          return (
            product.brand.toLowerCase().includes(filter) ||
            product.type.toLowerCase().includes(filter)
          );
        });
        document.querySelector(".products-grid").innerHTML = filteredProducts
          .map((bottleWater) => productCardHTML(bottleWater, isGuest))
          .join("");
      }
    }
  });
}

function productCardHTML(bottleWater, isGuest = false) {
  const Stock = getStockStatus(bottleWater.quantity);
  const quantity = quantityWarning(bottleWater.quantity);

  return `
     <div class="product-card" id="product-${bottleWater.id}" style="animation-delay: 0s">
      <div class="card-image-wrap">  
               <img src="${bottleWater.image}" alt="" loading="lazy" />
        <span class="stock-badge ${Stock.class}">
          ${Stock.label}
        </span>
      </div>
      <div class="card-body">
      <div class="card-name"> ${bottleWater.name}</div>
      <p class="product-price">₦${bottleWater.price}</p> 
         <div class="quantity-info">
            <p class="quantity-text">
              <span class="product-quantity ${quantity}">${bottleWater.quantity}</span> packs in store
            </p>
              <a class="product-history" data-product-id="${bottleWater.id}">View history</a>
          </div>
        <div class="card-actions">
        ${
          isGuest
            ? `<p class="guest-account">View only </p>`
            : `
          <button class="btn-card btn-edit" data-product-id="${bottleWater.id}" >
             Edit
          </button>
          <button class="btn-card btn-update" data-product-id="${bottleWater.id}">
            Update Stock
          </button>`
        }
        </div>
      </div>
    </div>
  `;
}
