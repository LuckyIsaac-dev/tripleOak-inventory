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
      if (value <= 0) return;
      if ((this.quantity -= value <= 0)) return;
      return (this.quantity -= value);
    }
  }

  updateQuantity(value, productId) {
    if (this.id === productId) {
      if (value <= 0) return;
      return (this.quantity += value);
    }
  }
}

const waters = [
  {
    image: "",
    brand: "Eva",
    name: "Eva 75cl",
    price: "3500",
    quantity: 10,
    type: "bottle water",
    id: "1",
  },
  {
    image: "",
    brand: "Eva",
    name: "Eva 150cl",
    price: "3600",
    quantity: 10,
    type: "bottle water",
    id: "2",
  },
  {
    image: "",
    brand: "CWAY",
    name: "Cway 600ml",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "3",
  },
  {
    image: "",
    brand: "CWAY",
    name: "Cway 750ml",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "4",
  },
  {
    image: "",
    brand: "CWAY",
    name: "Cway 1500ml",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "5",
  },
  {
    image: "",
    brand: "AQUAFINA",
    name: "Aquafina  75cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "6",
  },
  {
    image: "",
    brand: "LASIEN",
    name: "Lasien 50cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "7",
  },
  {
    image: "",
    brand: "LASIEN",
    name: "Lasien 75cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "8",
  },
  {
    image: "",
    brand: "LASIEN",
    name: "Lasien 150cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "9",
  },
  {
    image: "",
    brand: "NESTLE",
    name: "Nestle Blue 60cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "10",
  },
  {
    image: "",
    brand: "NESTLE",
    name: "Nestle Green 60cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "11",
  },
  {
    image: "",
    brand: "CWAY",
    name: "Cway Refill",
    price: "3600",
    quantity: 0,
    type: "refill",
    id: "12",
  },
  {
    image: "",
    brand: "BIMO",
    name: "Bimo Refill",
    price: "3600",
    quantity: 0,
    type: "refill",
    id: "13",
  },
];

let products;

products = waters.map((water) => {
  return new Water(water);
});

generateHTML();

function generateHTML() {
  let productHTML = "";
  products.forEach((bottleWater) => {
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
          <span class="stock-badge out-of-stock">Out of Stock</span>
        </div>
        <div class="card-body">
          <div class="card-brand">${bottleWater.brand}</div>
          <div class="card-name"> ${bottleWater.name}</div>
          <div class="card-stats">
            <div class="card-stat">
              <div class="stat-label">Quantity</div>
              <div class="stat-value empty">${bottleWater.quantity}</div>
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
            <button class="btn-card btn-update">
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
let input = document.querySelector(".update-quantity-input");
let saveBtn = document.querySelector(".btn-update");
let value;
let modal = document.querySelector("dialog");
let modalProductName = document.getElementById("qty-modal-product-name");
document.querySelectorAll(".btn-edit").forEach((editButton) => {
  editButton.addEventListener("click", () => {
    const productId = editButton.dataset.productId;

    products.forEach((product) => {
      if (product.id === productId) {
        console.log(product);
        modalProductName.innerHTML = product.name;
      }
    });

    modal.showModal();

    saveBtn.addEventListener("click", () => {
      value = Number(input.value);
      products.forEach((product) => {
        if (product.id === productId) {
          product.editQuantity(value, productId);
          console.log(product);
          generateHTML();
        }
      });
    });
  });
});
