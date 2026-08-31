import { Memory } from "../models/memory.model.js";

const getDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const getStreak = async (userId: string) => {
  const memories = await Memory.find({
    userId,
  })
    .select("eventDate")
    .sort({
      eventDate: 1,
    })
    .lean();

  if (memories.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDays: 0,
    };
  }

  // Remove duplicate dates
  const uniqueDates = [
    ...new Set(
      memories.map((memory) =>
        getDateKey(new Date(memory.eventDate))
      )
    ),
  ];

  const dates = uniqueDates
    .map((date) => new Date(`${date}T00:00:00.000Z`))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < dates.length; i++) {
    const previous = dates[i - 1];
    const current = dates[i];

    const difference =
      (current.getTime() - previous.getTime()) /
      (1000 * 60 * 60 * 24);

    if (difference === 1) {
      currentRun++;

      longestStreak = Math.max(
        longestStreak,
        currentRun
      );
    } else {
      currentRun = 1;
    }
  }

  // Calculate current streak
  const today = new Date();

  const todayKey = getDateKey(today);

  const yesterday = new Date(today);
  yesterday.setUTCDate(
    yesterday.getUTCDate() - 1
  );

  const yesterdayKey = getDateKey(yesterday);

  const latestDate =
    uniqueDates[uniqueDates.length - 1];

  let currentStreak = 0;

  if (
    latestDate === todayKey ||
    latestDate === yesterdayKey
  ) {
    currentStreak = 1;

    for (
      let i = dates.length - 1;
      i > 0;
      i--
    ) {
      const difference =
        (dates[i].getTime() -
          dates[i - 1].getTime()) /
        (1000 * 60 * 60 * 24);

      if (difference === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
    activeDays: uniqueDates.length,
  };
};