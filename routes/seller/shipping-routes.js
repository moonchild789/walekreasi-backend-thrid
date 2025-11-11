const express = require("express");
const router = express.Router();
const {
  getSellerShipping,
  updateShippingCost,
  getShippingBySellerPublic,
} = require("../../controllers/seller/shipping-controller");
const { authMiddleware, isSeller } = require("../../controllers/auth/auth-controller");

// Seller only (dashboard)
router.get("/:sellerId", authMiddleware, isSeller, getSellerShipping);
router.put("/update", authMiddleware, isSeller, updateShippingCost);

// Public (untuk customer)
router.get("/public/:sellerId", getShippingBySellerPublic);

module.exports = router;
