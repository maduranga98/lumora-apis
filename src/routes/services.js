const express = require("express");
const router = express.Router();
const {
  getCategoryById,
  getServiceById,
  getAllServices,
  getAllCategories,
} = require("../controllers/servicesController");

// Get all categories - GET /api/services/categories
router.get("/categories", getAllCategories);

// Get category by ID - GET /api/services/category/:categoryId
router.get("/category/:categoryId", getCategoryById);

// Get service by ID within a category - GET /api/services/category/:categoryId/service/:serviceId
router.get("/category/:categoryId/service/:serviceId", getServiceById);

// Get all services for a salon - GET /api/services/salon/:salonId
router.get("/salon/:salonId", getAllServices);

module.exports = router;
