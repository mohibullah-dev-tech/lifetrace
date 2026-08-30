import { Memory } from "../models/memory.model.js";
import type { CreateMemoryInput } from "../validations/memory.validation.js";

export const createMemory = async (
  userId: string,
  input: CreateMemoryInput
) => {
  const memory = await Memory.create({
    userId,
    ...input,
  });

  return memory;
};