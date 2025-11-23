import {validationResult} from 'express-validator';
import { registerUser } from '../use-cases/registerUser.js';
import { loginUser } from '../use-cases/loginUser.js';
import { generateToken } from '../../../utils/token.js';



export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name, email, password, role} = req.body;
        const user = await registerUser({name, email, password, role});
        const token = generateToken({sub: user.id, role: user.role, email: user.email});

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
