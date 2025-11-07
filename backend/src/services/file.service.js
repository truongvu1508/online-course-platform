import cloudinary from "../config/cloudinary.config.js";
import sharp from "sharp";

// Upload single file to Cloudinary
const uploadToCloudinaryService = async (
  buffer,
  folder = "uploads",
  options = {}
) => {
  try {
    const optimizedBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: folder,
            transformation: [
              { quality: "auto:good" }, // cloudinary auto optimal
              { fetch_format: "auto" }, // auto select best format
            ],
            ...options,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(optimizedBuffer);
    });
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Upload multiple files to Cloudinary
const uploadMultipleToCloudinaryService = async (files, folder = "uploads") => {
  const uploadPromises = files.map(async (file) => {
    try {
      // compressed before uploading
      const optimizedBuffer = await sharp(file.buffer)
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      return await uploadToCloudinaryService(optimizedBuffer, folder);
    } catch (error) {
      return { error: error.message };
    }
  });

  const results = await Promise.allSettled(uploadPromises);
  return results.map((r) => (r.status === "fulfilled" ? r.value : null));
};

// Delete file from Cloudinary
const deleteFromCloudinaryService = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export {
  uploadToCloudinaryService,
  uploadMultipleToCloudinaryService,
  deleteFromCloudinaryService,
};
