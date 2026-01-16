import bcrypt from "bcryptjs";
import { findUserByEmail } from "../repository/userRepository.js";
import generateToken from '../../../utils/token.js';
import SystemSettings from '../../superAdmin/models/SystemSettingsModel.js';

export const loginUser = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Check for maintenance mode
    const settings = await SystemSettings.findOne();
    if (settings?.maintenanceMode && user.role !== "super-admin") {
        const error = new Error("Maintenance");
        error.statusCode = 503;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    };
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        solvedProblemsCount: user.solvedProblemsCount,
        totalSubmissionsCount: user.totalSubmissionsCount,
    };
};

