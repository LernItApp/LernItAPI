import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
const {LoginModel, StudyListModel} = require('./mongodb');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app: Application = express();

// Parse JSON bodies
app.use(express.json())

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

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

// app.get('/login', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname + '.../build/index.html'));
//   });
  

// Apply rate limiter to /login route
app.use('/login', limiter);

// Login route
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if required fields are provided
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await LoginModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // If everything is correct, login successful
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
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
        // Check if username or email already exists
        const existingUser = await LoginModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            let errorMessage = '';
            if (existingUser.username === username) {
                errorMessage = 'Username already exists';
            } else if (existingUser.email === email) {
                errorMessage = 'Email already exists';
            } else {
                errorMessage = 'Some other error has occurred';
            }
            return res.status(400).json({ error: errorMessage });
        }

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

        await LoginModel.insertMany(user);

        // Respond with success message
        res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'An error occurred during signup' });
    }
});

// Api route to create a study list
app.post('/create-study-list', async (req: Request, res: Response) => {
    const { name, username, email, description, list } = req.body;
    console.log(req.body);

    try {
        // Generate a random ID for the new study list
        const id = uuidv4();

        // Create a new StudyList document
        const newStudyList = new StudyListModel({
            id,
            name,
            username,
            email,
            description,
            list
        });

        // Save the StudyList document to the database
        await StudyListModel.insertMany(newStudyList);

        res.status(201).json({ message: 'Study list creation successful' });
    } catch (error) {
        console.error("Error saving Study List:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/get-study-list/:id', async (req: Request, res: Response) => {
    const listId = req.params.id;

    // Get the list from the database
    const studyList = await StudyListModel.findOne({ _id: listId });
    /*
        TODO: Add the code here for this.
        1. Check if the list exists
        2. also addd the id to the list schema
        3. add error handling for not found
    */

    res.send(studyList);
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname + '/../build/index.html'));
});

// Start the server 
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
