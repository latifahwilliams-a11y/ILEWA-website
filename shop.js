// === DYNAMIC PRODUCT RENDERING FOR SHOP ALL & CATEGORIES ===
document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("allProductGrid");

  // Safety check: ensure the products array is available
  if (typeof products === "undefined" || !Array.isArray(products)) {
    console.error("Products data not found. Ensure product.js is loaded correctly BEFORE shop.js.");
    if (gridContainer) {
      gridContainer.innerHTML = `<p style="text-align:center; padding: 40px; color: red;">
        ERROR: Product data not available. Check the Console for details.
      </p>`;
    }
    return;
  }

  if (!gridContainer) {
    console.error("Product grid container not found (ID: allProductGrid).");
    return;
  }

  // --- Core Rendering Function ---
  function renderProducts(productsToRender) {
    if (productsToRender.length === 0) {
      gridContainer.innerHTML = `<p style="text-align:center; padding: 40px; font-size: 1.2rem;">
        No products are currently available in this category.
      </p>`;
      return;
    }

    const productHtml = productsToRender.map(product => {
      const imageUrl = product.images && product.images.length > 0 
        ? product.images[0] 
        : "https://via.placeholder.com/400x400?text=No+Image";
      const formattedPrice = `$${product.price.toFixed(2)}`;
      const productLink = `product.html?id=${product.id}`;

      return `
        <div class="product-card">
          <div class="product-image" onclick="window.location.href='${productLink}'">
            <img src="${imageUrl}" alt="${product.name}">
          </div>
          <div class="product-info">
            <div class="product-title">${product.name}</div>
            <div class="product-subtitle">${product.subtitle || ""}</div>

            <button 
              class="add-to-bag" 
              onclick="addToCart('${product.id}', 1); if (typeof openCart==='function') openCart(); event.stopPropagation();">
              <span class="bag-left">Add to Cart</span>
              <span class="bag-right">${formattedPrice}</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

    gridContainer.innerHTML = productHtml;
  }

  // --- URL Parsing and Filtering ---
  const params = new URLSearchParams(window.location.search);
  let categoryFilter = params.get("category");

  // Default to 'all' if no category is specified
  if (!categoryFilter) {
    categoryFilter = "all";
  }

  let productsToRender = products;
  let pageTitle = "Shop All Products";

  // Logic for filtering products
  if (categoryFilter.toLowerCase() !== "all") {
    productsToRender = products.filter(
      p => p.category.toLowerCase() === categoryFilter.toLowerCase()
    );
    const categoryName = categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
    pageTitle = `Shop ${categoryName}`;
  }

  // Update H1 title
  const h1Element = document.getElementById("pageTitle");
  if (h1Element) {
    h1Element.textContent = pageTitle;
  }

  // --- Final Render ---
  renderProducts(productsToRender);
});
