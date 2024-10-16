document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/menuItems')
      .then(response => response.json())
      .then(menuItems => {
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
  
          menuItemElement.appendChild(nameElement);
          menuItemElement.appendChild(descriptionElement);
          menuItemElement.appendChild(priceElement);
  
          if (item.category === 'Appetizer') {
            appetizersContainer.appendChild(menuItemElement);
          } else if (item.category === 'Main') {
            mainsContainer.appendChild(menuItemElement);
          } else if (item.category === 'Dessert') {
            dessertsContainer.appendChild(menuItemElement);
          }
        });
      })
      .catch(error => console.error('Error fetching menu items:', error));
  });