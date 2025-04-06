const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categoriesSnapshot = await admin
        .firestore()
        .collection("category")
        .get();

    if (categoriesSnapshot.empty) {
      return res.status(200).json([]);
    }

    const categories = [];
    categoriesSnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({error: error.message});
  }
});

// Get category by ID
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const categoryDoc = await admin
        .firestore()
        .collection("category")
        .doc(categoryId)
        .get();

    if (!categoryDoc.exists) {
      return res.status(404).json({error: "Category not found"});
    }

    return res.status(200).json({
      id: categoryDoc.id,
      ...categoryDoc.data(),
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({error: error.message});
  }
});

// Get service by ID within a category
router.get("/category/:categoryId/service/:serviceId", async (req, res) => {
  try {
    const {categoryId, serviceId} = req.params;

    const serviceDoc = await admin
        .firestore()
        .collection("category")
        .doc(categoryId)
        .collection("services")
        .doc(serviceId)
        .get();

    if (!serviceDoc.exists) {
      return res.status(404).json({error: "Service not found"});
    }

    return res.status(200).json({
      id: serviceDoc.id,
      categoryId,
      ...serviceDoc.data(),
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({error: error.message});
  }
});

// Get all services for a specific salon
router.get("/salon/:salonId", async (req, res) => {
  try {
    const salonId = req.params.salonId;

    const servicesSnapshot = await admin
        .firestore()
        .collection("services")
        .where("salonId", "==", salonId)
        .get();

    if (servicesSnapshot.empty) {
      return res.status(200).json([]);
    }

    const services = [];
    servicesSnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({error: error.message});
  }
});

module.exports = router;
