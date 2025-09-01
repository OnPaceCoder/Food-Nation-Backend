const express = require("express")
const router = express.Router()
const { authJWT } = require("../middleware/auth.js");
const { isAdmin } = require("../middleware/checkIsAdmin.js");
const validatePaginateParams = require("../middleware/validatePaginateParams.js");
const categoryController = require("../controllers/category.js");
const validateMongoId = require("../middleware/validateMongodbId.js");

// Routes for category
router.get("/", validatePaginateParams, categoryController.getAllCategories);

router.get("/:categoryId", validateMongoId('categoryId'), authJWT, isAdmin, categoryController.getCategoryById);

router.post("/", authJWT, isAdmin, categoryController.createCategory);
router.put("/:categoryId", validateMongoId('categoryId'), authJWT, isAdmin, categoryController.updateCategory);
router.delete("/:categoryId", validateMongoId('categoryId'), authJWT, isAdmin, categoryController.deleteCategory);

module.exports = router

