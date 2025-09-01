const Product = require('../models/product.js')
const Category = require('../models/category.js')
const { body, query, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { createPaginationLinks } = require('../utils/createPaginationLinks.js');


exports.getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.paginate(
            {},
            {
                ...req.paginate,
                populate: {
                    path: 'category',
                    select: 'name',
                },
            }
        );


        res.status(200).links(createPaginationLinks(
            req.originalUrl,
            req.paginate.page,
            products.totalPages,
            req.paginate.limit
        )).json(products);


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


exports.getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            res.status(404).json({ message: "Product not found" })
        }
        else {

            res.status(200).json({ message: 'Product retrieved successfully', product })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

exports.createProduct = [
    body('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 5, max: 40 }).withMessage('Name must be between 5 and 40 Characters')
        .trim(),

    body('price').notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
    ,
    body('description').optional().trim(),

    body('stocks').notEmpty().withMessage('Stock count is required')
        .isInt({ min: 0 }).withMessage('Stock count must be a non-negative integer'),

    body('category').notEmpty().withMessage('Category is required')
    ,
    body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
    body('image').optional(),

    body('rating').optional().isInt({ min: 0, max: 5 }).withMessage('Rating must be an integer between 0 and 5'),


    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, price, description, stocks, isFeatured, image, category: CategoryName, rating } = req.body;

            const categoryDoc = await Category.findOne({ name: CategoryName });
            if (!categoryDoc) {
                return res.status(400).json({ message: 'Invalid category name' });
            }

            //Check for existing product

            const existingProduct = await Product.findOne({ name });

            if (existingProduct) {
                return res.status(409).json({ message: 'Product already exists' })
            }

            const newProduct = new Product({
                name,
                price,
                description,
                stocks,
                isFeatured,
                image,
                category: categoryDoc._id,
                rating
            });

            await newProduct.save();
            res.status(201).json({ message: "Product created successfully", product: newProduct });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })]

exports.updateProduct = [

    body('name').optional().trim().isLength({ min: 5, max: 40 }).withMessage('Name must be between 5 and 40 Characters'),

    body('price').optional().isNumeric().withMessage('Price must be a number'),

    body('description').optional().trim(),

    body('stocks').optional().isInt({ min: 0 }).withMessage('Stock count must be a non-negative integer'),

    body('category').optional(),

    body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),

    body('image').optional(),
    body('rating').optional().isInt({ min: 0, max: 5 }).withMessage('Rating must be an integer between 0 and 5'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            const productId = req.params.id;
            const updates = req.body;

            if (updates.category) {
                const categoryDoc = await Category.findOne({ name: updates.category });
                if (!categoryDoc) {
                    return res.status(400).json({ message: 'Invalid category name' });
                }
                updates.category = categoryDoc._id;
            }
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            else {
                Object.assign(product, updates);

                await product.save();

                res.status(200).json({ message: 'Product updated successfully', product })
            }


        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })]


exports.deleteProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        else {

            res.status(200).json({ message: 'Product deleted successfully' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})