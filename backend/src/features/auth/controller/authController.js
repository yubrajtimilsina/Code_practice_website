import {validationResult} from 'express-validator';
import { registerUser } from '../use-cases/registerUser.js';
import { loginUser } from '../use-cases/loginUser.js';


export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(e => e.msg) });
        }

        const { name, email, password, role } = req.body;
        const user = await registerUser({ name, email, password, role });

        
        res.status(201).json({ 
            message: "Registration successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                token: user.token,
            },
        });
    } catch (error) {
        const statusCode = error.statusCode || 400;
        const message = error.message || "Registration failed";
        
        if (statusCode === 400 && message.toLowerCase().includes("validation")) {
            return res.status(400).json({ errors: [message] });
        }

        res.status(statusCode).json({ error: message });
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(e => e.msg) });
        }

        const { email, password } = req.body;
        const user = await loginUser({ email, password });

        
        res.json({ 
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: user.token,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const me = async (req, res) => {
    // req.user is populated by authMiddleware
    const { _id: id, name, email, role, isActive, createdAt } = req.user;
    res.json({ id, name, email, role, isActive, createdAt });
};