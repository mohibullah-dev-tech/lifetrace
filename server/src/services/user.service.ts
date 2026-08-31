import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateCurrentUser = async (
  userId: string,
  input: {
    name?: string;
    avatarUrl?: string;
    bio?: string;
  }
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: input,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};