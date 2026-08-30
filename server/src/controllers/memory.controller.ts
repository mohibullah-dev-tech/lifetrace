import { Request, Response } from "express";
import { createMemory, getMemories, getMemoryById,updateMemory } from "../services/memory.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import type { CreateMemoryInput } from "../validations/memory.validation.js";
import type { GetMemoriesQuery } from "../validations/memory.validation.js";

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

export const getMemoriesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const query = res.locals.validated;

  const result = await getMemories(
    req.userId,
    query
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Memories fetched successfully"
      )
    );
};
export const getMemoryByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

const { id } = req.params;

if (!id || Array.isArray(id)) {
  throw new ApiError(
    400,
    "Valid memory ID is required"
  );
}

const memory = await getMemoryById(
  req.userId,
  id
);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        memory,
        "Memory fetched successfully"
      )
    );
};

export const updateMemoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new ApiError(
      400,
      "Valid memory ID is required"
    );
  }

  const memory = await updateMemory(
    req.userId,
    id,
    req.body
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        memory,
        "Memory updated successfully"
      )
    );
};