const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const routes = require('./routes/authRoutes');

dotenv.config();

connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
 

const app = express();

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('ShopNest API is running in Development mode...');
  });
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// Use the authentication routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRouters'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
