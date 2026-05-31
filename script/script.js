class Water {
  constructor(productDetails) {
    this.image = productDetails.image;
    this.brand = productDetails.brand;
    this.name = productDetails.name;
    this.price = productDetails.price;
    this.quantity = productDetails.quantity;
    this.type = productDetails.type;
    this.id = productDetails.id;
  }

  editQuantity(value, productId) {
    if (this.id === productId) {
      if (value <= 0 || this.quantity - value < 0) return;
      if (isNaN(value)) return;
      this.quantity -= value;
    }
  }

  updateQuantity(value, productId) {
    if (this.id === productId) {
      if (value <= 0) return;
      if (isNaN(value)) return;

      this.quantity += value;
    }
  }
}
const persons = {
  lucky: { name: "lucky", password: "1234" },
  akan: { name: "akan", password: "akan123" },
};
let lucky = "akan";
console.log(persons[lucky]);
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
    quantity: 10,
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
    quantity: 0,
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
    name: "Aquafina  75cl",
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
    quantity: 0,
    type: "refill",
    id: "13",
  },
  {
    image: "",
    brand: "BIMO",
    name: "Bimo Refill",
    price: 3600,
    quantity: 0,
    type: "refill",
    id: "14",
  },
  {
    image: "",
    brand: "JASMINE",
    name: "Jasmine 75cl",
    price: 3600,
    quantity: 0,
    id: "15",
  },
  {
    image: "",
    brand: "BRACO",
    name: "Braco 100cl",
    price: 3600,
    quantity: 0,
    id: "16",
  },
];
cancelUpdateBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
cancelEditBtn.addEventListener("click", closeEditModal);
closeEditBtn.addEventListener("click", closeEditModal);
function closeModal() {
  updateModal.close();
  updateQtyInput.value = "";
}
function closeEditModal() {
  editModal.close();
  editQtyInput.value = "";
}

let products;
const saved = localStorage.getItem("product");
products = saved
  ? JSON.parse(saved).map((p) => new Water(p))
  : waters.map((w) => new Water(w));

function saveToStorage() {
  localStorage.setItem("product", JSON.stringify(products));
}

function getStockStatus(quantity) {
  if (quantity === 0) return { label: "Out of Stock", class: "out-of-stock" };
  if (quantity <= 10) return { label: "Low Stock", class: "low-stock" };
  return { label: "In Stock", class: "in-stock" };
}

function quantityWarning(quantity) {
  if (quantity === 0) return "empty";
  if (quantity <= 10) return "low";
}

generateHTML();

function generateHTML() {
  let productHTML = "";
  products.forEach((bottleWater) => {
    const Stock = getStockStatus(bottleWater.quantity);
    const quantity = quantityWarning(bottleWater.quantity);
    let html = `
           <div class="product-card" style="animation-delay: 0s">
        <div class="card-image-wrap">
          <img
            src="https://www.evawater.com.ng/wp-content/uploads/2021/07/75cl.png"
            alt="Eva 75cl"
            onerror="
              this.style.display = 'none';
              this.nextElementSibling.style.display = 'flex';
            "
            style="display: none"
          />
          <div class="placeholder-img" style="display: flex">💧</div>
          <span class="stock-badge ${Stock.class}">
            ${Stock.label}
          </span>
        </div>
        <div class="card-body">
          <div class="card-brand">${bottleWater.brand}</div>
          <div class="card-name"> ${bottleWater.name}</div>
          <div class="card-stats">
            <div class="card-stat">
              <div class="stat-label">Quantity</div>
              <div class="stat-value  ${quantity}">${bottleWater.quantity}</div>
            </div>
            <div class="card-stat">
              <div class="stat-label">Price / Pack</div>
              <div class="stat-value">${bottleWater.price}</div>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-card btn-edit" data-product-id="${bottleWater.id}" >
               Edit
            </button>
            <button class="btn-card btn-update" data-product-id="${bottleWater.id}">
              Update Stock
            </button>
          </div>
        </div>
      </div>
    `;
    productHTML += html;
  });
  document.querySelector(".products-grid").innerHTML = productHTML;
}

function getProduct(productId) {
  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  return matchingProduct;
}

productGrid.addEventListener("click", (e) => {
  let currentProductId = null;
  const editBtn = e.target.closest(".btn-edit");
  const updateBtn = e.target.closest(".btn-update");

  if (editBtn) {
    currentProductId = editBtn.dataset.productId;

    let product = getProduct(currentProductId);
    modalProductName.innerHTML = product.name;

    editModal.showModal();

    editStock(currentProductId);
  }

  if (updateBtn) {
    const productId = updateBtn.dataset.productId;
    let product = getProduct(productId);
    updateModalName.innerHTML = product.name;

    updateModal.showModal();

    updateStock(productId);
  }
});

function editStock(productId) {
  let matchingProduct = null;
  editStockBtn.addEventListener(
    "click",
    () => {
      const value = Number(editQtyInput.value);
      matchingProduct = getProduct(productId);
      matchingProduct.editQuantity(value, productId);
      editModal.close();

      editQtyInput.value = "";
      generateHTML();
    },
    { once: true },
  );
}

function updateStock(productId) {
  let matchingProduct = null;
  updateStockBtn.addEventListener(
    "click",
    () => {
      let newQuantity = Number(updateQtyInput.value);
      matchingProduct = getProduct(productId);
      matchingProduct.updateQuantity(newQuantity, productId);
      updateModal.close();

      generateHTML();
      updateQtyInput.value = "";
      saveToStorage();
    },
    { once: true },
  );
}
