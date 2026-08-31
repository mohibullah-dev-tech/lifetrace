import { Memory } from "../models/memory.model.js";
import { ApiError } from "../utils/api-error.js";
import type {
  GetMemoriesQuery,
} from "../validations/memory.validation.js";

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
  query: GetMemoriesQuery
) => {
  const {
    page = 1,
    limit = 10,
    category,
    mood,
    search,
    tag,
    from,
    to,
    sort = "-eventDate",
  } = query;

  const filter: Record<string, unknown> = {
    userId,
  };

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Mood filter
  if (mood) {
    filter.mood = mood;
  }

  // Tag filter
  if (tag) {
    filter.tags = tag;
  }

  // Search title + content
  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        content: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Date range
  if (from || to) {
    const eventDate: Record<string, Date> = {};

    if (from) {
      eventDate.$gte = new Date(from);
    }

    if (to) {
      eventDate.$lte = new Date(to);
    }

    filter.eventDate = eventDate;
  }

  const skip = (page - 1) * limit;

  const [memories, total] = await Promise.all([
    Memory.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

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