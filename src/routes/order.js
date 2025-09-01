const express = require("express")

const router = express.Router()

const OrderController = require("../controllers/order.js")
const { authJWT } = require("../middleware/auth.js");
const { isAdmin } = require("../middleware/checkIsAdmin.js");
const validatePaginateParams = require("../middleware/validatePaginateParams.js");
const validateMongoId = require("../middleware/validateMongodbId.js");

//Router for Order

//Get all orders of all users
router.get("/", authJWT, isAdmin, validatePaginateParams, OrderController.getAllOrders);

//Get all orders of a user
router.get("/myorders", authJWT, OrderController.getOrdersByUserId);

//Get order by an Id
router.get("/:id", validateMongoId('id'), authJWT, OrderController.getOrderById);



//Create order
router.post("/", authJWT, OrderController.createOrder);
router.put("/:id", validateMongoId('id'), authJWT, OrderController.updateOrder);
router.delete("/:id", validateMongoId('id'), authJWT, OrderController.deleteOrder);

module.exports = router
