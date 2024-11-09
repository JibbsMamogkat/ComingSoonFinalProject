document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission

    // Get the form data
    const formData = new FormData(this);

    // Create an object to hold the form data
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Display loading message
    document.getElementById('statusMessage').textContent = "Sending your message...";

    // Send the form data using fetch API (AJAX)
    fetch('/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Send JSON data
        },
        body: JSON.stringify(data), // Convert data to JSON
    })
    .then(response => response.json()) // Parse JSON response
    .then(responseData => {
        if (responseData.success) {
            document.getElementById('statusMessage').textContent = "Your message has been sent successfully!";
            document.getElementById('contactForm').reset(); // Reset the form
        } else {
            document.getElementById('statusMessage').textContent = "Sorry, something went wrong. Please try again.";
        }
    })
    .catch(error => {
        document.getElementById('statusMessage').textContent = "Error sending message: " + error.message;
    });
});
