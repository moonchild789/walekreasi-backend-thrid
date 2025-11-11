const Shipping = require("../../models/Shipping");
const Seller = require("../../models/Seller");

// =======================
// SELLER: Ambil semua ongkir milik seller (hanya bisa diakses oleh seller yang login)
// =======================
const getSellerShipping = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id });
    if (!seller)
      return res.status(404).json({ success: false, message: "Toko tidak ditemukan." });

    const shipping = await Shipping.find({ sellerId: seller._id });
    res.status(200).json({ success: true, data: shipping });
  } catch (error) {
    console.error("getSellerShipping error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil ongkir." });
  }
};

// =======================
// SELLER: Update ongkir per daerah
// =======================
const updateShippingCost = async (req, res) => {
  const { cityOrRegency, cost } = req.body;
  try {
    const seller = await Seller.findOne({ user: req.user.id });
    if (!seller)
      return res.status(404).json({ success: false, message: "Toko tidak ditemukan." });

    const shipping = await Shipping.findOneAndUpdate(
      { sellerId: seller._id, cityOrRegency },
      { cost },
      { new: true }
    );

    res.status(200).json({ success: true, data: shipping });
  } catch (error) {
    console.error("updateShippingCost error:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui ongkir." });
  }
};

// =======================
// PUBLIC: Ambil ongkir milik seller (bisa diakses customer tanpa login)
// =======================
const getShippingBySellerPublic = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const shipping = await Shipping.find({ sellerId });
    if (!shipping.length) {
      return res
        .status(404)
        .json({ success: false, message: "Data ongkir tidak ditemukan." });
    }

    res.status(200).json({ success: true, data: shipping });
  } catch (error) {
    console.error("getShippingBySellerPublic error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data ongkir publik." });
  }
};

module.exports = { 
  getSellerShipping, 
  updateShippingCost, 
  getShippingBySellerPublic 
};
