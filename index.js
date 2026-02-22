require('dotenv').config();

const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');

const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const apiProductRoutes = require('./routes/apiProductRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// DB
connectDB();

// Static
app.use(express.static('public'));

// Body parsers (formularios + JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override (PUT/DELETE desde forms)
app.use(methodOverride('_method'));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false
  })
);

// Routes
app.use(authRoutes);
app.use(productRoutes);

// Bonus API JSON
app.use('/api', apiProductRoutes);

// Redirect root
app.get('/', (req, res) => res.redirect('/products'));

// 404
app.use((req, res) => {
  res.status(404).send('404 - Not found');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));