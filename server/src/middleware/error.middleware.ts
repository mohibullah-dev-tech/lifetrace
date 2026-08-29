import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });

    return;
  }

  console.error("Unhandled Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};