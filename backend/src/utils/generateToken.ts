import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface TokenPayload {
    userId: string;
    role: string;
}

export const generateTokens = (res: Response, userId: string, role: string) => {
    const accessToken = jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId, role },
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        { expiresIn: '7d' }
    );

    // Set Refresh Token as HTTP-Only Cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
};
