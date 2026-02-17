"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const redis_1 = __importDefault(require("../config/redis"));
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        // Check Redis Cache
        const cachedProducts = await redis_1.default.get('products');
        if (cachedProducts) {
            // console.log('Serving from Cache');
            return res.json(JSON.parse(cachedProducts));
        }
        const products = await Product_1.default.find({});
        // Set Redis Cache (Expires in 1 hour)
        await redis_1.default.setEx('products', 3600, JSON.stringify(products));
        res.json(products);
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404);
            throw new Error('Product not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, image, stockCount } = req.body;
        const product = await Product_1.default.create({
            name,
            description,
            price,
            category,
            image,
            stockCount,
            inStock: stockCount > 0
        });
        // Invalidate Cache
        await redis_1.default.del('products');
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, image, stockCount, inStock } = req.body;
        const product = await Product_1.default.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price ?? product.price;
            product.category = category || product.category;
            product.image = image || product.image;
            product.stockCount = stockCount ?? product.stockCount;
            product.inStock = inStock ?? (product.stockCount > 0);
            const updatedProduct = await product.save();
            // Invalidate Cache
            await redis_1.default.del('products');
            res.json(updatedProduct);
        }
        else {
            res.status(404);
            throw new Error('Product not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            // Invalidate Cache
            await redis_1.default.del('products');
            res.json({ message: 'Product removed' });
        }
        else {
            res.status(404);
            throw new Error('Product not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
