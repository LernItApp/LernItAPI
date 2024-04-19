"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
// Rate limiting configuration
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per minute
    message: 'Too many requests from this IP, please try again later.'
});
// Middleware to check server status
app.use('/status', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});
// Apply rate limiter to /signup route
app.use('/signup', limiter);
// Signup route
app.post('/signup', (req, res) => {
    res.status(200).json({ message: 'Successfully signed up' });
});
// Default route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
