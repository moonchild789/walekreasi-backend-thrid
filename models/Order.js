const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
      shippingCost: {
        type: Number,
        default: 0, // Ongkos kirim per produk
      },
      isReviewed: {
        type: Boolean,
        default: false,
      },
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
      },
      storeName: String,
      sellerPhone: String,
    },
  ],

  addressInfo: {
    addressId: String,
    receiverName: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },

  orderStatus: {
    type: String,
    default: "Menunggu Konfirmasi",
  },
  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: "pending",
  },

  totalAmount: Number, // total harga produk saja
  shippingTotal: {
    type: Number,
    default: 0, // total ongkir dari semua produk
  },
  grandTotal: {
    type: Number,
    default: 0, // totalAmount + shippingTotal
  },

  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,

  isPaidToSeller: {
    type: Boolean,
    default: false,
  },
  paidToSellerAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
