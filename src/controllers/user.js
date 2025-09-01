const User = require('../models/user.js');
require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");
const { createPaginationLinks } = require('../utils/createPaginationLinks.js');

//Register User
exports.register = [

    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, password, isAdmin } = req.body;

            // Check if username is already taken
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ error: "Username is already taken" });
            }

            const user = new User({ username, password, isAdmin });
            await user.save();
            res.status(201).json({ message: "User registered successfully" });

        } catch (error) {
            res.status(500).json({ message: error.message })
        }

    })];


exports.login = [

    body('username').notEmpty().withMessage('A valid Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user._id, username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "6h" });

            //Store the cookie in the client-side
            res.cookie("token", token, { httpOnly: false, secure: true, sameSite: 'None', maxAge: 6 * 60 * 60 * 1000 });
            res.status(200).json({
                message: 'Login Successful',
                _id: user._id,
                name: user.username,
                role: user.isAdmin,
                token: token

            });
        }
        catch (error) {
            console.error(error)
            res.status(500).json({ error: error.message });
        }

    })]

//Logout

exports.logout = asyncHandler(async (req, res) => {
    try {

        res.cookie('token', '', {
            httpOnly: false,
            secure: true,
            sameSite: 'None',
            expires: new Date(0),
        })
        res.status(204).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
})



// Admin - Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
    try {

        const users = await User.find().paginate({ ...req.paginate });
        res.status(200).links(createPaginationLinks(
            req.originalUrl,
            req.paginate.page,
            users.totalPages,
            req.paginate.limit
        )).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



// Get user by ID
exports.getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


//GetUserProfile
exports.getUserProfile = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


//UpdateUserProfile
exports.updateUser = [

    body('username').optional(),
    // body('email').isEmail().optional().withMessage('Email should be valid'),
    body('password').isLength({ min: 6 }).optional().withMessage('Password must be at least 6 characters'),


    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            const user = await User.findById(req.user.userId);

            if (user) {
                user.username = req.body.username || user.username;
                // user.email = req.body.email || user.email;

                if (req.body.password) {
                    user.password = req.body.password;
                }

                const updatedUser = await user.save();

                res.status(200).json({
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    // email: updatedUser.email,

                })
            }
            else {
                res.status(404).json("User not found")


            }

        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: error.messages });
        }
    })];

// Delete a user by ID
exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {

            return res.status(404).json({ message: 'User not found' });
        }
        else {

            res.status(200).json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: error.message });
    }
});
