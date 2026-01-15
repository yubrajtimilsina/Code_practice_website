import { verifyGoogleToken } from '../../../utils/googleAuth.js';
import User from '../models/UserModels.js';
import generateToken from '../../../utils/token.js';
import SystemSettings from '../../superAdmin/models/SystemSettingsModel.js';

export const loginGoogleUser = async (credential) => {
    const payload = await verifyGoogleToken(credential);
    const { email, name, sub: googleId, picture: avatar } = payload;

    let user = await User.findOne({ email });

    if (user) {
        if (!user.googleId) {
            user.googleId = googleId;
            
            if (!user.avatar) user.avatar = avatar;
            await user.save();
        }
    } else {
      
        const settings = await SystemSettings.findOne();
        if (settings && !settings.allowRegistration) {
            const error = new Error('New account creation is currently disabled');
            error.statusCode = 403;
            throw error;
        }

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
