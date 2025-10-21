const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Data Pribadi
  sellerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  // Domisili
  domicileAddress: {
    type: String,
    required: true,
  },
  cityOrRegency: {
    type: String,
    required: true, 
  },
  province: {
    type: String,
    default: "Sulawesi Utara",
  },

  // Data Usaha
  storeName: {
    type: String,
    required: true,
  },
  storeDescription: {
    type: String,
  },
  productionAddress: {
    type: String,
  },
  storeLogoUrl: {
    type: String,
  },
  storeBannerUrl: {
    type: String,
  },

  // Data Pembayaran
  bankAccountOwner: {
    type: String,
  },
  bankName: {
    type: String,
  },
  bankAccountNumber: {
    type: String,
  },

  // Persetujuan
  agreedToTerms: {
    type: Boolean,
    required: true,
    default: false,
  },

  // Status Seller
  isActive: {
    type: Boolean,
    default: true,
  },

  // Tanggal Pendaftaran
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Seller = mongoose.model("Seller", SellerSchema);
module.exports = Seller;
