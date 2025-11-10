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
    weight: {
      type: Number,
      required: true,
      default: 100,
      min: 1,
      max: 100000, 
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
