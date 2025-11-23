import bcrypt from 'bcryptjs';

import {createUser, findUserByEmail} from '../repository/userRepository.js';

export const registerUser = async ({name, email, password, role}) => {
    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
        throw new Error('User with this email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await createUser({
        name,
        email,
        password: hashed,
        role,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,    
    };

};