import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

interface JwtPayload {
  userId: string;
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(
      new ApiError(
        401,
        "Authentication required"
      )
    );

    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      JWT_ACCESS_SECRET
    ) as JwtPayload;

    req.userId = decoded.userId;

    next();
  } catch {
    next(
      new ApiError(
        401,
        "Invalid or expired access token"
      )
    );
  }
};