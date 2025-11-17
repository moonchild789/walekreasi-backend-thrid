const express = require("express");
const { authMiddleware, isAdmin } = require("../../controllers/auth/auth-controller");
const { 
  getAdminDashboardStats,
  getAdminOrderGroupedByStatus
} = require("../../controllers/admin/dashboard-controller");

const router = express.Router();

// Statistik dashboard (seller, customer, revenue, chart bulanan)
router.get("/stats", authMiddleware, isAdmin, getAdminDashboardStats);

// Data order yang dikelompokkan berdasarkan status
router.get("/orders-by-status", authMiddleware, isAdmin, getAdminOrderGroupedByStatus);

module.exports = router;
