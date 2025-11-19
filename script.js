document.addEventListener('DOMContentLoaded', () => {

    // --- Variables ---
    let cart = [];
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartIconBtn = document.querySelector('img[alt="Cart Icon"]');
    const closeCartBtn = document.querySelector('.close-cart');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const searchInput = document.getElementById('search-input');
    const productCards = document.querySelectorAll('.products__product');

    // --- Feature 1: Better Dark/Light Mode ---
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // --- Feature 2: Search Functionality ---
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        productCards.forEach(card => {
            const title = card.querySelector('.products__product-text').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                card.style.display = 'grid'; // Show match
            } else {
                card.style.display = 'none'; // Hide mismatch
            }
        });
    });

    // --- Feature 3: Add to Cart Logic ---
    // Setup Notification Badge
    const badge = document.createElement('span');
    badge.style.cssText = `
        background-color: var(--color-red); color: white; font-size: 1.2rem;
        font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 50%;
        position: absolute; top: -5px; right: -5px; display: none; pointer-events: none;
    `;
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    cartIconBtn.parentNode.insertBefore(wrapper, cartIconBtn);
    wrapper.appendChild(cartIconBtn);
    wrapper.appendChild(badge);

    // Click Event for Products
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.products__product-text').textContent;
            const priceStr = card.querySelector('.products__prices-price').textContent;
            const price = parseFloat(priceStr.replace('$', ''));
            const imgSrc = card.querySelector('.products__product-image').src;

            addToCart({ title, price, imgSrc });
        });
    });

    function addToCart(product) {
        cart.push(product);
        updateCartUI();
    }

    function updateCartUI() {
        badge.textContent = cart.length;
        badge.style.display = cart.length > 0 ? 'block' : 'none';
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        if(cartTotalElement) cartTotalElement.textContent = total.toFixed(2);

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
            } else {
                cart.forEach((item, index) => {
                    const itemEl = document.createElement('div');
                    itemEl.classList.add('cart-item');
                    itemEl.innerHTML = `
                        <img src="${item.imgSrc}" alt="${item.title}">
                        <div class="cart-item-details">
                            <h4>${item.title}</h4>
                            <p>$${item.price.toFixed(2)}</p>
                        </div>
                        <button class="remove-btn" data-index="${index}">🗑️</button>
                    `;
                    cartItemsContainer.appendChild(itemEl);
                });
                document.querySelectorAll('.remove-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        cart.splice(e.target.getAttribute('data-index'), 1);
                        updateCartUI();
                    });
                });
            }
        }
    }

    // --- Feature 4: Modal Open/Close ---
    cartIconBtn.addEventListener('click', () => { if(cartModal) cartModal.style.display = 'block'; });
    if(closeCartBtn) closeCartBtn.addEventListener('click', () => { cartModal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target == cartModal) cartModal.style.display = 'none'; });
});