const express = require("express");
const uploadFilesMiddleware = require("../../middlewares/upLoad");
const {
  deleteProduct,
  getAllProducts,
  uploadProduct,
  updateProduct,
} = require("../../controllers/adminController");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const {
  validateAccessToken,
} = require("../../middlewares/validateAccessToken");

router.route("/admin/getValue").get(getAllProducts);
router
  .route("/admin/uploadProduct")
  .post(
    validateAccessToken,
    auth(["admin"]),
    uploadFilesMiddleware,
    uploadProduct
  );
router
  .route("/admin/updateProduct/:id")
  .put(
    validateAccessToken,
    auth(["admin"]),
    uploadFilesMiddleware,
    updateProduct
  );
router
  .route("/admin/deleteProduct/:id")
  .delete(validateAccessToken, auth(["admin"]), deleteProduct);

module.exports = router;
