const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Database setup
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        createUsersTable();
    }
});

// Create users table
function createUsersTable() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table ready.');
        }
    });
}

// Validation middleware
const validateRegistration = (req, res, next) => {
    const { fullName, email, password } = req.body;
    
    // Check required fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }
    
    // Validate name
    if (fullName.length < 2 || fullName.length > 100) {
        return res.status(400).json({ 
            success: false, 
            message: 'Name must be between 2 and 100 characters' 
        });
    }
    
    // Validate email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid email address' 
        });
    }
    
    // Validate password
    if (password.length < 8) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 8 characters long' 
        });
    }
    
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must contain at least one uppercase letter' 
        });
    }
    
    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must contain at least one number' 
        });
    }
    
    next();
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running', 
        timestamp: new Date().toISOString() 
    });
});

// Get all users (for admin purposes)
app.get('/api/users', (req, res) => {
    db.all('SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error', 
                error: err.message 
            });
        }
        res.json({ 
            success: true, 
            users: rows 
        });
    });
});

// Register new user
app.post('/api/register', validateRegistration, async (req, res) => {
    const { fullName, email, password } = req.body;
    
    try {
        // Check if email already exists
        db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error', 
                    error: err.message 
                });
            }
            
            if (row) {
                return res.status(409).json({ 
                    success: false, 
                    message: 'Email already registered' 
                });
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Insert new user
            db.run(
                'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
                [fullName, email, hashedPassword],
                function(err) {
                    if (err) {
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Failed to create user', 
                            error: err.message 
                        });
                    }
                    
                    res.status(201).json({ 
                        success: true, 
                        message: 'User registered successfully',
                        userId: this.lastID,
                        user: { fullName, email }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Login endpoint (for future use)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error', 
                error: err.message 
            });
        }
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // In a real app, you would generate a JWT token here
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email
            }
        });
    });
});

// Update JavaScript to use real backend
app.get('/api/update-frontend', (req, res) => {
    res.send(`
        <script>
            // This would be added to script.js to connect to real backend
            console.log('Backend is running at http://localhost:${PORT}');
        </script>
    `);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  GET  /api/health - Health check`);
    console.log(`  GET  /api/users - Get all users (admin)`);
    console.log(`  POST /api/register - Register new user`);
    console.log(`  POST /api/login - Login user`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

module.exports = app;