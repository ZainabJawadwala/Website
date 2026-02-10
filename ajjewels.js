/* ============ OWNER DASHBOARD ============ */
// Add owner button (press Ctrl+Shift+O to access)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'O') {
        showRequestsDashboard();
    }
});

function showRequestsDashboard() {
    const requestsDashboard = document.getElementById('requestsDashboard');
    const requestsList = document.getElementById('requestsList');
    
    const requests = JSON.parse(localStorage.getItem('ajj_custom_requests') || '[]');
    
    if (requests.length === 0) {
        requestsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No customer requests yet</p>';
    } else {
        requestsList.innerHTML = requests.map((req, idx) => `
            <div style="background: #fff; border: 1px solid #e6e6e6; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: #d54b6b;">Request #${requests.length - idx}</h4>
                        <p><strong>Customer:</strong> ${req.customerName}</p>
                        <p><strong>Phone:</strong> <a href="tel:${req.customerPhone}">${req.customerPhone}</a></p>
                        <p><strong>Item:</strong> ${req.item || 'Not specified'}</p>
                        <p><strong>Budget:</strong> ${req.budget || 'Not specified'}</p>
                        <p><strong>Material:</strong> ${req.material}</p>
                        <p><strong>Date:</strong> ${new Date(req.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h5 style="margin: 0 0 0.8rem 0;">Requirements:</h5>
                        <div style="background: #f9f9f9; padding: 1rem; border-radius: 6px; border-left: 3px solid #e85d75; font-size: 0.95rem; line-height: 1.6;">
                            ${req.details}
                        </div>
                        <p style="font-size: 0.85rem; color: #999; margin-top: 1rem;">Order ID: ${req.orderId || 'Pending'}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    requestsDashboard.classList.remove('hidden');
}

const closeRequestsBtn = document.getElementById('closeRequests');
if (closeRequestsBtn) {
    closeRequestsBtn.addEventListener('click', () => {
        document.getElementById('requestsDashboard').classList.add('hidden');
    });
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navbar.classList.toggle('hidden');
    });

    // Close menu when a link is clicked
    const navLinks = navbar.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navbar.classList.remove('hidden');
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Copy to Clipboard for Contact Details
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.textContent;
        element.textContent = '✓ Copied!';
        setTimeout(() => {
            element.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Add click functionality to contact cards for mobile
document.querySelectorAll('.social-handle, .phone-number, .email-address').forEach(element => {
    element.addEventListener('click', function() {
        const text = this.textContent;
        copyToClipboard(text, this);
    });
    
    // Make it clear it's clickable
    element.style.cursor = 'pointer';
});

// Track product interactions
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const productCard = this.closest('.product-card');
        if (productCard) {
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = productCard.querySelector('p').textContent;
            console.log(`Interested in: ${productName} - ${productPrice}`);
        }
    });
});

// Mobile-friendly viewport height fix
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

/* ============ CUSTOMIZATION MODAL ============ */
const customizationModal = document.getElementById('customizationModal');
const customizationForm = document.getElementById('customizationForm');
const closeCustomizationBtn = document.getElementById('closeCustomization');
const cancelCustomizationBtn = document.getElementById('cancelCustomization');
let pendingItemForCustomization = null;

function showCustomizationModal(itemName, itemImg) {
    pendingItemForCustomization = { name: itemName, img: itemImg };
    document.getElementById('customItem').value = itemName;
    customizationModal.classList.remove('hidden');
    customizationForm.reset();
}

function closeCustomizationModal() {
    customizationModal.classList.add('hidden');
    pendingItemForCustomization = null;
}

if (closeCustomizationBtn) {
    closeCustomizationBtn.addEventListener('click', closeCustomizationModal);
}

if (cancelCustomizationBtn) {
    cancelCustomizationBtn.addEventListener('click', closeCustomizationModal);
}

if (customizationModal) {
    customizationModal.addEventListener('click', (e) => {
        if (e.target === customizationModal) {
            closeCustomizationModal();
        }
    });
}

// Handle customization form submission
if (customizationForm) {
    customizationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const customDetails = document.getElementById('customDetails').value;
        const customMaterial = document.getElementById('customMaterial').value;
        const customBudget = document.getElementById('customBudget').value;
        const customName = document.getElementById('customName').value;
        const customPhone = document.getElementById('customPhone').value;
        const msg = document.getElementById('customMsg');
        
        if (!customDetails.trim()) {
            msg.textContent = '❌ Please describe your requirements';
            msg.style.color = 'red';
            return;
        }
        
        // Create cart item with customization
        const cartItem = {
            name: pendingItemForCustomization.name,
            img: pendingItemForCustomization.img,
            customization: {
                details: customDetails,
                material: customMaterial,
                budget: customBudget,
                customerName: customName,
                customerPhone: customPhone,
                requestedAt: new Date().toISOString()
            }
        };
        
        // Add to cart
        cart.push(cartItem);
        saveCart();
        
        // Save request for owner
        const requests = JSON.parse(localStorage.getItem('ajj_custom_requests') || '[]');
        requests.push(cartItem.customization);
        localStorage.setItem('ajj_custom_requests', JSON.stringify(requests));
        
        msg.textContent = '✅ Request sent! Owner will contact you soon. Item added to cart.';
        msg.style.color = 'green';
        
        setTimeout(() => {
            closeCustomizationModal();
            cartPanel.classList.remove('hidden');
        }, 1500);
    });
}

/* ============ CART & PURCHASE ============ */
const cartToggleBtn = document.createElement('button');
cartToggleBtn.className = 'btn cart-toggle';
cartToggleBtn.textContent = 'Cart';
document.body.appendChild(cartToggleBtn);

const cartPanel = document.getElementById('cartPanel');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCartBtn = document.getElementById('closeCart');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutSummary = document.getElementById('checkoutSummary');
const purchaseForm = document.getElementById('purchaseForm');

let cart = JSON.parse(localStorage.getItem('ajj_cart') || '[]');

function saveCart() {
    localStorage.setItem('ajj_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
        cart.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            
            // Check if item has customization
            const hasCustom = item.customization && item.customization.details;
            const customText = hasCustom ? 
                `<div style="font-size: 0.85rem; color: #e85d75; margin-top: 0.3rem;">✓ Custom: ${item.customization.details.substring(0, 30)}...</div>` : '';
            
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="name">${item.name}</div>
                    ${customText}
                    <div class="actions">
                        <button class="btn remove-item" data-idx="${idx}">Remove</button>
                    </div>
                </div>
            `;
            cartItemsEl.appendChild(div);
        });
    }
    cartCountEl.textContent = cart.length;
}

