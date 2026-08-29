import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};