import { Request, Response } from "express";
import { createMemory } from "../services/memory.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import type { CreateMemoryInput } from "../validations/memory.validation.js";

export const createMemoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const memory = await createMemory(
    req.userId,
    req.body as CreateMemoryInput
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        memory,
        "Memory created successfully"
      )
    );
};