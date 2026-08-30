import { Memory } from "../models/memory.model.js";
import { ApiError } from "../utils/api-error.js";

interface GetMemoriesOptions {
  page: number;
  limit: number;
  category?: string;
  mood?: string;
}

export const createMemory = async (
  userId: string,
  input: any
) => {
  const memory = await Memory.create({
    userId,
    ...input,
  });

  return memory;
};

export const getMemories = async (
  userId: string,
  options: GetMemoriesOptions
) => {
  const { page, limit, category, mood } = options;

  const filter: Record<string, unknown> = {
    userId,
  };

  if (category) {
    filter.category = category;
  }

  if (mood) {
    filter.mood = mood;
  }

  const skip = (page - 1) * limit;

  const [memories, total] = await Promise.all([
    Memory.find(filter)
      .sort({ eventDate: -1 })
      .skip(skip)
      .limit(limit),

    Memory.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    memories,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getMemoryById = async (
  userId: string,
  memoryId: string
) => {
  const memory = await Memory.findOne({
    _id: memoryId,
    userId,
  });

  if (!memory) {
    throw new ApiError(
      404,
      "Memory not found"
    );
  }

  return memory;
};

export const updateMemory = async (
  userId: string,
  memoryId: string,
  input: Record<string, unknown>
) => {
  const memory = await Memory.findOneAndUpdate(
    {
      _id: memoryId,
      userId,
    },
    {
      $set: input,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!memory) {
    throw new ApiError(
      404,
      "Memory not found"
    );
  }

  return memory;
};
export const deleteMemory = async (
  userId: string,
  memoryId: string
) => {
  const memory = await Memory.findOneAndDelete({
    _id: memoryId,
    userId,
  });

  if (!memory) {
    throw new ApiError(
      404,
      "Memory not found"
    );
  }

  return memory;
};