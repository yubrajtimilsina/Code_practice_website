import bcrypt from "bcryptjs";
import { findUserByEmail } from "../repository/userRepository.js";

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Invalid email or password");
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
    };  
};

