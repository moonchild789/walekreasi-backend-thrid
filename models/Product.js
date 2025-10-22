const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    // 🆕 Ongkos kirim (diatur oleh seller)
    shippingCost: {
      type: Number,
      default: 0, // jika tidak diisi, anggap gratis
      min: 0, // tidak boleh negatif
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
