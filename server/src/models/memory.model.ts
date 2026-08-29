import mongoose, { Document, Schema, Types } from "mongoose";

export type MemoryCategory =
  | "personal"
  | "career"
  | "education"
  | "travel"
  | "health"
  | "finance"
  | "relationship"
  | "other";

export type MemoryMood =
  | "happy"
  | "excited"
  | "sad"
  | "angry"
  | "calm"
  | "stressed"
  | "neutral";

export interface IMemory extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  category: MemoryCategory;
  mood: MemoryMood;
  tags: string[];
  eventDate: Date;
  location?: {
    name?: string;
    latitude?: number;
    longitude?: number;
  };
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const memorySchema = new Schema<IMemory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Memory title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    content: {
      type: String,
      required: [true, "Memory content is required"],
      trim: true,
      minlength: [1, "Memory content cannot be empty"],
    },

    category: {
      type: String,
      enum: {
        values: [
          "personal",
          "career",
          "education",
          "travel",
          "health",
          "finance",
          "relationship",
          "other",
        ],
        message: "Invalid memory category",
      },
      default: "personal",
      index: true,
    },

    mood: {
      type: String,
      enum: {
        values: [
          "happy",
          "excited",
          "sad",
          "angry",
          "calm",
          "stressed",
          "neutral",
        ],
        message: "Invalid mood",
      },
      default: "neutral",
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
      index: true,
    },

    location: {
      name: {
        type: String,
        trim: true,
      },

      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },

    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

memorySchema.index({
  userId: 1,
  eventDate: -1,
});

export const Memory = mongoose.model<IMemory>(
  "Memory",
  memorySchema
);