/* js/checkout.js - Order Processing & Redirection */

function initCheckoutPage() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    const cart = getCart();
    if (cart.length === 0) {
        showToast("Your cart is empty!", "warning");
        setTimeout(() => { window.location.href = "products.html"; }, 1000);
        return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById("cust-name").value = currentUser.name || "";
        document.getElementById("cust-email").value = currentUser.email || "";
    }

    const summaryContainer = document.getElementById("checkout-summary-list");
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        if (summaryContainer) {
            summaryContainer.insertAdjacentHTML("beforeend", `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <h6 class="my-0 small fw-bold">${item.name}</h6>
                        <small class="text-muted">Qty: ${item.quantity}</small>
                    </div>
                    <span class="text-muted small">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `);
        }
    });

    const shipping = subtotal > 100 ? 0 : 15.00;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    document.getElementById("summary-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("summary-shipping").textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
    document.getElementById("summary-tax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("summary-total").textContent = `$${grandTotal.toFixed(2)}`;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("cust-name").value.trim();
        const email = document.getElementById("cust-email").value.trim();
        const phone = document.getElementById("cust-phone").value.trim();
        const address = document.getElementById("cust-address").value.trim();
        const city = document.getElementById("cust-city").value.trim();
        const pincode = document.getElementById("cust-pincode").value.trim();
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        const products = getProducts();
        
        // Deduct inventory
        cart.forEach(cartItem => {
            const p = products.find(prod => prod.id === cartItem.id);
            if (p) {
                p.stock = Math.max(0, p.stock - cartItem.quantity);
            }
        });
        saveProducts(products);

        // Save order
        const newOrder = {
            id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            customer: { name, email, phone, address, city, pincode },
            items: cart,
            subtotal,
            shipping,
            tax,
            totalAmount: grandTotal,
            paymentMethod,
            status: "Pending"
        };

        const orders = getOrders();
        orders.unshift(newOrder);
        saveOrders(orders);

        // Clear Cart
        saveCart([]);
        updateNavAuthUI();

        showToast("Order placed successfully!");

        // Directly redirect to orders.html
        setTimeout(() => {
            window.location.href = "orders.html";
        }, 1000);
    });
}

function initMyOrdersPage() {
    const listContainer = document.getElementById("my-orders-list");
    if (!listContainer) return;

    const orders = getOrders();
    const currentUser = getCurrentUser();

    let userOrders = orders;
    if (currentUser) {
        userOrders = orders.filter(o => o.customer.email === currentUser.email);
    }

    if (userOrders.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-box-open fa-4x text-muted mb-3"></i>
                <h4 class="fw-bold">No orders found</h4>
                <p class="text-muted">You haven't placed any orders yet.</p>
                <a href="products.html" class="btn btn-primary rounded-pill mt-2 px-4">Start Shopping</a>
            </div>
        `;
        return;
    }

    let ordersHTML = '';
    userOrders.forEach(order => {
        let badgeBg = "bg-secondary";
        if (order.status === "Delivered") badgeBg = "bg-success";
        else if (order.status === "Shipped" || order.status === "Out for Delivery") badgeBg = "bg-info text-dark";
        else if (order.status === "Confirmed") badgeBg = "bg-primary";
        else if (order.status === "Pending") badgeBg = "bg-warning text-dark";
        else if (order.status === "Cancelled") badgeBg = "bg-danger";

        ordersHTML += `
            <div class="card border-0 shadow-sm mb-3">
                <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <div>
                        <span class="fw-bold text-primary me-2">${order.id}</span>
                        <small class="text-muted">| Placed on ${order.date}</small>
                    </div>
                    <span class="badge ${badgeBg}">${order.status}</span>
                </div>
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            ${order.items.map(i => `<div class="small text-muted mb-1">• ${i.name} (Qty:${i.quantity})</div>`).join('')}
                        </div>
                        <div class="col-md-4 text-md-end mt-3 mt-md-0">
                            <span class="text-muted small">Total: </span>
                            <span class="fw-bold fs-5 text-dark">$${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = ordersHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    initCheckoutPage();
    initMyOrdersPage();
});