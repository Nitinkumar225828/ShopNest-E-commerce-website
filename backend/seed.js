const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Product = require('./models/productModel');
const User = require('./models/userModel');

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = [
      {
        username: 'adminuser',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        verified: true,
      },
      {
        username: 'johnuser',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        verified: true,
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        verified: false,
      },
    ];

    const createdUsers = await User.insertMany(users);

    const products = [
      {
        name: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones with 20 hours battery life.',
        price: 1499,
        stock: 25,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        numReviews: 18,
      },
      {
        name: 'Smart Watch',
        description: 'Water-resistant smartwatch with fitness tracking and notifications.',
        price: 999,
        stock: 40,
        category: 'Wearables',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
        rating: 4.2,
        numReviews: 12,
      },
      {
        name: 'Gaming Mouse',
        description: 'High-precision mouse with RGB lighting and programmable buttons.',
        price: 799,
        stock: 35,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        numReviews: 27,
      },
      {
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum laptop stand for better posture and cooling.',
        price: 499,
        stock: 15,
        category: 'Office',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        rating: 4.1,
        numReviews: 9,
      },
    ];

    await Product.insertMany(products);

    console.log('Seed data inserted successfully');
    console.log('Created users:', createdUsers.map((user) => user.username));
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
