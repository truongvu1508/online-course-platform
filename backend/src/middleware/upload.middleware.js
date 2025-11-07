import multer from "multer";
import sharp from "sharp";

// config multer to save temporary files
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // only allow image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ được upload file hình ảnh!"), false);
    }
  },
});

// compresses images after uploading
const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    req.file.buffer = await sharp(req.file.buffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    next();
  } catch (error) {
    next(error);
  }
};

export { upload, compressImage };
