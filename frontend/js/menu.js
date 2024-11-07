document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, attempting to fetch menu items...');
    // Duff blame
    let userId = sessionStorage.getItem('userId');
    if (!userId) {
        userId = await getUserId();
    }
    fetchMenuItems()
        .then(displayMenuItems)
        .catch(handleError);
    // Duff blame
    fetchCartData(userId)
        .then(cartData => {
            const cartCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
            updateCartCount(cartCount);
        })
        .catch(handleCartCountError);
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
            sessionStorage.setItem('userId', userId);
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
    const userId = sessionStorage.getItem('userId'); //added duff
    try {
        console.log(`Attempting to add ${itemName} to cart with itemId: ${itemId}, userId: ${userId}`);
        
        const cartItemData = createCartItemData(userId, itemId, itemName, itemPrice);
        const response = await sendAddToCartRequest(cartItemData);

        handleCartResponse(response, itemName);

        // Update cart count in the UI immediately
        incrementCartCount();

        // Optionally, fetch the updated cart data to ensure accuracy
        const cartData = await fetchCartData(userId);
        const cartCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
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
    window.location.href = '/cart'; 
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

/*

document.addEventListener('DOMContentLoaded', async () => { // duff change it to async ffucn
    console.log('Page loaded, attempting to fetch menu items...');
    //added duff
    let userId = sessionStorage.getItem('userId');
    fetchMenuItems()
        .then(displayMenuItems)
        .catch(handleError);
    // added duff
    fetchCartData(userId)

        .then(cartData => {
            const cartCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
            updateCartCount(cartCount);
        })
        .catch(handleCartCountError);
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
    userId = sessionStorage.getItem('userId');
    try {
        console.log(`Attempting to add ${itemName} to cart with itemId: ${itemId}, userId: ${userId}`);
        
        const cartItemData = createCartItemData(userId, itemId, itemName, itemPrice);
        const response = await sendAddToCartRequest(cartItemData);

        handleCartResponse(response, itemName);

        // Update cart count in the UI immediately
        incrementCartCount();

        // Optionally, fetch the updated cart data to ensure accuracy
        const cartData = await fetchCartData(userId);
        const cartCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
        updateCartCount(cartCount);

    } catch (error) {
        console.log('Error adding item to cart:', error);
        handleCartError(error);
    }
}

let userId = sessionStorage.getItem('userId');
if (!userId) {
    userId = getUserId();
}
// Function to retrieve user ID (can be updated to dynamically fetch the user ID)
async function getUserId() {
    let response = await fetch('/api/user-info');
    let data = await response.json();
    let userId = data.userId;
    sessionStorage.setItem('userId', userId);
    return userId;
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


// show cart button
function goToCart() {
    window.location.href = '/cart'; 
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

*/