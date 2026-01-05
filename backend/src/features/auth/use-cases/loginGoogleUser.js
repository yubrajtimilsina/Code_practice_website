import { verifyGoogleToken } from '../../../utils/googleAuth.js';
import User from '../models/UserModels.js';
import generateToken from '../../../utils/token.js';

export const loginGoogleUser = async (credential) => {
    const payload = await verifyGoogleToken(credential);
    const { email, name, sub: googleId, picture: avatar } = payload;

    let user = await User.findOne({ email });

    if (user) {
        // Build link googleId if not present (optional, but good practice)
        if (!user.googleId) {
            user.googleId = googleId;
            // If user was local, we *could* switch provider or allow both. 
            // For now, let's just save the googleId.
            // If we want to support multiple providers, we might need array. 
            // Simplified: update avatar if missing
            if (!user.avatar) user.avatar = avatar;
            await user.save();
        }
    } else {
        // Create new user
        user = await User.create({
            name,
            email,
            googleId,
            avatar,
            authProvider: 'google',
            password: '', // Dummy or empty since validation is conditional
            isActive: true
        });
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
        solvedProblemsCount: user.solvedProblemsCount,
        totalSubmissionsCount: user.totalSubmissionsCount,
    };
};
