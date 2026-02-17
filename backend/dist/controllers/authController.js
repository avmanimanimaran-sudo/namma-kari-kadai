"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.refresh = exports.logout = exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            phone,
        });
        if (user) {
            const { accessToken } = (0, generateToken_1.generateTokens)(res, user._id.toString(), user.role);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const { accessToken } = (0, generateToken_1.generateTokens)(res, user._id.toString(), user.role);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
// @desc    Get new access token using refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.jwt;
        if (!refreshToken) {
            res.status(401);
            throw new Error('Not authorized, no refresh token');
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(401);
            throw new Error('User not found');
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
        res.json({ accessToken });
    }
    catch (error) {
        res.status(401);
        next(new Error('Not authorized, token failed'));
    }
};
exports.refresh = refresh;
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfile = getUserProfile;
