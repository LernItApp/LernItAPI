"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, password } = req.body;
    // Check if required fields are provided
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'Name, username, email, and password are required' });
    }
    try {
        // Generate password hash
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Create new user
        const user = {
            name,
            username,
            email,
            password: hashedPassword // Save hashed password
        };
        // Respond with success message
        res.status(200).json({ message: 'Signup successful' });
    }
    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'An error occurred during signup' });
    }
}));
// Default route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
