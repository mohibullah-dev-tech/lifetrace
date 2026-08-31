import { Memory } from "../models/memory.model.js";

export const getTimeline = async (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;

  const [memories, total] = await Promise.all([
    Memory.find({ userId })
      .sort({
        eventDate: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Memory.countDocuments({ userId }),
  ]);

  const totalPages = Math.ceil(
    total / limit
  );

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