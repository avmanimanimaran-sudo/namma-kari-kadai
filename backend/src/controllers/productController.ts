import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import redisClient from '../config/redis';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check Redis Cache
        const cachedProducts = await redisClient.get('products');

        if (cachedProducts) {
            // console.log('Serving from Cache');
            return res.json(JSON.parse(cachedProducts));
        }

        const products = await Product.find({});

        // Set Redis Cache (Expires in 1 hour)
        await redisClient.setEx('products', 3600, JSON.stringify(products));

        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, price, category, image, stockCount } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stockCount,
            inStock: stockCount > 0
        });

        // Invalidate Cache
        await redisClient.del('products');

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, price, category, image, stockCount, inStock } = req.body;

        const product = await Product.findById(req.params.id);

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
            await redisClient.del('products');

            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();

            // Invalidate Cache
            await redisClient.del('products');

            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};
