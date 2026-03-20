/**
 * ILEWA Product Data Catalog
 *
 * This array is the single source of truth for all product information 
 * (Name, Price, Category, Images, Details) used across shop.js and product.js.
 */
// === DYNAMIC PRODUCT PAGE RENDERING (FIXED IMAGE & SCROLLING) ===

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Initial Setup and Product Lookup ---
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const container = document.getElementById('productPageContainer');

    // Safety check for the products array
    if (typeof products === "undefined" || !productId) {
        // ... (Error handling remains the same)
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        // ... (Error handling remains the same)
        return;
    }

    document.title = `Ilewa | ${product.name}`;

    // 1. --- Image Gallery Rendering ---
    const imageGalleryHTML = `
        <div class="product-image-display">
            <div class="main-image-wrapper">
                <img id="mainProductImage" src="${product.images[0]}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/600x600/EAFAEA/780C28?text=ILEWA'">
            </div>
            
            <div class="thumbnail-scroller-wrapper">
                <button class="scroll-arrow scroll-left" id="scrollLeftBtn">
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                <div class="thumbnail-gallery-scroll" id="thumbnailScrollArea">
                    ${product.images.map((imgUrl, index) => `
                        <img src="${imgUrl}"
                             alt="${product.name} thumbnail ${index + 1}"
                             class="thumbnail ${index === 0 ? 'active' : ''}"
                             data-full-src="${imgUrl}"
                             onerror="this.onerror=null;this.src='https://placehold.co/120x120/EAFAEA/780C28?text=ILEWA'">
                    `).join('')}
                </div>
                
                <button class="scroll-arrow scroll-right" id="scrollRightBtn">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;

    // 2. --- Details and Action Rendering (Same as before) ---
    const detailsHTML = `
        <div class="product-details">
            <h1 class="product-name">${product.name}</h1>
            <p class="product-subtitle">${product.subtitle || ''}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>

            <div class="product-meta">
                <p><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                ${product.shades.length > 0 ? `
                    <div class="shades-selector">
                        <strong>Shade:</strong>
                        <select id="shadeSelect">
                            ${product.shades.map(shade => `<option value="${shade.code}">${shade.name}</option>`).join('')}
                        </select>
                    </div>` : ''
                }
            </div>

            <form id="addToCartForm" class="add-to-cart-form">
                <div class="quantity-selector">
                    <button type="button" id="qtyMinus">-</button>
                    <input type="number" id="productQty" value="1" min="1" max="99" readonly>
                    <button type="button" id="qtyPlus">+</button>
                </div>
                <button type="submit" class="button-cta add-to-bag-btn">
                    ADD TO BAG
                </button>
            </form>
        </div>
    `;
    
    // 3. --- Tab Content Rendering (Same as before) ---
    const aboutContent = product.details.about.map(p => `<p>${p}</p>`).join('');
    const ingredientsContent = `<p>${product.details.ingredients}</p>`;
    const howToUseContent = product.details.howToUse ? `<p>${product.details.howToUse}</p>` : '<p>No specific usage instructions provided.</p>';


    const tabsHTML = `
        <div class="product-tabs">
            <div class="tabs-header">
                <button class="tab-button active" data-tab="about">About</button>
                <button class="tab-button" data-tab="ingredients">Ingredients</button>
                <button class="tab-button" data-tab="howToUse">How To Use</button>
            </div>
            <div id="tabContent">
                <div class="tab-content active" id="tab-about">${aboutContent}</div>
                <div class="tab-content" id="tab-ingredients">${ingredientsContent}</div>
                <div class="tab-content" id="tab-howToUse">${howToUseContent}</div>
            </div>
        </div>
    `;

    // --- Assemble the Main Content ---
    container.querySelector('.image-gallery-area').innerHTML = imageGalleryHTML;
    container.querySelector('.details-area').innerHTML = detailsHTML;
    container.querySelector('.tabs-area').innerHTML = tabsHTML;


    // 4. Add Event Listeners for Interaction

    // Fix 1: Image Switching (Targeting the correct data attribute)
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            document.getElementById('mainProductImage').src = this.dataset.fullSrc;
            
            // Update active class
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Fix 2: Thumbnail Scroll Logic
    const scrollArea = document.getElementById('thumbnailScrollArea');
    const scrollAmount = 120; // Scroll by roughly one thumbnail width

    document.getElementById('scrollRightBtn').addEventListener('click', () => {
        scrollArea.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    document.getElementById('scrollLeftBtn').addEventListener('click', () => {
        scrollArea.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });


    // Tab Switching (Same as before)
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`tab-${this.dataset.tab}`).classList.add('active');
        });
    });

    // Quantity Selector (Same as before)
    const qtyInput = document.getElementById('productQty');
    document.getElementById('qtyPlus').addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    document.getElementById('qtyMinus').addEventListener('click', () => {
        if (parseInt(qtyInput.value) > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
        }
    });

    // Fix 3: Add to Cart Logic (Ensuring it opens the cart drawer)
    document.getElementById('addToCartForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const quantity = parseInt(qtyInput.value);
        let selectedShade = null;
        const shadeSelect = document.getElementById('shadeSelect');
        
        if (shadeSelect) {
            selectedShade = shadeSelect.value;
        }

        // Call global addToCart function
        if (typeof addToCart === 'function') {
            addToCart(productId, quantity, selectedShade);
            
            // CRITICAL: Call the function to open the cart drawer!
            if (typeof openCart === 'function') {
                 openCart();
            } else {
                 alert(`${quantity} of ${product.name} added to bag! (Cart drawer function 'openCart' missing in script.js)`);
            }
           
        } else {
            console.error("The addToCart function is missing from script.js.");
            alert("Product added to bag (check console for missing script.js function).");
        }
    });
});

const products = [
  // =============================================================
  // === BODY CARE PRODUCTS ===
  // =============================================================
  {
    id: "purple-BAL",
    name: "Deep-Cleansing Purple Clay Bar Soap",
    subtitle: "Purify and balance your skin.",
    category: "body",
    price: 14.00,
    images: [
      "https://butterandlye.com/cdn/shop/files/resized.jpg?v=1730914321&width=713",
      "https://butterandlye.com/cdn/shop/files/PurpleClaysidebyside-r.jpg?v=1730871423&width=713",
      "https://butterandlye.com/cdn/shop/files/B033769.jpg?v=1730871422&width=713",
      "https://butterandlye.com/cdn/shop/files/B033781.jpg?v=1730871423&width=713"
    ],
    shades: [], 
    details: {
      about: [
        "A 100% natural soap infused with Brazilian purple clay to purify and balance the skin.",
        "This mineral-rich bar gently removes impurities while nourishing with botanical butters and essential oils. Ideal for sensitive or dull skin, it leaves your complexion soft, hydrated, and visibly renewed."
      ],
      ingredients:
        "Saponified Organic Sunflower Oil, Saponified Organic Coconut Oil, Saponified Organic Castor Oil, Essential Oils of Lavender and Sage, Purple Brazilian Clay, White Kaolin Clay, Organic Shea Butter, Organic Cocoa Butter, Organic Mango Butter, Rosemary Extract.",
      howToUse:
        "Lather the soap between wet hands or on a washcloth to create a rich foam. Gently massage onto damp skin using circular motions, then rinse thoroughly with warm water. Allow the bar to dry between uses to extend its life."
    }
  },

  {
    id: "yellow-BAL",
    name: "Even-Tone Turmeric Bar Soap",
    subtitle: "Brighten and calm your complexion.",
    category: "body",
    price: 10.00,
    images: [
      "https://butterandlye.com/cdn/shop/files/healing-turmeric-soap-bar-1.jpg?v=1732239880&width=713",
      "https://butterandlye.com/cdn/shop/files/healing-turmeric-soap-bar-2.jpg?v=1732239950&width=713",
      "https://butterandlye.com/cdn/shop/files/healing-turmeric-soap-bar-3.jpg?v=1732240034&width=713",
      "https://butterandlye.com/cdn/shop/files/healing-turmeric-soap-bar-4.jpg?v=1732240101&width=713",
      "https://butterandlye.com/cdn/shop/files/healing-turmeric-soap-bar-5.jpg?v=1732240171&width=713"
    ],
    shades: [],
    details: {
      about: [
        "A gentle, 100% natural soap that calms, brightens, and restores your skin.",
        "Formulated with antioxidant-rich turmeric, it helps reduce redness, irritation, and hyperpigmentation while promoting a smooth, even complexion."
      ],
      ingredients:
        "Helianthus Annuus (Sunflower) Seed Oil, Cocos Nucifera (Coconut) Oil, Ricinus Communis (Castor) Seed Oil, Sodium Hydroxide, Curcuma Longa (Turmeric) Root Powder, Butyrospermum Parkii (Shea) Butter, Kaolin (White Clay), Saponified Olea Europaea (Olive) Fruit Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract.",
      howToUse:
        "Lather between wet hands or on a washcloth, then massage onto damp skin in circular motions. Rinse thoroughly and pat dry. Use daily for best results. Allow the bar to dry between uses to extend its life."
    }
  },

  {
    id: "pink-BAL",
    name: "Exfoliating Pink Soap Bar",
    subtitle: "Polish and revitalize for smoother skin.",
    category: "body",
    price: 10.00,
    images: [
      "https://butterandlye.com/cdn/shop/files/pink-clay-1_412b14a1-7f56-415f-b021-61d4def7aca2.jpg?v=1715779925&width=713",
      "https://butterandlye.com/cdn/shop/files/pink-clay-3_c27e26c1-0c6a-4843-aa42-0c47cf07e23a.jpg?v=1738368628&width=713",
      "https://butterandlye.com/cdn/shop/files/pink-clay-2.jpg?v=1715691542&width=713",
      "https://butterandlye.com/cdn/shop/files/pink-clay-4.jpg?v=1715691542&width=713",
      "https://butterandlye.com/cdn/shop/files/pink_soap_bar.jpg?v=1736805288&width=713"
    ],
    shades: [],
    details: {
      about: [
        "A gentle, 100% natural exfoliating soap that polishes and revitalizes your skin.",
        "Formulated with pink and white kaolin clays, it helps remove dead skin cells, promote cell renewal, and deeply hydrate for a brighter, smoother complexion."
      ],
      ingredients:
        "Saponified Organic Sunflower Oil, Saponified Organic Coconut Oil, Saponified Organic Castor Oil, Pink Clay, Organic Shea Butter, Organic Olive Oil, White Kaolin Clay, Rosemary Extract.",
      howToUse:
        "Lather between wet hands or on a washcloth, then massage onto damp skin in circular motions. Rinse thoroughly and pat dry. Use daily for best results. Allow the bar to dry between uses to extend its life."
    }
  },

  {
    id: "washcloth-BAL",
    name: "Exfoliating Washcloth",
    subtitle: "100% natural agave fiber.",
    category: "body",
    price: 15.00,
    images: [
      "https://butterandlye.com/cdn/shop/files/washcloth-1.jpg?v=1716211378&width=713",
      "https://butterandlye.com/cdn/shop/files/washcloth-3.jpg?v=1716211383&width=713",
      "https://butterandlye.com/cdn/shop/files/washcloth-2.jpg?v=1716211383&width=713"
    ],
    shades: [],
    details: {
      about: [
        "Handcrafted by women artisans in Mexico’s Mezquital Valley, this 100% natural agave fiber washcloth offers gentle, eco-friendly exfoliation.",
        "Free from synthetics and chemicals, it removes dead skin cells for smooth, radiant skin while supporting sustainable craftsmanship."
      ],
      ingredients: "100% Natural Agave Fiber.",
      howToUse:
        "Soak in warm water until soft, lather with soap, gently wash in circular motions, rinse thoroughly, and hang to dry. Hand wash and line dry as needed."
    }
  },

  {
    id: "offwhite-BAL",
    name: "Filter-Finish Sage Bar Soap",
    subtitle: "Anti-aging formula for a youthful glow.",
    category: "body",
    price: 10.00,
    images: [
      "https://butterandlye.com/cdn/shop/files/anti-aging-sage-4.jpg?v=1715691827&width=713",
      "https://butterandlye.com/cdn/shop/files/Butter_Lye2301_Sage_2.jpg?v=1717697836&width=713",
      "https://butterandlye.com/cdn/shop/files/anti-aging-sage-2.jpg?v=1715691827&width=713",
      "https://butterandlye.com/cdn/shop/files/anti-aging-sage-1_404233f4-68b9-4fab-b179-42e4e8e35864.jpg?v=1717697844&width=713",
      "https://butterandlye.com/cdn/shop/files/CopyofBL-Morgan-2024_6204.jpg?v=1717697844&width=713"
    ],
    shades: [],
    details: {
      about: [
        "Experience timeless beauty with this 100% natural, antioxidant-rich soap designed to nourish, protect, and rejuvenate your skin.",
        "Infused with sage to balance oils, tighten pores, and smooth texture, it helps combat fine lines and dullness for a refreshed, youthful glow."
      ],
      ingredients:
        "Saponified Organic Sunflower Oil, Saponified Organic Coconut Oil, Organic Castor Oil, Organic Sage, Organic Shea Butter, White Kaolin Clay, Organic Olive Oil, Rosemary Extract.",
      howToUse:
        "Lather between wet hands or on a washcloth, massage onto damp skin in circular motions, rinse thoroughly, pat dry, and allow the bar to dry between uses."
    }
  },

  {
    id: "brown-BAL",
    name: "Moisturizing Rosehip Soap Bar",
    subtitle: "Deeply hydrating for face and body.",
    category: "body",
    price: 10.00,
    images: [
      "https://butterandlye.com/cdn/shop/files/moisturizing-rosehip-soap-1.jpg?v=1741376222&width=713",
      "https://butterandlye.com/cdn/shop/files/moisturizing-rosehip-soap-2.jpg?v=1738353323&width=713",
      "https://butterandlye.com/cdn/shop/files/moisturizing-rosehip-4.jpg?v=1715692098&width=713",
      "https://butterandlye.com/cdn/shop/files/CopyofBL-Morgan-2024_6874.jpg?v=1717698092&width=713"
    ],
    shades: [],
    details: {
      about: [
        "Experience the power of rosehip with this all-natural, deeply hydrating soap for face and body.",
        "Enriched with rosehip powder and oils rich in vitamins A, C, and E, it helps repair, brighten, and rejuvenate the skin while reducing redness and improving texture."
      ],
      ingredients:
        "Saponified Organic Sunflower Oil, Saponified Organic Coconut Oil, Saponified Organic Castor Oil, Organic Rosehips, Organic Shea Butter, White Kaolin Clay, Organic Olive Oil, Rosemary Extract.",
      howToUse:
        "Lather between wet hands or on a washcloth, massage onto damp skin in circular motions, rinse thoroughly, pat dry, and let the bar dry between uses."
    }
  },
  
  // =============================================================
  // === HAIR CARE PRODUCTS (SLIQ) ===
  // =============================================================
  {
    id: "deepit-Sliq",
    name: "DEEP IT",
    subtitle: "Water-activated conditioning treatment.",
    category: "hair",
    price: 44.00,
    images: [
      "https://cdn.prod.website-files.com/621796a8c6ab99d03ddfa05c/67a924726def185314354907_Sliq_Product_Campaign0586-p-2600.jpeg",
      "https://cdn.prod.website-files.com/621796a8c6ab99d03ddfa05c/67a924be8e3115371471456b_Sliq_Product_Campaign0628-p-2600.jpeg",
      "https://cdn.prod.website-files.com/621796a8c6ab99d03ddfa05c/67b29a139d576cac21c95d31_Sliq_Product_Campaign0737%20(1)-p-2600.jpeg"
    ],
    shades: [],
    details: {
      about: [
        "DEEP IT is a high-performance, water-activated conditioning treatment that strengthens, nourishes, and restores moisture.",
        "Formulated to penetrate deep into the hair shaft, this treatment reduces breakage and improves elasticity, leaving hair incredibly soft and manageable."
      ],
      ingredients:
        "Water, Behentrimonium Methosulfate, Cetearyl Alcohol, Glycerin, Hydrolyzed Wheat Protein, Coconut Oil, Shea Butter, Fragrance."
    }
  },

 // =============================================================
  // === SKINCARE ===
  // =============================================================

 {
    id: "cleanser-TMB",
    name: "Thank me later",
    subtitle: "pH balanced facial cleanser",
    category: "skincare",
    price: 32.00,
    images: [
      "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/6f50d14a-26b7-4594-86cf-9acc53ef1875/_MG_0570.jpg?format=750w",
      "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/7afd1881-fc80-4e8d-8f1e-9374aba7919d/D2CD1D70-C41F-412E-B757-30041FF9ACEA.JPEG?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/1680973987352-B91UDC4O5CF5WV2OXKA3/IMG_7917+copy.jpg?format=1000w"
    ],
    shades: [],
    details: {
      about: [
        "A gentle, pH-balanced face cleanser meticulously crafted to cleanse skin effectively while supporting a healthy skin barrier.",
        "Ideal for both day and night routines, this cleanser is adept at preventing buildup in pores, removing dirt, grime, and makeup without compromising skin moisture or pH balance"
      ],
      ingredients:
        " Water (Aqua), Aloe Barbadensis, Coco Glucoside, Glycerin, Niacinamide (Vitamin B3), Propylene Glycol, Diazolidinyl Urea, Iodopropynyl Butylcarbamate, Xanthan Gum, Cucumis Sativus (Cucumber) Fruit Extract, Panthenol (Vitamin B5), Citric Acid."
    }
  },

 {
    id: "serum-TMB",
    name: "Apple Juice",
    subtitle: "Brightening & Hydrating Serum",
    category: "skincare",
    price: 28.00,
    images: [
      "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/39202cc0-de28-49ac-9ac4-700008a88037/_MG_0544.jpg?format=750w",
      "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/c1bb703d-4fdd-4012-a478-6b44c2144ccf/_MG_0553.jpg?format=750w",
      "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/d02c670b-0b72-4e7e-85fa-b3e3caa6a578/_MG_0541.jpg?format=750w", 
      "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/dc4a6f6e-9b7a-44d7-bf80-ce8f847eaabe/_MG_0555.jpg?format=750w"
    ],
    shades: [],
    details: {
      about: [
        "Apple Juice is a revolutionary 2-in-1 Apple Cider Vinegar toner serum that’s set to transform your skincare routine. This unique combo provides the benefits of both a toner and a serum in one easy-to-use product, giving your skin the perfect balance of care and nourishment."
      ],
      ingredients:
        "",
    }
  },

{
    id: "moisturizer-TMB",
    name: "Shea All Day",
    subtitle: "Lightweight, Long-Lasting, and Nourishing Moisturizer",
    category: "skincare",
    price: 28.00,
    images: [
      "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/8760a24f-4f94-4766-8117-3d9c004a6c6e/0E590CCD-2D95-4F05-8A37-B94A155D54C2.jpg?format=1500w",
	"https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/1d731249-6e30-4d4f-acdc-6a83f3d5e8b4/_MG_0444.jpg?format=750w",
	"https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/b57e19b8-4551-40ce-b4fc-04f1d747409a/_MG_0447_%282%29.jpg?format=750w",
	"https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/17b26792-b5fe-4fde-bc72-4e6b287cd8d5/_MG_0463.jpg?format=750w",
	"https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/8925fe1f-c03f-4518-81f9-ee0f8e1e192a/_MG_0465.jpg?format=750w"
    ],
    shades: [],
    details: {
      about: [
        "Apple Juice is a revolutionary 2-in-1 Apple Cider Vinegar toner serum that’s set to transform your skincare routine. This unique combo provides the benefits of both a toner and a serum in one easy-to-use product, giving your skin the perfect balance of care and nourishment."
      ],
      ingredients:
	"Water (Aqua), Aloe Barbadensis Leaf, Butyrospermum Parkii (Shea Butter), Mangifera Indica (Mango Butter), Jojoba Oil, Rosa Mosqueta (Rosehip Seed Oil), Cetyl Alcohol, Polysorbate 60, Glycerin, Lodopropynyl Butylcarbamate"
        
    }
  },

{
    id: "scrub-TMB",
    name: "Beet Face",
    subtitle: "Exfoliating clay Mask",
    category: "skincare",
    price: 28.00,
    images: [
   "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/0209fee1-98a0-40d2-bb49-27a7fdaaf25c/AF00CA20-B74F-48D3-AECC-18E81E67DAD9.jpg?format=1500w",
   "https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/b4fd8e24-faba-409f-8b82-65b09ac52ffe/_MG_0381.jpg?format=750w",
	"https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/ff7f3bee-e25c-4dab-8ca6-80c4268f9138/_MG_0509.jpg?format=750w",
	"https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/317b7588-c8bc-49ea-8d94-ee14c9c7fdf0/_MG_0382.jpg?format=750w",
	"https://images.squarespace-cdn.com/content/v1/6413794dadd4844648634556/b199d421-ef49-49c3-b300-3e86dc63d010/_MG_0395.jpg?format=750w"

    ],
    shades: [],
    details: {
      about: [
        "Acne removing, pore cleaning, minor scar treating, skin detoxifying, oil absorbing, mild exfoliating clay mask. "
      ],
      ingredients:
	"Kaolin Clay, Bentonite Clay, Zinc Oxide, Beta Vulgaris (Beetroot Powder)"
        
    }
  }
];