function addToCart(name, img) {
    cart.push({ name, img });
    saveCart();
}

// add Add to Cart buttons to each product-card
document.querySelectorAll('.product-card').forEach(card => {
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-add';
    addBtn.textContent = 'Add to Cart';
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = card.querySelector('h4').textContent;
        const img = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : '';
        
        // Show customization modal instead of directly adding
        showCustomizationModal(name, img);
    });
    // place after existing .btn if present
    const details = card.querySelector('.btn');
    if (details) details.insertAdjacentElement('afterend', addBtn);
    else card.appendChild(addBtn);
});

// Cart toggle
cartToggleBtn.addEventListener('click', () => {
    cartPanel.classList.toggle('hidden');
});

if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartPanel.classList.add('hidden'));

cartItemsEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const idx = parseInt(e.target.dataset.idx, 10);
        cart.splice(idx, 1);
        saveCart();
    }
});

checkoutBtn.addEventListener('click', () => {
    // show modal with summary including customization details
    if (cart.length === 0) return alert('Cart is empty');
    
    checkoutSummary.innerHTML = cart.map((item, idx) => {
        const customHtml = (item.customization && item.customization.details) ? 
            `<div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem; padding: 0.5rem; background: #f9f9f9; border-left: 3px solid #e85d75;">
                <strong>Custom Request:</strong><br>
                ${item.customization.details}<br>
                <small style="color: #999;">Material: ${item.customization.material} | Budget: ${item.customization.budget || 'Not specified'}</small>
            </div>` : '';
        
        return `<div class="summary-item" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
            ${item.name}
            ${customHtml}
        </div>`;
    }).join('');
    
    checkoutModal.classList.remove('hidden');
});

document.getElementById('cancelPurchase').addEventListener('click', () => checkoutModal.classList.add('hidden'));

purchaseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('buyerName').value.trim();
    const phone = document.getElementById('buyerPhone').value.trim();
    const address = document.getElementById('buyerAddress').value.trim();
    
    const order = {
        orderId: 'AJJ-' + Date.now(),
        buyer: { name, phone, address },
        items: cart.slice(),
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('ajj_orders') || '[]');
    orders.push(order);
    localStorage.setItem('ajj_orders', JSON.stringify(orders));
    
    // Save all customization requests with order info
    cart.forEach(item => {
        if (item.customization && item.customization.details) {
            const request = {
                ...item.customization,
                orderId: order.orderId,
                item: item.name
            };
            const requests = JSON.parse(localStorage.getItem('ajj_custom_requests') || '[]');
            const index = requests.findIndex(r => r.customerPhone === request.customerPhone && r.requestedAt === request.requestedAt);
            if (index !== -1) {
                requests[index].orderId = order.orderId;
                localStorage.setItem('ajj_custom_requests', JSON.stringify(requests));
            }
        }
    });
    
    console.log('Order placed:', order);
    
    // Clear cart and close modal
    localStorage.removeItem('ajj_cart');
    checkoutModal.classList.add('hidden');
    cart = [];
    saveCart();
    
    alert(`✅ Order placed successfully!\n\nOrder ID: ${order.orderId}\n\nWe'll contact you soon with customization details.`);
});

renderCart();
