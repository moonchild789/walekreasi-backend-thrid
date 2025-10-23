const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    regionName: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      default: 10000, // default ongkir jika seller belum ubah
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipping", shippingSchema);
