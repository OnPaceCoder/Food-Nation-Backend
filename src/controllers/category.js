const Category = require('../models/category.js');
const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");
const { createPaginationLinks } = require('../utils/createPaginationLinks.js');


// Get all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find().paginate({ ...req.paginate });
        res.status(200).links(createPaginationLinks(
            req.originalUrl,
            req.paginate.page,
            categories.totalPages,
            req.paginate.limit
        )).json(categories);

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new category
exports.createCategory = [

    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('description').notEmpty().withMessage('Description is required').isLength({ max: 250 }).withMessage('Description must be at most 250 characters').trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, description, image } = req.body;

            // Check if the category already exists
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) return res.status(400).json({ message: 'Category already exists' });

            // Create a new category
            const newCategory = new Category({ name, description, image });
            await newCategory.save();
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    })];

// Update a category by ID
exports.updateCategory = [

    body('name').optional().trim().escape(),
    body('description').optional().isLength({ max: 250 }).withMessage('Description must be at most 250 characters').trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            const category = await Category.findById(req.params.categoryId);

            if (category) {
                category.name = req.body.name || category.name;
                category.description = req.body.description || category.description;
                category.image = req.body.image || category.image;

                const updatedCategory = await category.save();

                res.status(200).json({
                    _id: updatedCategory._id,
                    name: updatedCategory.name,
                    description: updatedCategory.description,
                    image: updatedCategory.image
                })
            }
            else {
                return res.status(404).json({ message: 'Category not found' });
            }

        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    })];

// Delete a category by ID
exports.deleteCategory = asyncHandler(async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
