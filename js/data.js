/* js/data.js - Sample Data & LocalStorage Management */

const INITIAL_PRODUCTS = [
    {
        id: 101,
        name: "Wireless Noise-Canceling Headphones",
        category: "Electronics",
        price: 199.99,
        stock: 15,
        rating: 4.8,
        description: "Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },
    {
        id: 102,
        name: "Minimalist Smart Watch",
        category: "Electronics",
        price: 149.50,
        stock: 8,
        rating: 4.5,
        description: "Sleek fitness and lifestyle smartwatch featuring heart rate monitoring, sleep tracking, customizable watch faces, and water resistance.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 103,
        name: "Classic Denim Jacket",
        category: "Fashion",
        price: 79.99,
        stock: 20,
        rating: 4.6,
        description: "Timeless button-down denim jacket crafted from durable 100% cotton with button flap chest pockets and a comfortable modern fit.",
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600"
    },
    {
        id: 104,
        name: "Pro Performance Running Shoes",
        category: "Shoes",
        price: 119.00,
        stock: 12,
        rating: 4.7,
        description: "Lightweight, breathable mesh running shoes engineered with responsive cushioning for maximum energy return and support.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 105,
        name: "Vintage Canvas Backpack",
        category: "Accessories",
        price: 54.99,
        stock: 18,
        rating: 4.4,
        description: "Spacious and durable travel backpack with a padded laptop compartment, multiple storage pockets, and genuine leather accents.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
    },
    {
        id: 106,
        name: "Ergonomic Desk Lamp",
        category: "Home",
        price: 45.00,
        stock: 25,
        rating: 4.3,
        description: "Modern LED desk lamp with touch controls, adjustable color temperatures, brightness levels, and an integrated Qi wireless charging pad.",
        image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600"
    },
    {
        id: 107,
        name: "Organic Hydrating Serum",
        category: "Beauty",
        price: 38.50,
        stock: 30,
        rating: 4.9,
        description: "Nourishing facial serum infused with natural botanical extracts and hyaluronic acid for deep hydration and radiance.",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600"
    },
    {
        id: 108,
        name: "Bluetooth Portable Speaker",
        category: "Electronics",
        price: 89.99,
        stock: 10,
        rating: 4.6,
        description: "Compact waterproof Bluetooth speaker delivering 360-degree high-fidelity audio with deep bass and up to 18 hours of playtime.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
    },
    {
        id: 109,
        name: "Casual Cotton Crewneck T-Shirt",
        category: "Fashion",
        price: 24.99,
        stock: 40,
        rating: 4.2,
        description: "Soft, breathable premium combed cotton tee featuring a classic fit and durable double-stitched hems.",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600"
    },
    {
        id: 110,
        name: "Polarized Retro Sunglasses",
        category: "Accessories",
        price: 29.99,
        stock: 22,
        rating: 4.5,
        description: "Stylish UV400 protection polarized sunglasses with lightweight cellulose acetate frames and scratch-resistant lenses.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    },
    {
        id: 111,
        name: "Ceramic Minimalist Plant Pots",
        category: "Home",
        price: 34.99,
        stock: 14,
        rating: 4.7,
        description: "Elegantly designed matte ceramic indoor planters with drainage holes and natural bamboo saucers.",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600"
    },
    {
        id: 112,
        name: "Leather Urban Sneakers",
        category: "Shoes",
        price: 95.00,
        stock: 9,
        rating: 4.6,
        description: "Handcrafted full-grain leather sneakers blending street-style aesthetics with day-long comfort.",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600"
    }
];

const INITIAL_USERS = [
    { email: "admin@shop.com", password: "admin123", role: "admin", name: "System Admin" },
    { email: "user@shop.com", password: "user123", role: "user", name: "John Doe" }
];

function initData() {
    if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }
    if (!localStorage.getItem("orders")) {
        localStorage.setItem("orders", JSON.stringify([]));
    }
}

function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container position-fixed bottom-0 end-0 p-3";
        container.style.zIndex = "1090";
        document.body.appendChild(container);
    }

    const toastId = "toast-" + Date.now();
    const bgClass = type === "danger" ? "bg-danger text-white" : (type === "warning" ? "bg-warning text-dark" : "bg-dark text-white");

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 show shadow-lg" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${type === 'danger' ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2"></i> ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", toastHTML);

    setTimeout(() => {
        const el = document.getElementById(toastId);
        if (el) el.remove();
    }, 3000);
}

initData();