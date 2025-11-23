import User from "../models/UserModels.js";

export const createUser = async (userObj) => {
    const user = new User(userObj);
    return await user.save();
};
export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};
export const findUserById = async (id) => {
    return await User.findById(id).select("-password");
};
