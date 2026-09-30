/* js/products.js - Product Catalog & Rendering */

function renderStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else if (rating >= i - 0.5) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-muted"></i>';
        }
    }
    return stars;
}

function createProductCard(product) {
    return `
        <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="card h-100 border-0 shadow-sm product-card">
                <div class="position-relative overflow-hidden">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <span class="position-absolute top-0 start-0 badge bg-dark m-3 rounded-pill px-3 py-2">${product.category}</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        ${renderStarRating(product.rating)}
                        <span class="small text-muted ms-1">(${product.rating})</span>
                    </div>
                    <h6 class="card-title fw-bold text-truncate mb-2" title="${product.name}">${product.name}</h6>
                    <p class="card-text text-muted small flex-grow-1">${product.description.substring(0, 75)}...</p>
                    <div class="d-flex align-items-center justify-content-between mt-3">
                        <span class="fw-bold fs-5 text-primary">$${product.price.toFixed(2)}</span>
                        <div>
                            <a href="product-details.html?id=${product.id}" class="btn btn-outline-secondary btn-sm rounded-pill me-1" title="View Details">
                                <i class="fas fa-eye"></i>
                            </a>
                            <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus me-1"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initProductsPage() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-filter");
    const sortSelect = document.getElementById("sort-select");

    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    if (categoryParam && categorySelect) {
        categorySelect.value = categoryParam;
    }
    if (searchParam && searchInput) {
        searchInput.value = searchParam;
    }

    function filterAndDisplay() {
        let products = getProducts();
        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const categoryVal = categorySelect ? categorySelect.value : 'all';
        const sortVal = sortSelect ? sortSelect.value : 'default';

        if (searchVal) {
            products = products.filter(p => p.name.toLowerCase().includes(searchVal) || p.description.toLowerCase().includes(searchVal));
        }

        if (categoryVal !== 'all') {
            products = products.filter(p => p.category.toLowerCase() === categoryVal.toLowerCase());
        }

        if (sortVal === 'price-low') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortVal === 'price-high') {
            products.sort((a, b) => b.price - a.price);
        } else if (sortVal === 'rating') {
            products.sort((a, b) => b.rating - a.rating);
        }

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5 class="fw-bold">No products found</h5>
                    <p class="text-muted">Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(p => createProductCard(p)).join('');
    }

    if (searchInput) searchInput.addEventListener("input", filterAndDisplay);
    if (categorySelect) categorySelect.addEventListener("change", filterAndDisplay);
    if (sortSelect) sortSelect.addEventListener("change", filterAndDisplay);

    filterAndDisplay();
}

function initProductDetailsPage() {
    const detailContainer = document.getElementById("product-detail-container");
    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get("id"));
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
        detailContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3 class="fw-bold">Product Not Found</h3>
                <a href="products.html" class="btn btn-primary rounded-pill mt-3">Back to Products</a>
            </div>
        `;
        return;
    }

    detailContainer.innerHTML = `
        <div class="col-md-6 mb-4">
            <div class="card border-0 shadow-sm p-2">
                <img src="${product.image}" class="img-fluid rounded" style="max-height: 480px; object-fit: cover;" alt="${product.name}">
            </div>
        </div>
        <div class="col-md-6">
            <span class="badge bg-secondary mb-2 px-3 py-2 rounded-pill">${product.category}</span>
            <h2 class="fw-bold mb-2">${product.name}</h2>
            <div class="mb-3">
                ${renderStarRating(product.rating)}
                <span class="text-muted ms-2">(${product.rating} / 5.0)</span>
            </div>
            <h3 class="text-primary fw-bold mb-3">$${product.price.toFixed(2)}</h3>
            <p class="text-secondary leading-relaxed mb-4">${product.description}</p>
            
            <div class="mb-4">
                <strong>Availability:</strong> 
                ${product.stock > 0 ? `<span class="badge bg-success-subtle text-success ms-2 px-3 py-1">In Stock (${product.stock} left)</span>` : '<span class="badge bg-danger-subtle text-danger ms-2 px-3 py-1">Out of Stock</span>'}
            </div>

            <div class="d-flex align-items-center mb-4">
                <label class="fw-bold me-3">Quantity:</label>
                <div class="input-group quantity-control" style="width: 130px;">
                    <button class="btn btn-outline-secondary" type="button" id="qty-minus">-</button>
                    <input type="text" class="form-control text-center bg-white" id="qty-input" value="1" readonly>
                    <button class="btn btn-outline-secondary" type="button" id="qty-plus">+</button>
                </div>
            </div>

            <button class="btn btn-primary btn-lg rounded-pill px-5 fw-bold" id="detail-add-btn" ${product.stock === 0 ? 'disabled' : ''}>
                <i class="fas fa-cart-plus me-2"></i> Add to Cart
            </button>
        </div>
    `;

    const qtyInput = document.getElementById("qty-input");
    document.getElementById("qty-minus").addEventListener("click", () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
    });

    document.getElementById("qty-plus").addEventListener("click", () => {
        let val = parseInt(qtyInput.value);
        if (val < product.stock) qtyInput.value = val + 1;
    });

    document.getElementById("detail-add-btn").addEventListener("click", () => {
        addToCart(product.id, parseInt(qtyInput.value));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initProductsPage();
    initProductDetailsPage();
});