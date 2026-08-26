export class Water {
  constructor(productDetails) {
    this.image = productDetails.image;
    this.brand = productDetails.brand;
    this.name = productDetails.name;
    this.price = productDetails.price;
    this.quantity = productDetails.quantity;
    this.type = productDetails.type;
    this.id = productDetails.id;
    this.lastUpdateHistory = productDetails.lastUpdateHistory || [];
  }

  editQuantity(value, productId) {
    let isRefill;
    if (this.id === productId) {
      if (value <= 0 || this.quantity - value < 0) return;
      if (isNaN(value)) return;
      isRefill = this.type === "refill";
      isRefill ? true : "";

      this.quantity -= value;

      return isRefill;
    }
  }

  updateQuantity(value, productId) {
    let refillEmpty;
    if (this.id === productId) {
      if (value <= 0) return;
      if (isNaN(value)) return;
      refillEmpty = this.type === "refill";
      refillEmpty ? true : "";

      this.quantity += value;
      return refillEmpty;
    }
  }
}
