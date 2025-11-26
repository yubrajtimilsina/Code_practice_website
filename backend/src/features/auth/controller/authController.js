import {validationResult} from 'express-validator';
import { registerUser } from '../use-cases/registerUser.js';
import { loginUser } from '../use-cases/loginUser.js';
import { generateToken } from '../../../utils/token.js';



export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(400).json({ errors: errors.array().map(e => e.msg) });
        }

        const { name, email, password, role } = req.body;
        const user = await registerUser({ name, email, password, role });
        const token = generateToken({ sub: user.id, role: user.role, email: user.email });

        res.status(201).json({ user, token });
    } catch (error) {
    
        const statusCode = error.statusCode || 400;
        const message = error.message || "Registration error";
        if (statusCode === 400 && message.toLowerCase().includes("validation")) {
            return res.status(400).json({ errors: [message] });
        }

        res.status(statusCode).json({ error: message });
    }
};
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await loginUser({email, password});
        const token = generateToken({sub: user.id, role: user.role, email: user.email});
        
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};  

export const me = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const { _id: id, name, email, role } = req.user;
        res.json({ id, name, email, role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
