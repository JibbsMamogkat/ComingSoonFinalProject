// State variables for cart items and total amount
let cartItems = [];
let totalAmount = 0;

// Initialize the cart when the page loads
document.addEventListener('DOMContentLoaded', loadCart);
//Duff added function blame
// Duff added this retrieves user ID from the server and stores it in localStorage
async function getUserId() {
    try {
        let response = await fetch('/api/user-info');
        let body = await response.json();
        let { userId } = body;
        if (userId) {
            localStorage.setItem('userId', userId);
        }
        return userId;
    } catch (error) {
        console.error('Error fetching user ID:', error);
        throw error;
    }
}

// Load cart data from the backend
async function loadCart() {
    const userId = localStorage.getItem('userId'); // Duff add await
    const cart = await fetchCartData(userId);
    updateCartState(cart.items);
    renderCart();
}

// Fetch cart data from the backend
async function fetchCartData(userId) {
    const response = await fetch(`/api/cart/view-cart/${userId}`);
    return await response.json();
}




// Update cart state variables
function updateCartState(items) {
    cartItems = items;
    totalAmount = calculateTotalAmount(items);
}

// Calculate the total amount for the cart
function calculateTotalAmount(items) {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

// Render the cart UI
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    
    cartItemsContainer.innerHTML = ''; // Clear current cart items

    cartItems.forEach(item => {
        cartItemsContainer.appendChild(createCartItemRow(item));
    });

    // Update the total amount display
    totalAmountElement.textContent = `₱${totalAmount.toFixed(2)}`;
}

// Get user ID (assuming it's static or retrieved this way for now)
// Create a table row for a cart item
function createCartItemRow(item) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.name}</td>
        <td>
            <input type="number" min="1" value="${item.quantity}">
        </td>
        <td>₱${item.price.toFixed(2)}</td>
        <td>₱${(item.price * item.quantity).toFixed(2)}</td>
        <td>
            <button>Remove</button>
        </td>
    `;

    setupQuantityInput(row, item);
    setupRemoveButton(row, item);

    return row;
}

// Sets up the quantity input event listener
function setupQuantityInput(row, item) {
    const quantityInput = row.querySelector('input[type="number"]');
    quantityInput.addEventListener('change', (event) => {
        updateQuantity(item.itemId, event.target.value, item.price);
    });
}

// Update quantity of an item in the cart
async function updateQuantity(itemId, quantity, price) {
    updateCartItemQuantity(itemId, quantity);
    await syncCartItemQuantityWithBackend(itemId, quantity, price);
    renderCart();
}

// Update cart state for a specific item quantity
function updateCartItemQuantity(itemId, quantity) {
    const itemIndex = cartItems.findIndex(item => item.itemId === itemId);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = parseInt(quantity);
    }
    totalAmount = calculateTotalAmount(cartItems);
}

// Sync updated quantity with the backend
async function syncCartItemQuantityWithBackend(itemId, quantity, price) {
    const userId = localStorage.getItem('userId');// Duff add await
    await fetch('/api/cart/update-cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, quantity: parseInt(quantity), price })
    });
}

// Sets up the remove button event listener
function setupRemoveButton(row, item) {
    const removeButton = row.querySelector('button');
    removeButton.addEventListener('click', () => {
        removeFromCart(item.itemId, item.price);
    });
}

// Remove an item from the cart
async function removeFromCart(itemId, price) {
    const userId = localStorage.getItem('userId'); // Duff add await
    updateCartStateAfterRemoval(itemId);
    await syncCartItemRemovalWithBackend(itemId, userId, price);
    renderCart();
}

// Update cart state after item removal
function updateCartStateAfterRemoval(itemId) {
    cartItems = cartItems.filter(item => item.itemId !== itemId);
    totalAmount = calculateTotalAmount(cartItems);
}

// Sync item removal with the backend
async function syncCartItemRemovalWithBackend(itemId, userId, price) {
    await fetch('/api/cart/remove-from-cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, price })
    });
}

// Clear the cart
document.getElementById('clear-cart-button').addEventListener('click', async () => {
    clearCartState();
    await syncCartClearWithBackend();
    renderCart();
});

// Clear cart state variables
function clearCartState() {
    cartItems = [];
    totalAmount = 0;
}

// Sync cart clearing with the backend
async function syncCartClearWithBackend() {
    const userId = localStorage.getItem('userId'); // Duff add await
    await fetch(`/api/cart/clear-cart/${userId}`, { method: 'DELETE' });
}

// Redirect to the checkout page when checkout button is clicked
document.getElementById('checkout-button').addEventListener('click', () => {
    window.location.href = '../pages/checkout.html'; // Redirect to checkout page
});
