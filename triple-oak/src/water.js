export class Water {
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
