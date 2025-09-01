const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user.js");
const { authJWT } = require("../middleware/auth.js");
const { isAdmin } = require("../middleware/checkIsAdmin.js");
const validatePaginateParams = require("../middleware/validatePaginateParams.js");
const validateMongoId = require("../middleware/validateMongodbId.js");

//AUTH Routes

//All-Register (CreateNewUser)
router.post("/register", UserController.register);

//All-Login
router.post("/login", UserController.login);

//All-Logout
router.post("/logout", UserController.logout);


//USER Routes
//User-GetUserProfile
router.get("/profile", authJWT, UserController.getUserProfile);

//User-UpdateUserProfile
router.put("/profile", authJWT, UserController.updateUser);


//Admin Routes
//Admin-GetAllUsers
router.get("/", authJWT, isAdmin, validatePaginateParams, UserController.getAllUsers);

//Admin-GetUserById
router.get("/:id", validateMongoId('id'), authJWT, isAdmin, UserController.getUserById);

//Admin-DeleteUserById
router.delete("/:id", validateMongoId('id'), authJWT, isAdmin, UserController.deleteUser);



module.exports = router
