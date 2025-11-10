export const extractPublicIdFromUrl = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null;

  try {
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{extension}
    // hoặc: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{extension}

    const urlParts = cloudinaryUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return null;

    // Lấy phần sau "upload"
    const pathAfterUpload = urlParts.slice(uploadIndex + 1);

    // Loại bỏ các phần transformation (bắt đầu bằng chữ cái và chứa dấu _)
    // Ví dụ: c_fill, w_200, h_200, etc.
    const filteredParts = pathAfterUpload.filter((part) => {
      // Bỏ qua transformation parameters (vd: c_fill, w_200, h_200)
      return !part.match(/^[a-z]_/);
    });

    // Loại bỏ version (vd: v1759222400)
    const pathWithoutVersion = filteredParts.filter((part) => {
      return !part.match(/^v\d+$/);
    });

    if (pathWithoutVersion.length === 0) return null;

    // Lấy file cuối cùng và loại bỏ extension
    const lastPart = pathWithoutVersion[pathWithoutVersion.length - 1];
    const publicIdWithoutExt = lastPart.split(".")[0];

    // Nếu có folder structure, ghép lại
    if (pathWithoutVersion.length > 1) {
      const folderPath = pathWithoutVersion.slice(0, -1).join("/");
      return `${folderPath}/${publicIdWithoutExt}`;
    }

    return publicIdWithoutExt;
  } catch (error) {
    console.error("Error extracting publicId:", error);
    return null;
  }
};
