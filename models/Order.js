const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
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
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        image: String,
        price: Number,
        quantity: Number,
        weight: {
          type: Number, // berat per item (gram)
          default: 0,
        },
        totalWeight: {
          type: Number, // quantity * weight
          default: 0,
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
      cityOrRegency: String,
      pincode: String,
      phone: String,
      notes: String,
    },

    shippingCostPerKg: {
      type: Number, 
      default: 0,
    },

    totalWeight: {
      type: Number, // total berat semua produk (gram)
      default: 0,
    },

    shippingTotal: {
      type: Number, // total ongkir berdasarkan totalWeight dan shippingCostPerKg
      default: 0,
    },

    totalAmount: {
      type: Number, // total harga produk tanpa ongkir
      required: true,
    },

    grandTotal: {
      type: Number, // totalAmount + shippingTotal
      default: 0,
    },

    orderStatus: {
      type: String,
      default: "Menunggu Konfirmasi",
    },

    paymentStatus: {
      type: String,
      default: "pending",
    },

    paymentMethod: String,
    paymentId: String,
    payerId: String,

    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderUpdateDate: Date,

    isPaidToSeller: {
      type: Boolean,
      default: false,
    },
    paidToSellerAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
