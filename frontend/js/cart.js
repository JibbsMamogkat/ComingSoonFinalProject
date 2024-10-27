// State variables for cart items and total amount
let cartItems = [];
let totalAmount = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

// Function to load the cart from the backend and update the state
async function loadCart() {
    const userId = "671c37a90b61c2029655ec95" // temporary hard coded user ID;
    const response = await fetch(`/api/cart/view-cart/${userId}`);
    const cart = await response.json();

    // Update state variables
    cartItems = cart.items;
    totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Update the UI with the new state
    renderCart();
}

// Function to render the cart items and total amount in the UI
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');

    cartItemsContainer.innerHTML = ''; // Clear current cart items

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity('${item.itemId}', this.value)">
            </td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>₱${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button onclick="removeFromCart('${item.itemId}')">Remove</button>
            </td>
        `;
        
        cartItemsContainer.appendChild(row);
    });

    // Update the total amount display
    totalAmountElement.textContent = `₱${totalAmount.toFixed(2)}`;
}

// Function to update quantity of an item in the cart
async function updateQuantity(itemId, quantity) {
    // Update cart state
    const itemIndex = cartItems.findIndex(item => item.itemId === itemId);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = parseInt(quantity);
        cartItems[itemIndex].totalPrice = cartItems[itemIndex].quantity * cartItems[itemIndex].price;
    }

    // Update the total amount state
    totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Sync with backend
    await fetch('/api/cart/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: parseInt(quantity) })
    });

    // Re-render the cart with updated state
    renderCart();
}

// Function to remove an item from the cart
async function removeFromCart(itemId) {
    // Update cart state
    cartItems = cartItems.filter(item => item.itemId !== itemId);

    // Update the total amount state
    totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Sync with backend
    await fetch('/api/cart/remove-from-cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
    });

    // Re-render the cart with updated state
    renderCart();
}

// Function to clear the cart
document.getElementById('clear-cart-button').addEventListener('click', async () => {
    const userId = /* Retrieve user ID */;
    
    // Clear cart state
    cartItems = [];
    totalAmount = 0;

    // Sync with backend
    await fetch(`/api/cart/clear-cart/${userId}`, { method: 'DELETE' });

    // Re-render the cart with cleared state
    renderCart();
});
