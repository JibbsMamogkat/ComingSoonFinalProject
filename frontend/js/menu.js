document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, attempting to fetch menu items...');
    
    let userId = sessionStorage.getItem('userId');
    if (!userId) {
        userId = await getUserId(); // Your logic for retrieving userId if needed
    }
    
    // Fetch menu items regardless of login status
    fetchMenuItems()
        .then(displayMenuItems)
        .catch(handleError);
    
    // Check if userId exists before fetching cart data
    if (userId) {
        fetchCartData(userId)
            .then(cartData => {
                const cartCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
                updateCartCount(cartCount);
            })
            .catch(handleCartCountError);
    } else {
        // User is not logged in, set cart count to 0
        updateCartCount(0);
    }
});


// Fetches menu items from the API
function fetchMenuItems() {
    return fetch('/api/menuItems')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(menuItems => {
            console.log('Menu items fetched successfully:', menuItems);
            return menuItems;
        });
}

// Duff added this retrieves user ID from the server and stores it in sessionStorage
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

// Creates a menu item element with given details
function createMenuItemElement(item) {
    const menuItemElement = document.createElement('div');
    menuItemElement.classList.add('menu-item');

    // Create the image element and set its source to the imagePath
    const imageElement = document.createElement('img');
    imageElement.src = item.imagePath;  // Assuming item has an imagePath property

    // Log if image was not found
    if (imageElement.src === 'undefined') {
        console.log('Image not found');
    }

    const nameElement = document.createElement('h3');
    nameElement.textContent = item.name;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = item.description;

    const priceElement = document.createElement('p');
    priceElement.textContent = `₱${item.price.toFixed(2)}`;

    const addToCartButton = createAddToCartButton(item);
    
    // Append the image element at the top, followed by other elements
    menuItemElement.append(imageElement, nameElement, descriptionElement, priceElement, addToCartButton);

    return menuItemElement;
}

// Creates an "Add to Cart" button for a menu item
function createAddToCartButton(item) {
    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.addEventListener('click', () => addToCart(item._id, item.name, item.price));
    return addToCartButton;
}

// Displays menu items in the appropriate container based on category
function displayMenuItems(menuItems) {
    const containers = {
        'Appetizer': document.getElementById('appetizers-container'),
        'Main': document.getElementById('mains-container'),
        'Dessert': document.getElementById('desserts-container')
    };

    menuItems.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        const container = containers[item.category];
        
        if (container) {
            container.appendChild(menuItemElement);
        } else {
            console.warn(`Unknown category "${item.category}" for item`, item);
        }
    });
}

// Handles errors during fetch or display
function handleError(error) {
    console.error('Error fetching menu items:', error);
    alert('Failed to load menu items. Please try again later.');
}

// Main function to add an item to the cart
async function addToCart(itemId, itemName, itemPrice) {
    const userId = localStorage.getItem('userId'); //added duff

    // Check if the user is logged in
    if (!userId) {
        // Show a message to the user that they need to log in first
        alert('You need to log in to add items to the cart. Redirecting you to the home page...');
        
        // Redirect to the home page or login page
        window.location.href = '/home'; // Replace with the path to your home page
        return; // Exit the function early
    }

    try {
        console.log(`Attempting to add ${itemName} to cart with itemId: ${itemId}, userId: ${userId}`);
        
        const cartItemData = createCartItemData(userId, itemId, itemName, itemPrice);
        const response = await sendAddToCartRequest(cartItemData);

        handleCartResponse(response, itemName);

        // Update cart count in the UI immediately
        incrementCartCount();

        console.log('incremented cart count');

        // Optionally, fetch the updated cart data to ensure accuracy
        const cartData = await fetchCartData(userId);
        const cartCount = cartData.items.reduce((total, item) => total + item.quantity, 0);

        console.log('cart count from fetched data from backend:', cartCount);
        updateCartCount(cartCount);

    } catch (error) {
        console.log('Error adding item to cart:', error);
        handleCartError(error);
    }
}

// Function to create cart item data for the add to cart functionality
function createCartItemData(userId, itemId, itemName, itemPrice) {
    return {
        userId,
        itemId,
        name: itemName,
        price: itemPrice,
        quantity: 1 // Default quantity
    };
}

// Function to send the add-to-cart request to the server
async function sendAddToCartRequest(cartItemData) {
    return await fetch('/api/cart/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItemData)
    });
}

// Function to handle the server response for adding to cart
function handleCartResponse(response, itemName) {
    if (response.ok) {
        console.log(`${itemName} added to cart!`);
        alert(`${itemName} added to cart!`);
    } else {
        console.error(`Failed to add ${itemName} to cart. Response status: ${response.status}`);
        alert(`Failed to add ${itemName} to cart. Please try again.`);
    }
}

// Function to handle errors during the add-to-cart process
function handleCartError(error) {
    console.error('Error adding item to cart:', error);
    alert('An error occurred. Please try again.');
}

// Show cart button
function goToCart() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('You need to log in to view your cart.');
        window.location.href = '/home/loginId313';
    } else {
        window.location.href = '/cart';
    }
}

// Function to fetch cart data for the cart count
async function fetchCartData(userId) {
    const response = await fetch(`/api/cart/view-cart/${userId}`);
    return await response.json();
}

// Function to update the cart count in the UI
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Function to handle errors during cart count update
function handleCartCountError(error) {
    console.error('Error fetching cart data for cart count:', error);
    alert('Failed to load cart data. Please try again later.');
}

// Function to increment the cart count in the UI
function incrementCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        let currentCount = parseInt(cartCountElement.textContent, 10);
        cartCountElement.textContent = currentCount + 1;
    }
}

