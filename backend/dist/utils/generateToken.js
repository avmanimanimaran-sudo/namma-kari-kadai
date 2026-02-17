"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens = (res, userId, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
    // Set Refresh Token as HTTP-Only Cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { accessToken };
};
exports.generateTokens = generateTokens;
