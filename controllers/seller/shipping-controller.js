const Shipping = require("../../models/Shipping");
const Seller = require("../../models/Seller");

// Ambil semua ongkir milik seller
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

// Update ongkir per daerah
const updateShippingCost = async (req, res) => {
  const { regionName, cost } = req.body;
  try {
    const seller = await Seller.findOne({ user: req.user.id });
    if (!seller)
      return res.status(404).json({ success: false, message: "Toko tidak ditemukan." });

    const shipping = await Shipping.findOneAndUpdate(
      { sellerId: seller._id, regionName },
      { cost },
      { new: true }
    );

    res.status(200).json({ success: true, data: shipping });
  } catch (error) {
    console.error("updateShippingCost error:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui ongkir." });
  }
};

module.exports = { getSellerShipping, updateShippingCost };
