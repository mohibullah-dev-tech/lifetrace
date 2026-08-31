import { Memory } from "../models/memory.model.js";

export const getInsights = async (userId: string) => {
  const [
    totalMemories,
    categoryStats,
    moodStats,
    topTags,
    recentMemories,
  ] = await Promise.all([
    // Total memories
    Memory.countDocuments({ userId }),

    // Category breakdown
    Memory.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    // Mood breakdown
    Memory.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $group: {
          _id: "$mood",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    // Top tags
    Memory.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]),

    // Recent memories
    Memory.find({ userId })
      .sort({
        eventDate: -1,
      })
      .limit(5)
      .select(
        "title category mood eventDate location"
      )
      .lean(),
  ]);

  return {
    totalMemories,
    categoryStats,
    moodStats,
    topTags,
    recentMemories,
  };
};