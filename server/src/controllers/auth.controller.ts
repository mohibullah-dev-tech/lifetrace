import { Request, Response } from "express";
import { register } from "../services/auth.service.js";
import { ApiResponse } from "../utils/api-response.js";
import type { RegisterInput } from "../validations/auth.validation.js";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await register(req.body as RegisterInput);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        result,
        "Account created successfully"
      )
    );
};