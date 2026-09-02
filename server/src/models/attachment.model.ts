import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IAttachment
  extends Document {
  userId: mongoose.Types.ObjectId;
  memoryId: mongoose.Types.ObjectId;

  type:
    | "image"
    | "video"
    | "audio"
    | "document";

  url: string;
  publicId?: string | null;

  fileName?: string;
  fileSize?: number;
  mimeType?: string;

  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema =
  new Schema<IAttachment>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      memoryId: {
        type: Schema.Types.ObjectId,
        ref: "Memory",
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: [
          "image",
          "video",
          "audio",
          "document",
        ],
        required: true,
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },

      publicId: {
        type: String,
        default: null,
      },

      fileName: {
        type: String,
        trim: true,
      },

      fileSize: {
        type: Number,
      },

      mimeType: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Attachment =
  mongoose.model<IAttachment>(
    "Attachment",
    attachmentSchema
  );

export default Attachment;