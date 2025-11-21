import {
  deleteFromCloudinaryService,
  uploadMultipleToCloudinaryService,
  uploadToCloudinaryService,
} from "../../services/public/file.service.js";

const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file để upload",
      });
    }

    // upload to Cloudinary
    const result = await uploadToCloudinaryService(
      req.file.buffer,
      "CodeLearns"
    );

    res.json({
      success: true,
      message: "Upload thành công",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi upload file",
      error: error.message,
    });
  }
};

const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất một file",
      });
    }

    const results = await uploadMultipleToCloudinaryService(
      req.files,
      "CodeLearns"
    );

    const uploadedFiles = results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    }));

    res.json({
      success: true,
      message: "Upload thành công",
      data: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi upload files",
      error: error.message,
    });
  }
};

const deleteFromCloudinary = async (req, res) => {
  try {
    const { publicId } = req.body;
    console.log(req.body);

    // upload to Cloudinary
    await deleteFromCloudinaryService(publicId);

    res.json({
      success: true,
      message: "Xóa file từ Cloudinary thành công",
    });
  } catch (error) {
    console.error("Deleting error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa file",
      error: error.message,
    });
  }
};

export { uploadSingleFile, uploadMultipleFiles, deleteFromCloudinary };
