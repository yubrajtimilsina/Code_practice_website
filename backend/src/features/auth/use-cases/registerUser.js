import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../repository/userRepository.js';
import generateToken from '../../../utils/token.js';
import SystemSettings from '../../superAdmin/models/SystemSettingsModel.js';

const validRoles = ["learner", "admin", "super-admin"];

export const registerUser = async ({ name, email, password, role = "learner" }) => {
    // Check if registration is allowed
    const settings = await SystemSettings.findOne();
    if (settings && !settings.allowRegistration) {
        const error = new Error('Registration is currently disabled by the administrator');
        error.statusCode = 403;
        throw error;
    }

    // Validate required fields
    if (!name || !email || !password) {
        const error = new Error('Name, email, and password are required');
        error.statusCode = 400;
        throw error;
    }

    // Validate role if provided
    if (role && !validRoles.includes(role)) {
        const error = new Error('Invalid role specified');
        error.statusCode = 400;
        throw error;
    }

    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400;
        throw error;
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
        name,
        email: email.toLowerCase(),
        password: hashed,
        role: role || "learner",
        isActive: true,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        token: generateToken(user._id),
        solvedProblemsCount: user.solvedProblemsCount,
        totalSubmissionsCount: user.totalSubmissionsCount,
    };
};