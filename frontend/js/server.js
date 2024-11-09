const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Set up Nodemailer transporter (using SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password' // Replace with your email password or app-specific password
    }
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    // Compose email
    const mailOptions = {
        from: email,
        to: 'youremail@example.com', // Replace with your email
        subject: 'New Message from Contact Us Form',
        html: `<h2>Message from Contact Us Form</h2>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong><br>${message}</p>`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Failed to send email.' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
