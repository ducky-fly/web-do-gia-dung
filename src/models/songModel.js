const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên sản phẩm"],
  },
  price: {
    type: Number,
    required: [true, "Vui lòng nhập giá tiền"],
    min: [0, "Giá tiền phải lớn hơn hoặc bằng 0"],
  },
  description: {
    type: String,
    required: [true, "Vui lòng nhập mô tả sản phẩm"],
  },
  url_img: {
    type: String,
    required: [true, "Vui lòng cung cấp ảnh sản phẩm"],
  },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      star: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
