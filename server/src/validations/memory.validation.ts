import { z } from "zod";

export const createMemorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(150, "Title cannot exceed 150 characters"),

  content: z
    .string()
    .trim()
    .min(1, "Memory content is required"),

  category: z
    .enum([
      "personal",
      "career",
      "education",
      "travel",
      "health",
      "finance",
      "relationship",
      "other",
    ])
    .default("personal"),

  mood: z
    .enum([
      "happy",
      "excited",
      "sad",
      "angry",
      "calm",
      "stressed",
      "neutral",
    ])
    .default("neutral"),

  tags: z
    .array(z.string().trim())
    .default([]),

  eventDate: z
    .coerce
    .date(),

  location: z
    .object({
      name: z.string().trim().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),

  attachments: z
    .array(z.string().url())
    .default([]),
});

export type CreateMemoryInput = z.infer<
  typeof createMemorySchema
>;