// === script.js: Global Cart Functionality (Finalized for Deletion) ===

// Global variables for cart elements
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartItemsContainer = document.getElementById('cartItems');
const cartSubtotalElement = document.getElementById('cartSubtotal');

// Cart data stored in localStorage
let cart = JSON.parse(localStorage.getItem('ilewaCart')) || [];


// --- UI FUNCTIONS ---

/**
 * Opens the cart drawer and backdrop.
 */
function openCart() {
    cartDrawer?.classList.add('open');
    cartBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

/**
 * Closes the cart drawer and backdrop.
 */
function closeCart() {
    cartDrawer?.classList.remove('open');
    cartBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Renders the list of items in the cart drawer.
 */
function renderCartItems() {
    if (!cartItemsContainer || !cartSubtotalElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your bag is currently empty.</p>';
        cartSubtotalElement.textContent = '$0.00';
        return;
    }

    let subtotal = 0;

    const itemsHTML = cart.map(item => {
        // Rely on data stored in the cart item
        const name = item.name || 'Unknown Product (Missing Data)';
        const imgUrl = item.imgUrl || 'placeholder.jpg';
        const price = item.price; 
        const lineTotal = price * item.qty;

        subtotal += lineTotal;

        // NOTE: We wrap shade in single quotes in the function call to handle spaces or special characters
        // We use || '' to ensure an empty string is passed if shade is undefined/null
        const shadeArg = item.shade ? `'${item.shade}'` : "''";

        return `
            <div class="cart-item" data-id="${item.id}" data-shade="${item.shade || ''}">
                
                <div class="item-details">
                    <div class="item-name-row">
                        <img src="${imgUrl}" alt="${name}" class="item-icon-image">
                        <p class="item-name">${name}</p>
                    </div>
                    
                    ${item.shade ? `<p class="item-shade">Shade: ${item.shade}</p>` : ''}
                    <p class="item-price">$${price.toFixed(2)}</p>
                    
                    <div class="item-quantity-controls">
                        <button onclick="changeQty('${item.id}', -1, ${shadeArg})">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty('${item.id}', 1, ${shadeArg})">+</button>
                    </div>
                </div>
                
                <button class="remove-item-btn" onclick="removeItem('${item.id}', ${shadeArg})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }).join('');

    cartItemsContainer.innerHTML = itemsHTML;
    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
}

/**
 * Saves cart data and updates the UI.
 */
function updateCartUI() {
    localStorage.setItem('ilewaCart', JSON.stringify(cart));
    renderCartItems();
}


// --- DATA MANAGEMENT FUNCTIONS ---

/**
 * Adds an item to the cart or updates quantity if it exists.
 */
function addToCart(id, quantity = 1, shade = '') {
    if (typeof products === "undefined" || !Array.isArray(products)) {
        console.error('Products data array is missing. Cannot add item.');
        alert('Could not add item. Product data is unavailable.');
        return;
    }
    
    const product = products.find(p => p.id === id);
    if (!product) {
        console.error('Product not found in data for ID:', id);
        alert('Could not add item. Invalid product ID.');
        return;
    }

    const existingIndex = cart.findIndex(item => item.id === id && item.shade === shade);

    if (existingIndex > -1) {
        cart[existingIndex].qty += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imgUrl: product.images[0],
            qty: quantity,
            shade: shade 
        });
    }

    updateCartUI();
}

/**
 * Changes the quantity of an item.
 */
function changeQty(id, delta, shade = '') {
    const existingIndex = cart.findIndex(item => item.id === id && item.shade === shade);
    if (existingIndex > -1) {
        cart[existingIndex].qty += delta;
        if (cart[existingIndex].qty <= 0) {
            // Remove item if quantity drops to zero or below
            removeItem(id, shade);
        } else {
            updateCartUI();
        }
    }
}

/**
 * Removes an item completely from the cart.
 * @param {string} id - Product ID.
 * @param {string} [shade=''] - Selected shade/variant.
 */
function removeItem(id, shade = '') {
    // CRITICAL: Filter creates a NEW array containing only items that DO NOT match the ID AND shade.
    cart = cart.filter(item => !(item.id === id && item.shade === shade));
    
    // Save the new array and update the drawer
    updateCartUI();
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Set up event listeners for opening/closing the cart
    const cartIcon = document.querySelector('.cart-icon');
    const closeBtn = document.getElementById('closeCartBtn');
    
    cartIcon?.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    closeBtn?.addEventListener('click', closeCart);
    cartBackdrop?.addEventListener('click', closeCart);

    // Hook up checkout button to go to checkout page
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn?.addEventListener('click', () => {
        closeCart?.();
        window.location.href = 'checkout.html';
    });

    // 2. Initial render of the cart contents
    renderCartItems();
});