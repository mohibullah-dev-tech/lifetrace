import mongoose, { Document, Schema, Types } from "mongoose";

export type GoalStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "paused"
  | "cancelled";

export interface IGoal extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  status: GoalStatus;
  progress: number;
  startDate: Date;
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
      minlength: [2, "Goal title must be at least 2 characters"],
      maxlength: [150, "Goal title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "not_started",
          "in_progress",
          "completed",
          "paused",
          "cancelled",
        ],
        message: "Invalid goal status",
      },
      default: "not_started",
      index: true,
    },

    progress: {
      type: Number,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"],
      default: 0,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    targetDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({
  userId: 1,
  status: 1,
});

goalSchema.index({
  userId: 1,
  targetDate: 1,
});

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);