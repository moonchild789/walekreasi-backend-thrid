const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Seller = require("../../models/Seller");
const Shipping = require("../../models/Shipping");
const { defaultRegions } = require("../../config/defaultRegions");
const { sendWelcomeNotificationToCustomer } = require("../common/notification-controller");

const JWT_SECRET = "PTA|HPL|wkPWA-2025";

// ================= HELPER =================
const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email || null,
      name: user.userName,
      phoneNumber: user.phoneNumber,
    },
    JWT_SECRET,
    { expiresIn: "60m" }
  );

const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ================= REGISTER CUSTOMER =================
const registerUser = async (req, res) => {
  const { userName, email, password, phoneNumber, fcmToken } = req.body;

  try {
    if (!phoneNumber || !password || !userName) {
      return res.status(400).json({
        success: false,
        message: "Nama, nomor telepon, dan password wajib diisi",
      });
    }

    // Cek nomor telepon (WAJIB & UNIK)
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Nomor telepon sudah terdaftar",
      });
    }

    // Cek email hanya jika diisi
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email sudah terdaftar",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      userName,
      email: email || null,
      password: hashedPassword,
      phoneNumber,
      fcmToken,
      role: "customer",
    });

    await sendWelcomeNotificationToCustomer(newUser._id);

    res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil",
      user: {
        id: newUser._id,
        name: newUser.userName,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
      },
    });
  } catch (e) {
    console.error("❌ registerUser error:", e);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat pendaftaran",
    });
  }
};

// ================= REGISTER SELLER =================
const registerSeller = async (req, res) => {
  const { sellerName, phoneNumber, email, password, ...otherInfo } = req.body;

  try {
    if (!sellerName || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama seller, nomor telepon, dan password wajib diisi",
      });
    }

    // Cek phoneNumber (WAJIB & UNIK)
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Nomor telepon sudah digunakan",
      });
    }

    // Cek email hanya jika diisi
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email sudah digunakan",
        });
      }
    }

    // User (hash oleh schema User)
    const user = await User.create({
      userName: sellerName,
      email: email || null,
      phoneNumber,
      password,
      role: "seller",
    });

    // Seller (hash oleh schema Seller)
    const seller = await Seller.create({
      user: user._id,
      sellerName,
      phoneNumber,
      email: email || null,
      password,
      ...otherInfo,
    });

    // Ongkir default
    const shippingData = defaultRegions.map((cityOrRegency) => ({
      sellerId: seller._id,
      cityOrRegency,
      cost: 10000,
    }));
    await Shipping.insertMany(shippingData);

    res.status(201).json({
      success: true,
      message: "Pendaftaran seller berhasil",
      user: {
        id: user._id,
        role: user.role,
        phoneNumber: user.phoneNumber,
        email: user.email,
        sellerId: seller._id,
      },
    });
  } catch (e) {
    console.error("Register Seller Error:", e);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat pendaftaran seller",
    });
  }
};

// ================= LOGIN (EMAIL / PHONE) =================
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  // identifier = email ATAU phoneNumber

  try {
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email / nomor telepon dan password wajib diisi",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Akun tidak ditemukan",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user._id,
        name: user.userName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });
  } catch (e) {
    console.error("Login Error:", e);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat login",
    });
  }
};

// ================= LOGOUT =================
const logoutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({ success: true, message: "Logout berhasil" });
};

// ================= MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Token tidak ditemukan" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak valid" });
  }
};

const isAuthenticated = (req, res, next) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Harus login terlebih dahulu" });
  next();
};

const isRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({
      success: false,
      message: `Akses ditolak. Hanya ${role} yang diizinkan.`,
    });
  }
  next();
};

module.exports = {
  registerUser,
  registerSeller,
  loginUser,
  logoutUser,
  authMiddleware,
  isAuthenticated,
  isSeller: isRole("seller"),
  isAdmin: isRole("admin"),
};
