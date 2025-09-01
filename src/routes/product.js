const express = require("express");
const router = express.Router();

//Controller
const ProductController = require("../controllers/product.js");

//Middlewares
const { authJWT } = require("../middleware/auth.js");
const { isAdmin } = require("../middleware/checkIsAdmin.js");
const validateMongoId = require("../middleware/validateMongodbId.js");
const validatePaginateParams = require("../middleware/validatePaginateParams.js");

//Get all Products
router.get("/", validatePaginateParams, ProductController.getAllProducts);

//Get a product by id
router.get("/:id", validateMongoId('id'), ProductController.getProductById);

//Get products by category
// router.get("/category/:categoryId", validateMongoId('categoryId'), authJWT, ProductController.getProductsByCategory);

//Create Product
router.post("/", authJWT, isAdmin, ProductController.createProduct);

//Update a product
router.put("/:id", validateMongoId('id'), authJWT, isAdmin, ProductController.updateProduct);

//Delete a product
router.delete("/:id", validateMongoId('id'), authJWT, isAdmin, ProductController.deleteProduct);



module.exports = router
