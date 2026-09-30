/* js/auth.js - Authentication State */

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
}

function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        showToast("Logged in successfully!");
        setTimeout(() => {
            if (user.role === "admin") {
                window.location.href = "admin/dashboard.html";
            } else {
                window.location.href = "index.html";
            }
        }, 800);
        return true;
    } else {
        showToast("Invalid email or password", "danger");
        return false;
    }
}

function signup(name, email, password) {
    const users = getUsers();
    if (users.some(u => u.email === email)) {
        showToast("Email address is already registered!", "danger");
        return false;
    }
    const newUser = { name, email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    showToast("Account created successfully!");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
    return true;
}

function logout() {
    localStorage.removeItem("currentUser");
    showToast("Logged out successfully");
    const isAdmin = window.location.pathname.includes("/admin/");
    setTimeout(() => {
        window.location.href = isAdmin ? "../login.html" : "login.html";
    }, 800);
}

function updateNavAuthUI() {
    const user = getCurrentUser();
    const navAuth = document.getElementById("nav-auth-links");
    const cartBadge = document.getElementById("cart-badge-count");

    if (cartBadge) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }

    if (!navAuth) return;

    const prefix = window.location.pathname.includes("/admin/") ? "../" : "";

    if (user) {
        let adminLink = user.role === "admin" ? `<a class="dropdown-item fw-bold text-primary" href="${prefix}admin/dashboard.html"><i class="fas fa-user-shield me-2"></i>Admin Dashboard</a>` : '';
        navAuth.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-dark dropdown-toggle rounded-pill px-3" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-1"></i> ${user.name}
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                    ${adminLink}
                    <li><a class="dropdown-item" href="${prefix}orders.html"><i class="fas fa-box me-2"></i>My Orders</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</button></li>
                </ul>
            </div>
        `;
    } else {
        navAuth.innerHTML = `
            <a href="${prefix}login.html" class="btn btn-outline-dark rounded-pill me-2 px-3">Login</a>
            <a href="${prefix}signup.html" class="btn btn-primary rounded-pill px-3">Sign Up</a>
        `;
    }
}

function requireAuth(requiredRole = null) {
    const user = getCurrentUser();
    const isAdminPage = window.location.pathname.includes("/admin/");
    const loginPath = isAdminPage ? "../login.html" : "login.html";

    if (!user) {
        window.location.href = loginPath;
        return false;
    }

    if (requiredRole && user.role !== requiredRole) {
        alert("Access denied. You do not have permission to access this page.");
        window.location.href = "../index.html";
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", updateNavAuthUI);