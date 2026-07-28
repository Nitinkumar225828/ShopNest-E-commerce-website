const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');

const resolveImageUrl = async (req) => {
  if (req.body && req.body.imageUrl) {
    return req.body.imageUrl;
  }

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    return result.secure_url;
  }

  return '';
};

// @desc    Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
    try {
      const productId = req.params.id;
      const productData = await Product.findById(productId);
      if (productData) {
        res.json(productData);
      } else {  
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const createProduct = async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body;
      const imageUrl = await resolveImageUrl(req);

      if (!imageUrl) {
        return res.status(400).json({ message: 'Please provide an image upload or imageUrl' });
      }

      const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category,
        imageUrl
    });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }   
  };

  const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const productId = req.params.id;
        const existingProduct = await Product.findById(productId);
        if(existingProduct) {
            existingProduct.name = name || existingProduct.name;
            existingProduct.description = description || existingProduct.description;
            existingProduct.price = price || existingProduct.price;
            existingProduct.stock = stock || existingProduct.stock;
            existingProduct.category = category || existingProduct.category;

            if (req.body.imageUrl || req.file) {
                existingProduct.imageUrl = await resolveImageUrl(req);
            }

            const updatedProduct = await existingProduct.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };

  const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const productDoc = await Product.findById(productId);
      if (productDoc) {
        await productDoc.deleteOne();
        res.json({ message: 'Product removed' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };