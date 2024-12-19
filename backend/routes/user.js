const { Router, json } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRouter = Router();
const JWT_SECRET = "SecreteKey";

userRouter.use(json());

let users = [];

// Get all users
userRouter.get('/', (req, res) => {
    res.status(200).json({ users });
});

// Sign up
userRouter.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const userExists = users.some((user) => user.email === email);
    if (userExists) {
        return res.status(409).json({ message: "User already exists, please login" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };
    users.push(user);
    res.status(200).json({ message: "User created", user: { email: user.email } });
});

// Login
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) {
        return res.status(404).json("User does not exist, please sign up");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        const token = jwt.sign({ email: email }, JWT_SECRET);
        res.header("token", token);
        return res.status(200).json({ message: "User is logged in!", token });
    } else {
        return res.status(401).json({ message: "Password is incorrect" });
    }
});

// Auth middleware
function authMiddleware(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }
    try {
        const verifiedToken = jwt.verify(token, JWT_SECRET);
        req.email = verifiedToken.email;
        next();
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: "Invalid or expired token" });
    }
}

// Protected route
userRouter.get('/me', authMiddleware, (req, res) => {
    const email = req.email;
    const user = users.find((u) => u.email === email);
    res.status(200).json({ UserDetails: user });
});

module.exports = {
    userRouter,
};
