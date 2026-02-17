"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.getMyOrders = exports.getOrderById = exports.addOrderItems = void 0;
const Order_1 = __importDefault(require("../models/Order"));
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, pickupDetails, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, } = req.body;
        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }
        else {
            const order = new Order_1.default({
                orderItems,
                user: req.user._id,
                shippingAddress,
                pickupDetails,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });
            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.addOrderItems = addOrderItems;
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id).populate('user', 'name email');
        if (order) {
            // Check if user is admin or order owner
            if (req.user.role === 'admin' || order.user._id.equals(req.user._id)) {
                res.json(order);
            }
            else {
                res.status(401);
                throw new Error('Not authorized to view this order');
            }
        }
        else {
            res.status(404);
            throw new Error('Order not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderById = getOrderById;
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order_1.default.find({ user: req.user._id });
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyOrders = getMyOrders;
// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order_1.default.find({}).populate('user', 'id name');
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
};
exports.getOrders = getOrders;
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order_1.default.findById(req.params.id);
        if (order) {
            order.status = status;
            if (status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = new Date();
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }
        else {
            res.status(404);
            throw new Error('Order not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
