import { registerUser } from '../use-cases/registerUser.js';
import { loginUser } from '../use-cases/loginUser.js';
import { loginGoogleUser } from '../use-cases/loginGoogleUser.js';
import User from '../models/UserModels.js';
import sendEmail from '../../../utils/email.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const generatePasswordResetEmailHTML = (userName, resetUrl) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
            .email-wrapper { background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 16px; margin-bottom: 20px; }
            .message { margin: 20px 0; line-height: 1.8; }
            .reset-button-wrapper { text-align: center; margin: 30px 0; }
            .reset-button { 
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 30px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                transition: background-color 0.3s;
            }
            .reset-button:hover { background-color: #1d4ed8; }
            .divider { height: 1px; background-color: #e5e7eb; margin: 20px 0; }
            .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .warning-title { color: #92400e; font-weight: 600; margin-bottom: 5px; }
            .warning-text { color: #78350f; font-size: 14px; }
            .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
            .footer-text { margin: 0; }
            .link-text { word-break: break-all; color: #2563eb; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-wrapper">
                <div class="header">
                    <h1>🔐 Password Reset Request</h1>
                </div>
                <div class="content">
                    <p class="greeting">Hi ${userName || 'User'},</p>
                    
                    <p class="message">
                        We received a request to reset the password for your Code Practice account. If you made this request, click the button below to reset your password.
                    </p>
                    
                    <div class="reset-button-wrapper">
                        <a href="${resetUrl}" class="reset-button">Reset Password</a>
                    </div>
                    
                    <p style="text-align: center; color: #6b7280; margin-top: 20px;">
                        Or copy and paste this link in your browser:<br>
                        <span class="link-text">${resetUrl}</span>
                    </p>
                    
                    <div class="divider"></div>
                    
                    <div class="warning">
                        <div class="warning-title">⏰ Link Expires Soon</div>
                        <div class="warning-text">This password reset link will expire in <strong>10 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.</div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <p style="color: #6b7280; font-size: 13px;">
                        If you have any questions, please contact our support team at support@codepractice.com
                    </p>
                </div>
                <div class="footer">
                    <p class="footer-text">© 2024 Code Practice. All rights reserved.</p>
                    <p class="footer-text">This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // Security: Don't reveal if user exists
            return res.status(200).json({ 
                success: true, 
                message: "If an account exists with this email, you will receive a password reset link" 
            });
        }

        // Check if user is Google auth user
        if (user.authProvider === 'google') {
            return res.status(400).json({ 
                error: "This account uses Google Sign-In. Please log in with Google instead." 
            });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // FIXED: Use environment variable for frontend URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const plainTextMessage = `You requested a password reset for your Code Practice account.

Click the link below to reset your password (valid for 10 minutes):

${resetUrl}

If you didn't request this, please ignore this email and your password will remain unchanged.

Best regards,
Code Practice Team`;

        const htmlMessage = generatePasswordResetEmailHTML(user.name, resetUrl);

        try {
            await sendEmail({
                email: user.email,
                subject: ' Code Practice - Password Reset Request',
                message: plainTextMessage,
                html: htmlMessage
            });

            // Log for development
            console.log(` Password Reset Email Sent to: ${user.email}`);
            console.log(` Reset Token: ${resetToken}`);
            console.log(` Reset URL: ${resetUrl}`);
            console.log(` Token expires at: ${new Date(user.resetPasswordExpire).toLocaleString()}`);

            res.status(200).json({ 
                success: true, 
                message: `Password reset link has been sent to ${user.email}. Please check your email.` 
            });
            
        } catch (emailError) {
            console.error(" Email Send Error:", emailError);
            
            // Clear reset token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ 
                error: "Failed to send password reset email. Please try again later." 
            });
        }
        
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        
        // Validate password
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                error: "Password must be at least 6 characters long" 
            });
        }

        // Hash the token from URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                error: "Invalid or expired reset token. Please request a new password reset." 
            });
        }

        // Set new password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        console.log(` Password reset successful for: ${user.email}`);

        res.status(200).json({
            success: true,
            message: " Password reset successful! You can now log in with your new password."
        });
        
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
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

// Verify password reset token validity
export const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ 
                valid: false,
                error: "Token is required" 
            });
        }

        // Hash the token from URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                valid: false,
                error: "Invalid or expired reset token. Please request a new password reset." 
            });
        }

        // Token is valid
        console.log(`\ Reset token verified for: ${user.email}`);
        res.status(200).json({
            valid: true,
            message: "Token is valid",
            email: user.email
        });

    } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(500).json({ 
            valid: false,
            error: "Server error. Please try again later." 
        });
    }
};
export const me = async (req, res) => {
    const { _id: id, name, email, role, isActive, createdAt } = req.user;
    res.json({ id, name, email, role, isActive, createdAt });
};