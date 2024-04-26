const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51KSM5GFI0NZFGYt9blIqyFFmGGidjdMS3RfoWGaZU3DDx7uCPmhNJ8AeAxoUB2RayaOtfYUlos8uolLsFenIA3zp00EYRUH2Je');
const cors = require('cors');

app.use(express.json());
app.use(cors()); 

let users = [
    { id: 1, userName: "Matija", password: "lala123!", profession: "Doctor", favoriteAnimal: "Dragon" },
    { id: 2, userName: "Boris", password: "baba123!", profession: "Electrician", favoriteAnimal: "Cat" }
];

app.post('/login', (req, res) => {
    const { userName, password } = req.body;
    // Find the user in the array
    const user = users.find(user => user.userName === userName && user.password === password);
    if (user) {
        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.post('/register', (req, res) => {
    const { userName, password, profession, favoriteAnimal } = req.body;
    // Check if the username already exists
    const existingUser = users.find(user => user.userName === userName);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    // Generate a new user ID
    const newUserId = users.length + 1;
    const newUser = { id: newUserId, userName, password, profession, favoriteAnimal };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
});

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,  
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

app.post('/get-user/:userId', (req, res) => {
    const userId = req.params.userId; // Extract userId from params
    const user = users.find(user => user.id == userId); // Use loose comparison

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
});

app.put('/edit-profile-info/:userId', async (req, res) => {
    const userId = req.params.userId; // Extract userId from params
    const { userName, password, profession, favoriteAnimal } = req.body;

    try {
        // Find the user with the given userId
        const userIndex = users.findIndex(user => user.id == userId); // Use loose comparison

        // If the user is not found, return a 404 error
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's profile information
        users[userIndex].userName = userName;
        users[userIndex].password = password;
        users[userIndex].profession = profession;
        users[userIndex].favoriteAnimal = favoriteAnimal;

        // Respond with a success message and the updated user object
        res.status(200).json({ message: 'Profile information updated successfully', user: users[userIndex] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile information' });
    }
});





{/* app.post('/add-user', (req, res) => {
    const { userName, profession, favoriteAnimal } = req.body;

    const newUser = {
        userName: userName,
        profession: profession,
        favoriteAnimal: favoriteAnimal
    };

    users.push(newUser);

    // Respond with a success message and the newly added user object
    res.status(200).json({ message: 'User added successfully', user: newUser });
});

// Endpoint to get all users
app.get('/get-users', (req, res) => {
    // Respond with the array of user objects
    res.status(200).json(users);
}); */}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
