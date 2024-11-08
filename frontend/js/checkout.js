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

// Function to fetch cart data from the backend
async function fetchCartData() {
    const userId = localStorage.getItem('userId');
    try {
        const response = await fetch(`/api/cart/view-cart/${userId}`);
        if (!response.ok) {
            throw new Error(`Error fetching cart data: ${response.statusText}`);
        }
        
        const cartData = await response.json();
        displayCart(cartData.items, cartData.totalAmount);
    } catch (error) {
        console.error("Error retrieving cart data:", error);
    }
}

// Function to display cart data on the checkout page
function displayCart(cartItems, totalAmount) {
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalElement = document.getElementById('order-total');

    orderItemsContainer.innerHTML = ''; // Clear any existing items

    // Render each item in the cart
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('order-item');
        itemElement.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>₱${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    // Display the total amount
    orderTotalElement.textContent = `₱${totalAmount.toFixed(2)}`;
}

// Redirect to the cart page
function goToCart() {
    window.location.href = '/cart';
}

// Confirm checkout
function confirmCheckout() {
    //check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Please log in to proceed to checkout.');
        return;
    }
    alert('Checkout confirmed! Proceeding to order processing.');
    // You could add further logic here, like redirecting to a confirmation page
    // or sending the final cart details to your backend.
}

// Fetch and display cart data on page load
document.addEventListener('DOMContentLoaded', fetchCartData);
