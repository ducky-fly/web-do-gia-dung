const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { cloudinary } = require("../configs/cloudinaryConfig");

// Cấu hình storage cho Cloudinary chỉ cho ảnh
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images", // ✅ nên đổi folder phù hợp (vd: 'images')
    resource_type: "image", // chỉ cho ảnh
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // định dạng ảnh
  },
});

// Tạo middleware upload ảnh (chỉ 1 ảnh)
const upload = multer({ storage });

// Middleware xử lý upload 1 ảnh duy nhất
const uploadImageMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    try {
      // Lỗi của multer
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res
          .status(400)
          .json({ message: "Lỗi upload ảnh: " + err.message });
      } else if (err) {
        console.error("Unknown error:", err);
        return res
          .status(500)
          .json({ message: "Lỗi không xác định khi upload ảnh" });
      }

      // Nếu không có ảnh
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Vui lòng chọn 1 ảnh để upload." });
      }

      // Ảnh đã được upload thành công
      req.image = req.file;
      console.log("Image uploaded:", req.image);

      next(); // tiếp tục
    } catch (error) {
      console.error("Exception during upload:", error);
      res.status(500).json({ message: "Lỗi khi xử lý upload ảnh" });
    }
  });
};

module.exports = uploadImageMiddleware;
