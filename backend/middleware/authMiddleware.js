import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // Check for Bearer Token in headers 🔑
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from string "Bearer TOKEN"
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token and add to request
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to next controller
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed!' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token!' });
    }
};