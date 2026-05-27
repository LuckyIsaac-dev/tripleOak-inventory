class Water {
  constructor(productDetails) {
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.price = productDetails.price;
    this.quantity = productDetails.quantity;
    this.type = productDetails.type;
    this.id = productDetails.id;
  }
}

const waters = [
  {
    image: "",
    name: "Eva Water 75cl",
    price: "3500",
    quantity: 10,
    type: "bottle water",
    id: "1",
  },
  {
    image: "",
    name: "Eva Water 150cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "2",
  },
  {
    image: "",
    name: "Cway 600ml",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "3",
  },
  {
    image: "",
    name: "Cway 750ml",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "4",
  },
  {
    image: "",
    name: "Cway 1500ml",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "5",
  },
  {
    image: "",
    name: "Aquafina 75ml",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "6",
  },
  {
    image: "",
    name: "Lasien 50cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "7",
  },
  {
    image: "",
    name: "Lasien 75cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "8",
  },
  {
    image: "",
    name: "Lasien 150cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "9",
  },
  {
    image: "",
    name: "Nestle Blue 60cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "10",
  },
  {
    image: "",
    name: "Nestle Green 60cl",
    price: "3600",
    quantity: 0,
    type: "bottle water",
    id: "11",
  },
  {
    image: "",
    name: "Cway Refill",
    price: "3600",
    quantity: 0,
    type: "refill",
    id: "12",
  },
  {
    image: "",
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
      <div class="product-card">
      <span class="status-badge instock">In Stock</span>
      <div class="product-image">
        <img src="images/EVA-WATER-150CL.jpeg" />
      </div>
      <div class="product-details">
        <h2 class="product-name">${bottleWater.name}</h2>
        <div class="product-meta">
          <p><strong>Price:</strong> ₦ ${bottleWater.price} / carton</p>
          <!-- <p><strong>Last Updated:</strong> 23-05-2026</p> -->
        </div>
        <div class="quantity-badge">
          <span>Quantity: <strong> ${bottleWater.quantity} packs</strong></span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-update">Update Qty</button>
        <button class="btn btn-edit" data-product-id="${bottleWater.id}">Edit</button>
      </div>
    </div>
    `;
    productHTML += html;
  });
  document.querySelector(".product-grid").innerHTML = productHTML;
}
function editQuantity(value, productId) {
  products.forEach((water) => {
    if (water.id === productId) {
      if (water.quantity <= 0) return;
      return (water.quantity -= value);
    }
  });
}
document.querySelectorAll(".btn-edit").forEach((editButton) => {
  editButton.addEventListener("click", () => {
    const productId = editButton.dataset.productId;
    console.log(productId);
  });
});
editQuantity(2, "1");
