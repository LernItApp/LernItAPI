import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';

const app: Application = express();

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per minute
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware to check server status
app.use('/status', (req: Request, res: Response) => {
    res.status(200).json({ status: 'Server is running' });
});

// Apply rate limiter to /signup route
app.use('/signup', limiter);

// Signup route
app.post('/signup', async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    // Check if required fields are provided
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'Name, username, email, and password are required' });
    }

    try {
        // Generate password hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = {
            name,
            username,
            email,
            password: hashedPassword // Save hashed password
        };

        // Respond with success message
        res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'An error occurred during signup' });
    }
});

// Default route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
