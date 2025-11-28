// Global state
let cart = [];
let menuItems = [];
let orders = [];

// DOM elements
const menuContainer = document.getElementById('menu-items');
const cartModal = document.getElementById('cart-modal');
const orderModal = document.getElementById('order-modal');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const ordersList = document.getElementById('orders-list');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    fetchOrders();
    setupEventListeners();
});

// API functions
async function fetchMenu() {
    try {
        const response = await fetch('http://localhost:5000/api/menu');
        menuItems = await response.json();
        displayMenu(menuItems);
    } catch (error) {
        console.error('Error fetching menu:', error);
        // Fallback menu data
        menuItems = [
            { _id: 1, name: 'Butter Chicken', category: 'Main Course', price: 250, description: 'Creamy tomato butter chicken', available: true },
            { _id: 2, name: 'Chicken Biryani', category: 'Rice', price: 300, description: 'Aromatic chicken biryani', available: true },
            { _id: 3, name: 'Butter Naan', category: 'Bread', price: 80, description: 'Soft butter naan', available: true },
            { _id: 4, name: 'Paneer Tikka', category: 'Starters', price: 220, description: 'Grilled paneer tikka', available: true },
            { _id: 5, name: 'Mango Lassi', category: 'Drinks', price: 60, description: 'Sweet mango lassi', available: true }
        ];
        displayMenu(menuItems);
    }
}

async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:5000/api/orders');
        orders = await response.json();
        displayOrders();
    } catch (error) {
        console.error('Error fetching orders:', error);
        orders = [];
    }
}

async function placeOrder(orderData) {
    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (response.ok) {
            alert('Order placed successfully!');
            cart = [];
            updateCartDisplay();
            orderModal.style.display = 'none';
            document.getElementById('order-form').reset();
            fetchOrders();
        }
    } catch (error) {
        alert('Error placing order. Please try again.');
    }
}

// FIXED Display functions

// function displayMenu(items) {
//     menuContainer.innerHTML = items.map(item => {
//         const itemId = item._id;
//         // const imgSrc = item.image ? `http://localhost:5000/images/${item.image}` : `https://via.placeholder.com/300x200/ff6b35/ffffff?text=${encodeURIComponent(item.name)}`;
//         const imgSrc = item.image ? `http://localhost:5000/images/${item.image}` : 'default-placeholder-url';

        
//         return `
//             <div class="menu-item ${!item.available ? 'unavailable' : ''}" data-id="${itemId}">
//                 <img src="${imgSrc}" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200/ff6b35/ffffff?text=${encodeURIComponent(this.alt)}'">
//                 <div class="menu-item-content">
//                     <h3>${item.name}</h3>
//                     <p>${item.description}</p>
//                     <div class="price">₹${item.price}</div>
//                     ${item.available ? 
//                         `<button class="add-btn" onclick="addToCart(${itemId})">
//                             <i class="fas fa-plus"></i> Add to Cart
//                         </button>` : 
//                         '<p style="color: red;">Currently Unavailable</p>'
//                     }
//                 </div>
//             </div>
//         `;
//     }).join('');
// }

function displayMenu(items) {
    menuContainer.innerHTML = items.map(item => {
        const itemId = item._id;
        const imgSrc = `http://localhost:5000/images/${item.image}`;
        
        return `
            <div class="menu-item ${!item.available ? 'unavailable' : ''}" data-id="${itemId}">
                <img src="${imgSrc}" alt="${item.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x200/ff6b35/ffffff?text=${encodeURIComponent(this.alt)}'">
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="price">₹${item.price}</div>
                    ${item.available ? 
                        `<button class="add-btn" onclick="addToCart(${itemId})">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>` : 
                        '<p style="color: red;">Currently Unavailable</p>'
                    }
                </div>
            </div>
        `;
    }).join('');
}


function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                <button class="quantity-btn" onclick="removeFromCart(${index})" style="background: #dc3545; color: white; border-color: #dc3545;">×</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString();
}

function displayOrders() {
    if (ordersList) {
        ordersList.innerHTML = orders.slice(0, 6).map(order => `
            <div class="order-card status-pending" data-id="${order._id}">
                <h4>Order #${order._id.slice(-6)}</h4>
                <p><strong>Total:</strong> ₹${order.total.toLocaleString()}</p>
                <p><strong>Items:</strong> ${order.items.length}</p>
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Status:</strong> <span style="color: #ffc107;">${order.status}</span></p>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            </div>
        `).join('') || '<p style="text-align: center; padding: 2rem;">No orders yet</p>';
    }
}

// FIXED Cart functions
function addToCart(itemId) {
    console.log('Adding to cart:', itemId); // Debug log
    const item = menuItems.find(menu => menu._id == itemId);
    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }
    
    const existingItem = cart.find(cartItem => cartItem._id == itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    console.log('Cart updated:', cart); // Debug log
    updateCartDisplay();
    showNotification(`${item.name} added to cart!`);
}

function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartDisplay();
    }
}

function removeFromCart(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Update cart modal if open
    if (cartModal.style.display === 'block') {
        displayCart();
    }
}

// Event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            const filtered = category === 'all' ? 
                menuItems : 
                menuItems.filter(item => item.category === category);
            
            displayMenu(filtered);
        });
    });

    // Cart modal trigger
    const cartLink = document.querySelector('a[href="#cart"]');
    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.style.display = 'block';
            displayCart();
        });
    }

    // Checkout button (add dynamically)
    document.addEventListener('click', (e) => {
        if (e.target.id === 'checkout-btn') {
            if (cart.length === 0) {
                alert('Cart is empty!');
                return;
            }
            cartModal.style.display = 'none';
            orderModal.style.display = 'block';
        }
    });

    // Order form
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const orderData = {
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: parseInt(cartTotal.textContent.replace(/,/g, '')),
                customerName: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                address: document.getElementById('customer-address').value,
                status: 'Pending'
            };
            placeOrder(orderData);
        });
    }

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
            orderModal.style.display = 'none';
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Initialize
showSection('home');
