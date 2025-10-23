const express = require("express");
const router = express.Router();
const { authMiddleware, isSeller } = require("../../controllers/auth/auth-controller");
const { getSellerShipping, updateShippingCost } = require("../../controllers/seller/shipping-controller");


router.get("/:sellerId", authMiddleware, isSeller, getSellerShipping);

router.put("/update", authMiddleware, isSeller, updateShippingCost);

module.exports = router;
