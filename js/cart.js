/* js/cart.js - Cart Management */

function addToCart(productId, quantity = 1) {
    const products = getProducts();
    const product = products.find(p => p.id === Number(productId));

    if (!product) {
        showToast("Product not found!", "danger");
        return;
    }

    if (product.stock < quantity) {
        showToast("Not enough stock available!", "warning");
        return;
    }

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === Number(productId));

    if (existingIndex > -1) {
        if (cart[existingIndex].quantity + quantity > product.stock) {
            showToast("Cannot add more than available stock!", "warning");
            return;
        }
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateNavAuthUI();
    showToast(`Added ${product.name} to cart!`);

    if (window.location.pathname.includes("cart.html")) {
        renderCartPage();
    }
}

function updateCartQuantity(productId, change) {
    let cart = getCart();
    const products = getProducts();
    const itemIndex = cart.findIndex(item => item.id === Number(productId));

    if (itemIndex > -1) {
        const product = products.find(p => p.id === Number(productId));
        const newQty = cart[itemIndex].quantity + change;

        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }

        if (product && newQty > product.stock) {
            showToast("Maximum available stock reached!", "warning");
            return;
        }

        cart[itemIndex].quantity = newQty;
        saveCart(cart);
        updateNavAuthUI();
        renderCartPage();
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== Number(productId));
    saveCart(cart);
    updateNavAuthUI();
    showToast("Item removed from cart", "warning");
    renderCartPage();
}

function renderCartPage() {
    const cartContainer = document.getElementById("cart-items-list");
    const summaryContainer = document.getElementById("cart-summary");

    if (!cartContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5 my-4">
                <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                <h4 class="fw-bold">Your cart is empty</h4>
                <p class="text-muted">Looks like you haven't added anything yet.</p>
                <a href="products.html" class="btn btn-primary rounded-pill mt-2 px-4">Start Shopping</a>
            </div>
        `;
        if (summaryContainer) summaryContainer.innerHTML = '';
        return;
    }

    let subtotal = 0;
    let cartHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        cartHTML += `
            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-3 col-md-2">
                            <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                        </div>
                        <div class="col-9 col-md-4">
                            <span class="badge bg-light text-dark mb-1">${item.category}</span>
                            <h6 class="fw-bold mb-1">${item.name}</h6>
                            <p class="text-muted small mb-0">$${item.price.toFixed(2)} each</p>
                        </div>
                        <div class="col-6 col-md-3 mt-3 mt-md-0">
                            <div class="input-group input-group-sm quantity-control" style="width: 110px;">
                                <button class="btn btn-outline-secondary" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                                <input type="text" class="form-control text-center bg-white" value="${item.quantity}" readonly>
                                <button class="btn btn-outline-secondary" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <div class="col-4 col-md-2 text-end mt-3 mt-md-0 fw-bold fs-5">
                            $${itemTotal.toFixed(2)}
                        </div>
                        <div class="col-2 col-md-1 text-end mt-3 mt-md-0">
                            <button class="btn btn-link text-danger p-0" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = cartHTML;

    const shipping = subtotal > 100 ? 0 : 15.00;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="card border-0 shadow-sm p-3">
                <h5 class="fw-bold mb-3">Order Summary</h5>
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Subtotal</span>
                    <span class="fw-bold">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Estimated Shipping</span>
                    <span>${shipping === 0 ? '<span class="text-success fw-bold">FREE</span>' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <span class="text-muted">Tax (8%)</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-4">
                    <span class="fw-bold fs-5">Total</span>
                    <span class="fw-bold fs-5 text-primary">$${grandTotal.toFixed(2)}</span>
                </div>
                <a href="checkout.html" class="btn btn-primary btn-lg rounded-pill w-100 fw-bold">
                    Proceed to Checkout <i class="fas fa-arrow-right ms-2"></i>
                </a>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("cart.html")) {
        renderCartPage();
    }
});