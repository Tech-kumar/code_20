// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAACmzSlu-4xFbqZtMv2ovssGVu-Xzn5GQ",
  authDomain: "code-20.firebaseapp.com",
  databaseURL: "https://code-20-default-rtdb.firebaseio.com",
  projectId: "code-20",
  storageBucket: "code-20.appspot.com",
  messagingSenderId: "1067185888639",
  appId: "1:1067185888639:web:4e004df043662e0ba30e4a",
  measurementId: "G-L2YB1SN970",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Fetch and display brands and products based on search input
async function fetchData() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  
  if (!searchTerm) {
    alert("Please enter a search term.");
    return;
  }

  try {
    // Fetch brands and products based on search term from Firebase
    await fetchBrandsAndProducts(searchTerm);
  } catch (error) {
    console.error("Error during fetch:", error);
    alert("Failed to load data. Please try again later.");
  }
}

// Fetch and display brands/products based on search term
async function fetchBrandsAndProducts(searchTerm) {
  try {
    // Fetch brands
    const brandsRef = db.ref("brands");
    const brandsSnapshot = await brandsRef.once("value");
    const brands = brandsSnapshot.val();

    const filteredBrands = Object.values(brands).filter(brand => 
      brand.name.toLowerCase().includes(searchTerm)
    );
    displayBrands(filteredBrands);

    // Fetch products
    const productsRef = db.ref("products");
    const productsSnapshot = await productsRef.once("value");
    const products = productsSnapshot.val();

    const filteredProducts = Object.values(products).filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);

    // Visualize data with a chart (For demo purposes)
    visualizeData(filteredBrands, filteredProducts);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    alert("Failed to load data. Please try again later.");
  }
}

// Display brands in cards
function displayBrands(brands) {
  const brandList = document.getElementById("brandsContainer");
  brandList.innerHTML = brands
    .map(
      (brand) => `
      <div class="card">
        <h3>${brand.name}</h3>
        <p>${brand.description}</p>
        <button onclick="fetchProducts('${brand.id}')">View Products</button>
      </div>
    `
    )
    .join("");
}

// Display products in cards
function displayProducts(products) {
  const productList = document.getElementById("productsContainer");
  productList.innerHTML = products.length
    ? products
        .map(
          (product) => `
      <div class="card">
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <p>Rating: ${product.rating} stars</p>
        <textarea id="review-${product.id}" placeholder="Write a review..."></textarea>
        <button onclick="submitReview('${product.id}')">Submit Review</button>
      </div>
    `
        )
        .join("")
    : "<p>No products found for this search term.</p>";
}

// Submit a review for a product
function submitReview(productId) {
  const reviewText = document.getElementById(`review-${productId}`).value;
  if (!reviewText) {
    alert("Please enter a review before submitting.");
    return;
  }

  // Add review to Firebase database
  db.ref(`reviews/${productId}`).push({ review: reviewText });
  alert("Review submitted successfully!");

  // Clear the review box
  document.getElementById(`review-${productId}`).value = "";
}

// Visualize data with a chart
function visualizeData(brands, products) {
  const labels = brands.map(brand => brand.name);
  const productCount = products.length;

  const ctx = document.getElementById("chart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "bar", // Chart type
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Products',
        data: new Array(labels.length).fill(productCount), // Display product count for each brand
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
