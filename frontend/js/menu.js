document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, attempting to fetch menu items...');
  fetch('/api/menuItems')
      .then(response => {
          // Check if response is okay (status 200-299)
          if (!response.ok) {
              throw new Error(`Network response was not ok. Status: ${response.status}`);
          }
          return response.json();
      })
      .then(menuItems => {
          console.log('Menu items fetched successfully:', menuItems);

          const appetizersContainer = document.getElementById('appetizers-container');
          const mainsContainer = document.getElementById('mains-container');
          const dessertsContainer = document.getElementById('desserts-container');

          menuItems.forEach(item => {
              const menuItemElement = document.createElement('div');
              menuItemElement.classList.add('menu-item');

              const nameElement = document.createElement('h3');
              nameElement.textContent = item.name;

              const descriptionElement = document.createElement('p');
              descriptionElement.textContent = item.description;

              const priceElement = document.createElement('p');
              priceElement.textContent = `₱${item.price.toFixed(2)}`;

              // Create "Add to Cart" button
              const addToCartButton = document.createElement('button');
              addToCartButton.textContent = 'Add to Cart';
              addToCartButton.addEventListener('click', () => {
                  addToCart(item._id, item.name, item.price);
              });

              // Append all elements to the menu item container
              menuItemElement.appendChild(nameElement);
              menuItemElement.appendChild(descriptionElement);
              menuItemElement.appendChild(priceElement);
              menuItemElement.appendChild(addToCartButton);

              // Append to the appropriate section based on category
              if (item.category === 'Appetizer') {
                  appetizersContainer.appendChild(menuItemElement);
              } else if (item.category === 'Main') {
                  mainsContainer.appendChild(menuItemElement);
              } else if (item.category === 'Dessert') {
                  dessertsContainer.appendChild(menuItemElement);
              } else {
                  console.warn(`Unknown category "${item.category}" for item`, item);
              }
          });
      })
      .catch(error => {
          console.error('Error fetching menu items:', error);
          alert('Failed to load menu items. Please try again later.');
      });
});

// Function to add item to cart
async function addToCart(itemId, itemName, itemPrice) {
  const userId = "671c37a90b61c2029655ec95" // temporary hard coded user ID;
  
  
  try {

    console.log(`Attempting to add ${itemName} to cart with itemId: ${itemId}, userId: ${userId}`);
      const response = await fetch('/api/cart/add-to-cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              userId,
              itemId,
              name: itemName,
              price: itemPrice,
              quantity: 1 // default quantity 
          })
      });

      if (response.ok) {
          console.log(`${itemName} added to cart!`);
          alert(`${itemName} added to cart!`);
      } else {
          console.error(`Failed to add ${itemName} to cart. Response status: ${response.status}`);
          alert(`Failed to add ${itemName} to cart. Please try again.`);
      }
  } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('An error occurred. Please try again.');
  }
}
