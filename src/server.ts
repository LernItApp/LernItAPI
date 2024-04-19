import express, { Application, Request, Response } from 'express';

const app: Application = express();

// Middleware to check server status
app.use('/status', (req: Request, res: Response) => {
    res.status(200).json({ status: 'Server is running' });
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
