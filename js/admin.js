/* js/admin.js - Admin Operations */

function initAdminDashboard() {
    const totalProductsEl = document.getElementById("admin-total-products");
    if (!totalProductsEl) return;

    requireAuth("admin");

    const products = getProducts();
    const orders = getOrders();
    const users = getUsers();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.totalAmount : 0), 0);

    totalProductsEl.textContent = products.length;
    document.getElementById("admin-total-orders").textContent = orders.length;
    document.getElementById("admin-total-users").textContent = users.length;
    document.getElementById("admin-total-revenue").textContent = `$${totalRevenue.toFixed(2)}`;

    const recentOrdersBody = document.getElementById("admin-recent-orders");
    if (recentOrdersBody) {
        const recent = orders.slice(0, 5);
        recentOrdersBody.innerHTML = recent.map(o => `
            <tr>
                <td class="fw-bold">${o.id}</td>
                <td>${o.customer.name}</td>
                <td>${o.date}</td>
                <td>$${o.totalAmount.toFixed(2)}</td>
                <td><span class="badge bg-primary">${o.status}</span></td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="text-center text-muted">No orders yet</td></tr>';
    }
}

function initAdminProducts() {
    const productTableBody = document.getElementById("admin-products-table");
    if (!productTableBody) return;

    requireAuth("admin");

    function renderProductsTable() {
        const products = getProducts();
        productTableBody.innerHTML = products.map(p => `
            <tr>
                <td><img src="${p.image}" class="rounded" style="width: 45px; height: 45px; object-fit: cover;"></td>
                <td class="fw-bold">${p.name}</td>
                <td><span class="badge bg-light text-dark">${p.category}</span></td>
                <td class="fw-bold text-primary">$${p.price.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="openProductModal(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    renderProductsTable();

    const productForm = document.getElementById("admin-product-form");
    if (productForm) {
        productForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("prod-id").value;
            const name = document.getElementById("prod-name").value;
            const category = document.getElementById("prod-category").value;
            const price = parseFloat(document.getElementById("prod-price").value);
            const stock = parseInt(document.getElementById("prod-stock").value);
            const rating = parseFloat(document.getElementById("prod-rating").value) || 4.5;
            const image = document.getElementById("prod-image").value || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600";
            const description = document.getElementById("prod-desc").value;

            let products = getProducts();

            if (id) {
                const index = products.findIndex(p => p.id === Number(id));
                if (index > -1) {
                    products[index] = { ...products[index], name, category, price, stock, rating, image, description };
                    showToast("Product updated successfully!");
                }
            } else {
                const newProd = { id: Date.now(), name, category, price, stock, rating, image, description };
                products.unshift(newProd);
                showToast("New product added!");
            }

            saveProducts(products);
            renderProductsTable();

            const modalEl = document.getElementById('productModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        });
    }
}

function openProductModal(id = null) {
    const form = document.getElementById("admin-product-form");
    if (!form) return;
    form.reset();

    if (id) {
        const products = getProducts();
        const p = products.find(item => item.id === Number(id));
        if (p) {
            document.getElementById("modal-title").textContent = "Edit Product";
            document.getElementById("prod-id").value = p.id;
            document.getElementById("prod-name").value = p.name;
            document.getElementById("prod-category").value = p.category;
            document.getElementById("prod-price").value = p.price;
            document.getElementById("prod-stock").value = p.stock;
            document.getElementById("prod-rating").value = p.rating;
            document.getElementById("prod-image").value = p.image;
            document.getElementById("prod-desc").value = p.description;
        }
    } else {
        document.getElementById("modal-title").textContent = "Add New Product";
        document.getElementById("prod-id").value = "";
    }

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        let products = getProducts();
        products = products.filter(p => p.id !== Number(id));
        saveProducts(products);
        showToast("Product deleted successfully", "warning");
        initAdminProducts();
    }
}

function initAdminOrders() {
    const ordersTableBody = document.getElementById("admin-orders-table");
    if (!ordersTableBody) return;

    requireAuth("admin");

    function renderOrdersTable() {
        const orders = getOrders();
        ordersTableBody.innerHTML = orders.map(o => `
            <tr>
                <td class="fw-bold">${o.id}</td>
                <td>${o.customer.name}<br><small class="text-muted">${o.customer.email}</small></td>
                <td>${o.date}</td>
                <td class="fw-bold">$${o.totalAmount.toFixed(2)}</td>
                <td>
                    <select class="form-select form-select-sm fw-bold border-secondary" onchange="updateOrderStatus('${o.id}', this.value)">
                        <option value="Pending" ${o.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Confirmed" ${o.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                        <option value="Shipped" ${o.status === "Shipped" ? "selected" : ""}>Shipped</option>
                        <option value="Out for Delivery" ${o.status === "Out for Delivery" ? "selected" : ""}>Out for Delivery</option>
                        <option value="Delivered" ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        <option value="Cancelled" ${o.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="text-center text-muted">No orders available</td></tr>';
    }

    renderOrdersTable();
}

function updateOrderStatus(orderId, newStatus) {
    let orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveOrders(orders);
        showToast(`Order ${orderId} updated to ${newStatus}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initAdminDashboard();
    initAdminProducts();
    initAdminOrders();
});