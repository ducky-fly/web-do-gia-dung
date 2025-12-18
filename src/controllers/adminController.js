const songModel = require("../models/songModel");
const productModel = require("../models/songModel");
const asyncHandler = require("express-async-handler");
const { DateTime } = require("luxon");
const { cloudinary } = require("../configs/cloudinaryConfig");

//@desc adminAuth
//@route GET /api/admin/auth
//@access private
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const allProducts = await productModel.find(); // lấy toàn bộ sản phẩm

    res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      success: true,
      products: allProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
});

//@desc adminAuth
//@route post /api/admin/uploadAudio
//@access private
const uploadProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const fileImage = req.image;

    if (!fileImage) {
      return res.status(400).json({ message: "Chưa upload ảnh sản phẩm" });
    }

    const imageUrl = fileImage.path;

    // Kiểm tra các trường bắt buộc
    if (!name || !price || !description) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    const product = await productModel.create({
      name,
      price,
      description,
      url_img: imageUrl,
    });

    if (product) {
      res.status(201).json({
        message: "Đăng sản phẩm thành công!",
        product,
        success: true,
      });
    } else {
      res.status(400);
      throw new Error("Dữ liệu sản phẩm không hợp lệ");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const fileImage = req.image;
    const imageUrl = fileImage ? fileImage.path : null;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Nếu có ảnh mới thì xoá ảnh cũ khỏi Cloudinary
    if (imageUrl && product.url_img) {
      try {
        const publicId = product.url_img.split("/").slice(-1)[0].split(".")[0]; // lấy tên file không đuôi
        await cloudinary.uploader.destroy(`images/${publicId}`);
      } catch (err) {
        console.warn("Không thể xoá ảnh cũ trên Cloudinary:", err.message);
      }
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (description) updateData.description = description;
    if (imageUrl) updateData.url_img = imageUrl;

    // Cập nhật
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật sản phẩm",
      error: error.message,
    });
  }
});
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm theo ID
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm với ID này" });
    }

    // Nếu có ảnh -> xoá ảnh khỏi Cloudinary
    if (product.url_img) {
      try {
        const publicId = product.url_img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`images/${publicId}`); // đúng folder
      } catch (err) {
        console.warn("Không thể xoá ảnh Cloudinary:", err.message);
      }
    }

    // Xoá khỏi MongoDB
    await productModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Xoá sản phẩm thành công", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xoá sản phẩm", error: error.message });
  }
});
module.exports = {
  uploadProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
