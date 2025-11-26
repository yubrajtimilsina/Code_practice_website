import bcrypt from 'bcryptjs';

import {createUser, findUserByEmail} from '../repository/userRepository.js';

const validRoles = ["learner", "admin", "super-admin"];

export const registerUser = async ({name, email, password, role}) => {
    // Validate role explicitly
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

    const hashed = await bcrypt.hash(password, 10);

    const user = await createUser({
        name,
        email,
        password: hashed,
        role: role || "learner",
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,    
    };
};
