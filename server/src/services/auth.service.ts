import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type {
  LoginInput,
  RegisterInput,
} from "../validations/auth.validation.js";

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

export const login = async (input: LoginInput) => {
  const user = await User.findOne({
    email: input.email,
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const userId = user._id.toString();

  const accessToken =
    generateAccessToken(userId);

  const refreshToken =
    generateRefreshToken(userId);

  user.refreshToken = refreshToken;

  await user.save();

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
    refreshToken,
  };
};
export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    timezone: user.timezone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
export const refreshAccessToken = async (
  refreshToken: string
) => {
  let payload: { userId: string };

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(
      401,
      "Invalid or expired refresh token"
    );
  }

  const user = await User.findById(
    payload.userId
  ).select("+refreshToken");

  if (!user) {
    throw new ApiError(
      401,
      "User not found"
    );
  }

  if (
    !user.refreshToken ||
    user.refreshToken !== refreshToken
  ) {
    throw new ApiError(
      401,
      "Refresh token has been revoked"
    );
  }

  const accessToken = generateAccessToken(
    user._id.toString()
  );

  return {
    accessToken,
  };
};
export const logout = async (userId: string) => {
  const user = await User.findById(userId).select(
    "+refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = null;

  await user.save();

  return null;
};