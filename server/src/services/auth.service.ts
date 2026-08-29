import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { generateAccessToken } from "../utils/jwt.js";
import type { RegisterInput } from "../validations/auth.validation.js";

export const register = async (input: RegisterInput) => {
  const existingUser = await User.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "An account with this email already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id.toString());

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      timezone: user.timezone,
      createdAt: user.createdAt,
    },
    accessToken,
  };
};