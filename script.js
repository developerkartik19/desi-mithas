// Product Data - Easy to expand or pull from an API
const products = [
    {
        id: 1,
        name: 'Thekua Gift Box',
        price: 799,
        weight: '800 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 2,
        name: 'Dry Fruits Thekua',
        price: 449,
        weight: '500 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 3,
        name: 'Traditional Thekua',
        price: 299,
        weight: '500 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 4,
        name: 'Sesame Thekua',
        price: 349,
        weight: '400 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 5,
        name: 'Honey Thekua',
        price: 399,
        weight: '500 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 6,
        name: 'Jaggery Thekua',
        price: 379,
        weight: '450 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 7,
        name: 'Coconut Thekua',
        price: 429,
        weight: '500 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 8,
        name: 'Nut Mix Thekua',
        price: 499,
        weight: '600 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 9,
        name: 'Multigrain Thekua',
        price: 449,
        weight: '500 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 10,
        name: 'Dates & Walnut Thekua',
        price: 549,
        weight: '550 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 11,
        name: 'Cardamom Thekua',
        price: 419,
        weight: '450 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    },
    {
        id: 12,
        name: 'Premium Assorted Thekua',
        price: 699,
        weight: '800 gm',
        rating: 0,
        reviews: 0,
        image: 'https://desimithaas.vercel.app/thekua-placeholder.svg'
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateActiveNavLink();
    setupMobileMenu();
    setupSearchBar();
    setupCartIcon();
    setupButtons();
});

// Render products to the grid
function renderProducts(limit = 6) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Get all products or limit based on page type
    const productsToShow = products.slice(0, limit);

    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <p class="product-name">${product.name}</p>
                <div class="product-rating">
                    <span>⭐</span> ${product.rating} (${product.reviews})
                </div>
                <p class="product-price">₹${product.price}</p>
                <p class="product-weight">${product.weight}</p>
                <div class="product-actions">
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                    <button onclick="buyNow(${product.id})">Buy Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

// Buy now functionality
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Clear cart and add only this product
    cart = [{
        ...product,
        quantity: 1
    }];
    
    saveCart();
    goToCheckout();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (count > 0) {
        cartIcon.textContent = `🛒 (${count})`;
    } else {
        cartIcon.textContent = '🛒';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #D4531F;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navigate to checkout (you can create a checkout.html page)
function goToCheckout() {
    window.location.href = 'checkout.html';
}

// Update active navigation link
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!toggle || !nav) return;
    
    toggle.addEventListener('click', () => {
        nav.classList.toggle('mobile-visible');
    });
    
    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('mobile-visible');
        });
    });
}

// Search functionality
function setupSearchBar() {
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase();
        if (query.trim() === '') {
            showNotification('Please enter a search term');
            return;
        }
        
        // In a real application, you would filter products or navigate to search results
        const filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(query)
        );
        
        if (filteredProducts.length === 0) {
            showNotification('No products found matching your search');
        } else {
            showNotification(`Found ${filteredProducts.length} product(s)`);
            // You could also navigate to a search results page
        }
    };
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// Setup cart icon click
function setupCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    cartIcon.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
        } else {
            goToCheckout();
        }
    });
    
    // Initialize cart count on page load
    updateCartCount();
}

// Setup main CTA buttons
function setupButtons() {
    // Shop Now buttons
    const shopNowButtons = document.querySelectorAll('.btn-primary');
    shopNowButtons.forEach(btn => {
        if (btn.textContent.includes('Shop Now') || btn.textContent.includes('Start Shopping')) {
            btn.addEventListener('click', () => {
                window.location.href = 'products.html';
            });
        }
    });
    
    // Learn More buttons
    const learnMoreButtons = document.querySelectorAll('.btn-secondary');
    learnMoreButtons.forEach(btn => {
        if (btn.textContent.includes('Learn More')) {
            btn.addEventListener('click', () => {
                window.location.href = 'about.html';
            });
        }
    });
    
    // View All Products button
    const viewAllBtn = document.querySelector('.view-all-container .btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = 'products.html';
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Function to render all products (for products page)
function renderAllProducts() {
    renderProducts(products.length);
}

// Export functions for global access (useful for inline onclick handlers)
window.addToCart = addToCart;
window.buyNow = buyNow;
window.goToCheckout = goToCheckout;
window.renderAllProducts = renderAllProducts;
window.renderProducts = renderProducts;

// Utility function to filter products (can be used in products page)
function filterProducts(category) {
    // This can be expanded based on your product categorization
    return products;
}

// Utility function to sort products
function sortProducts(sortBy) {
    const sorted = [...products];
    
    if (sortBy === 'price-low') {
        return sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        return sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
        return sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
        return sorted.reverse();
    }
    
    return sorted;
}

// Export utility functions
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
