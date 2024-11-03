document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, attempting to fetch menu items...');
    fetchMenuItems()
        .then(displayMenuItems)
        .catch(handleError);
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

// Creates a menu item element with given details
function createMenuItemElement(item) {
    const menuItemElement = document.createElement('div');
    menuItemElement.classList.add('menu-item');

    // Create the image element and set its source to the imagePath
    const imageElement = document.createElement('img');
    imageElement.src = item.imagePath;  // Assuming item has an imagePath property

    //log if image was not found
    if (imageElement.src === 'undefined') {
        console.log('Image not found');
    }
    // imageElement.alt = item.name;       // Set alt attribute for accessibility

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
    const userId = getUserId(); // Retrieves user ID, modularized for flexibility

    try {
        console.log(`Attempting to add ${itemName} to cart with itemId: ${itemId}, userId: ${userId}`);
        
        const cartItemData = createCartItemData(userId, itemId, itemName, itemPrice);
        const response = await sendAddToCartRequest(cartItemData);

        handleCartResponse(response, itemName);
    } catch (error) {
        handleCartError(error);
    }
}

// Function to retrieve user ID (can be updated to dynamically fetch the user ID)
function getUserId() {
    return "671c37a90b61c2029655ec95"; // Temporary hard-coded user ID
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
