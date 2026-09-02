import { Readable } from "node:stream";

import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  options: {
    folder: string;
    resourceType:
      | "image"
      | "video"
      | "raw"
      | "auto";
  }
): Promise<{
  secure_url: string;
  public_id: string;
  resource_type: string;
  bytes: number;
  format?: string;
}> => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: options.folder,
            resource_type:
              options.resourceType,
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(
                new Error(
                  "Cloudinary upload failed"
                )
              );
              return;
            }

            resolve({
              secure_url:
                result.secure_url,
              public_id:
                result.public_id,
              resource_type:
                result.resource_type,
              bytes: result.bytes,
              format: result.format,
            });
          }
        );

      Readable.from(buffer).pipe(
        uploadStream
      );
    }
  );
};