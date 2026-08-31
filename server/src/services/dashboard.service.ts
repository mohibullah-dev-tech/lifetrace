import { Memory } from "../models/memory.model.js";
import { getStreak } from "./streak.service.js";

export const getDashboard = async (userId: string) => {
  const [
    totalMemories,
    recentMemories,
    categoryStats,
    moodStats,
    streak,
  ] = await Promise.all([
    Memory.countDocuments({ userId }),

    Memory.find({ userId })
      .sort({
        eventDate: -1,
        createdAt: -1,
      })
      .limit(5)
      .select(
        "title content category mood eventDate location tags"
      )
      .lean(),

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

    getStreak(userId),
  ]);

  return {
    totalMemories,
    streak,
    categoryStats,
    moodStats,
    recentMemories,
  };
};