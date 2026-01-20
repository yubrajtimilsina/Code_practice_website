import { registerUser } from '../use-cases/registerUser.js';
import { loginUser } from '../use-cases/loginUser.js';
import { loginGoogleUser } from '../use-cases/loginGoogleUser.js';
import User from '../models/UserModels.js';
import sendEmail from '../../../utils/email.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message
            });

            // Log for dev testing
            console.log(`Reset Token: ${resetToken}`);
            console.log(`Reset URL: ${resetUrl}`);

            res.status(200).json({ success: true, data: "Email sent" });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ error: "Email could not be sent" });
        }
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid token" });
        }

        // Set new password
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            data: "Password Updated Success"
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};


export const register = async (req, res) => {
    try {

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
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ error: error.message });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        const user = await loginGoogleUser(credential);

        res.json({
            message: "Google login successful",
            user
        });
    } catch (error) {
        console.error("Google Login Controller Error:", error);
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ error: error.message || "Google login failed" });
    }
};

export const me = async (req, res) => {
    // req.user is populated by authMiddleware
    const { _id: id, name, email, role, isActive, createdAt } = req.user;
    res.json({ id, name, email, role, isActive, createdAt });
};