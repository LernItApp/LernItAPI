import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

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
app.post('/signup', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Successfully signed up' });
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
