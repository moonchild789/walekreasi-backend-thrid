const User = require("../../models/User");
const Order = require("../../models/Order");

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

/* ======================================================
   GET ADMIN DASHBOARD STATISTICS
====================================================== */
const getAdminDashboardStats = async (req, res) => {
  try {
    // 1. Hitung total seller & customer
    const sellerCount = await User.countDocuments({ role: "seller" });
    const customerCount = await User.countDocuments({ role: "customer" });

    // 2. Range data: awal tahun sampai sekarang
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // 3. Aggregasi data order per bulan
    const monthlyStatsRaw = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: today },
          paymentStatus: { $in: ["Terbayar", "settlement", "capture"] },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // 4. Format ke dalam 12 bulan
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = monthlyStatsRaw.find((item) => item._id.month === month);
      return {
        month: monthNames[i],
        revenue: found ? found.totalRevenue : 0,
        orders: found ? found.totalOrders : 0,
      };
    });

    // 5. Hitung total keseluruhan
    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    const totalOrders = monthlyRevenue.reduce((sum, m) => sum + m.orders, 0);

    // 6. Kirim ke frontend
    res.status(200).json({
      success: true,
      data: {
        sellerCount,
        customerCount,
        totalRevenue,
        totalOrders,
        monthlyRevenue,
      },
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data dashboard admin",
    });
  }
};


/* ======================================================
   GET ORDERS GROUPED BY STATUS
====================================================== */
const getAdminOrdersGroupedByStatus = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "userName phoneNumber")
      .sort({ createdAt: -1 });

    // Kelompok status
    const grouped = {
      pending: [],
      processing: [],
      shipped: [],
      delivered: [],
      rejected: [],
    };

    orders.forEach((order) => {
      const status = order.orderStatus || "pending";
      if (grouped[status]) {
        grouped[status].push(order);
      }
    });

    res.status(200).json({
      success: true,
      data: grouped,
    });

  } catch (error) {
    console.error("Admin Order Group Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data pesanan admin",
    });
  }
};


module.exports = {
  getAdminDashboardStats,
  getAdminOrdersGroupedByStatus,
};
