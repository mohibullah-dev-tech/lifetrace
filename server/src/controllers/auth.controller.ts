import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response.js";

export const registerUser = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        null,
        "Registration endpoint is working"
      )
    );
};