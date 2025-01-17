const express = require("express");
const path = require("path");
const apiRouter = require("./routes/api");
const { db } = require("./firebaseAdmin"); // Import shared db instance

const app = express();
app.use(express.json());
app.use(express.static("public"));

async function seedDatabase() {
  try {
    const brands = [
      { id: "apple", name: "Apple" },
      { id: "samsung", name: "Samsung" },
      { id: "dell", name: "Dell" },
      { id: "lenovo", name: "Lenovo" },
      { id: "snacks", name: "Snacks" },
    ];

    const products = [
      { name: "iPhone 14", price: 999, brandId: "apple" },
      { name: "MacBook Pro", price: 1999, brandId: "apple" },
      { name: "Samsung Galaxy S22", price: 899, brandId: "samsung" },
      { name: "Samsung Notebook", price: 1499, brandId: "samsung" },
      { name: "Dell XPS 13", price: 1299, brandId: "dell" },
      { name: "Lenovo ThinkPad X1", price: 1099, brandId: "lenovo" },
      { name: "Chips", price: 3, brandId: "snacks" },
      { name: "Cookies", price: 5, brandId: "snacks" },
    ];

    for (const brand of brands) {
      await db.collection("brands").doc(brand.id).set(brand);
    }

    for (const product of products) {
      await db.collection("products").add(product);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
app.use("/api", apiRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

