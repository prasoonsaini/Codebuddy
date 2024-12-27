const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import the pg library

// Import Routes
const { userRouter } = require('./routes/user');
const { codeRouter } = require('./routes/code');
const { themesRouter } = require('./routes/themes');
const { roomRouter } = require('./routes/room');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Adjust origin

// Database Configuration
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:7dsoJf6uXcQR@ep-bold-brook-a530htw6.us-east-2.aws.neon.tech/neondb?sslmode=require',
});

// Test Database Connection
pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL');
        client.release();
    })
    .catch(err => console.error('Database connection error:', err.stack));

// Example Query (Optional, for Testing)
app.get('/api/v1/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()'); // Example query to test connection
        res.status(200).json({ message: 'Database connected successfully', time: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Database query error', error: error.message });
    }
});

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/code', codeRouter);
app.use('/api/v1/themes', themesRouter);
app.use('/api/v1/room', roomRouter);

app.listen(3300, () => {
    console.log('Server running on port 3300');
});
