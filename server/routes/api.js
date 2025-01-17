const express = require("express");
const { db } = require("../firebaseAdmin"); // Import shared db instance

const router = express.Router();

router.get("/brands", async (req, res) => {
  try {
    const snapshot = await db.collection("brands").get();
    const brands = snapshot.docs.map((doc) => doc.data());
    res.json(brands);
  } catch (error) {
    res.status(500).send("Error fetching brands: " + error.message);
  }
});

router.get("/products/:brandId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("products")
      .where("brandId", "==", req.params.brandId)
      .get();
    const products = snapshot.docs.map((doc) => doc.data());
    res.json(products);
  } catch (error) {
    res.status(500).send("Error fetching products: " + error.message);
  }
});

module.exports = router;


