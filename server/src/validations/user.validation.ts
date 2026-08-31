import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    avatarUrl: z
      .string()
      .url()
      .optional(),

    bio: z
      .string()
      .trim()
      .max(500)
      .optional(),
  })
  .strict();

export type UpdateUserInput = z.infer<
  typeof updateUserSchema
>;