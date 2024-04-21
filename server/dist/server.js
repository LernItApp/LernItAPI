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
const collection = require('./mongodb');
const app = (0, express_1.default)();
// Parse JSON bodies
app.use(express_1.default.json());
// Parse URL-encoded bodies
app.use(express_1.default.urlencoded({ extended: true }));
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
// Apply rate limiter to /login route
app.use('/login', limiter);
// Login route
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if required fields are provided
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        // Find user by email
        const user = yield collection.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Compare passwords
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        // If everything is correct, login successful
        res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
}));
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
        // Check if username or email already exists
        const existingUser = yield collection.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            let errorMessage = '';
            if (existingUser.username === username) {
                errorMessage = 'Username already exists';
            }
            else if (existingUser.email === email) {
                errorMessage = 'Email already exists';
            }
            else {
                errorMessage = 'Some other error has occurred';
            }
            return res.status(400).json({ error: errorMessage });
        }
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
        yield collection.insertMany(user);
        // Respond with success message
        res.status(200).json({ message: 'Signup successful' });
    }
    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'An error occurred during signup' });
    }
}));
app.post('/create-study-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    res.send("hey!");
}));
// Default route
app.get('/', (req, res) => {
    // for testing purposes
    const htmlContent = `
    <html><body>
    
        <h2>Sign Up</h2>
        <form action="/signup" method="post">

            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" required><br><br>

            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username" required><br><br>

            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br><br>

            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br><br>

            <input type="submit" value="Sign Up">
        </form>

        <br>

        <h2>Log In</h2>
        <form action="/login" method="post">

            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br><br>

            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br><br>

            <input type="submit" value="Log In">
        </form>

        <h2>Create</h2>
        <form action="/create-study-list" method="post">
            <input type="submit" value="Create">
        </form>
    
    </body></html>`;
    res.send(htmlContent);
});
// Start the server 
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
