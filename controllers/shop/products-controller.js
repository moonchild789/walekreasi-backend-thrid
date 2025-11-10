const Product = require("../../models/Product");
const Seller = require("../../models/Seller");

// 🟩 Tambahkan produk baru (untuk testing atau seeding)
const createProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      sellerId,
      weight, 
    } = req.body;

    // 🔹 Validasi seller
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller tidak ditemukan." });
    }

    // 🔹 Validasi berat produk
    if (!weight || weight < 1 || weight > 100000) {
      return res.status(400).json({
        success: false,
        message: "Berat produk harus antara 1-100000 gram.",
      });
    }

    // 🔹 Buat produk baru
    const product = new Product({
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      sellerId: seller._id,
      weight, // 🆕 simpan berat
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan.",
      data: product,
    });
  } catch (error) {
    console.error("Error createProduct:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan produk.",
    });
  }
};

// 🟦 Ambil semua produk dengan filter dan sort
const getFilteredProducts = async (req, res) => {
  try {
    const { category = "", sortBy = "price-lowtohigh", limit } = req.query;

    let filters = {};
    if (typeof category === "string" && category.trim() !== "") {
      filters.category = { $in: category.split(",") };
    }

    // 🔹 Urutan sort
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      case "newest":
        sort.createdAt = -1;
        break;
      default:
        sort.price = 1;
    }

    // 🔹 Query produk
    const query = Product.find(filters)
      .sort(sort)
      .populate("sellerId", "storeName storeLogoUrl");

    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        query.limit(limitNum);
      }
    }

    const products = await query;

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in getFilteredProducts:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil produk." });
  }
};

// 🟨 Ambil detail satu produk
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "sellerId",
      "storeName storeLogoUrl"
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produk tidak ditemukan." });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: product._id,
        title: product.title,
        description: product.description,
        image: product.image,
        price: product.price,
        salePrice: product.salePrice,
        category: product.category,
        totalStock: product.totalStock,
        averageReview: product.averageReview,
        weight: product.weight, // 🆕 tampilkan berat produk
        storeName: product.sellerId?.storeName || null,
        storeLogoUrl: product.sellerId?.storeLogoUrl || null,
        sellerId: product.sellerId?._id || null,
      },
    });
  } catch (error) {
    console.error("Error getProductDetails:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil detail produk." });
  }
};

module.exports = {
  createProduct,
  getFilteredProducts,
  getProductDetails,
};