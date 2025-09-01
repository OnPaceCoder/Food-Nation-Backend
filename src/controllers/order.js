
const Order = require('../models/order.js');
const Product = require('../models/product.js');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');
const { createPaginationLinks } = require('../utils/createPaginationLinks.js');
exports.getAllOrders = asyncHandler(async (req, res) => {
    try {

        const orders = await Order.paginate({}, {
            page: req.paginate.page,
            limit: req.paginate.limit,
            populate: [
                { path: 'user', select: 'username' },
                { path: 'products.product', select: 'name price' }
            ]
        });
        res.status(200).links(createPaginationLinks(
            req.originalUrl,
            req.paginate.page,
            orders.totalPages,
            req.paginate.limit
        )).json(orders);
        ;
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'username')
            .populate('products.product', 'name price');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        else {

            res.status(200).json(order);
        }
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

exports.getOrdersByUserId = [
    asyncHandler(async (req, res) => {
        try {
            const orders = await Order.find({ user: req.user.userId })
                .populate('user', 'username')
                .populate('products.product', 'name price');
            if (!orders) {
                res.status(404).json({ message: "No orders found" })
            }
            else {

                res.status(200).json(orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    })
]

// Create a new order
exports.createOrder = [


    body('products').isArray({ min: 1 }).withMessage('Products array must not be empty'),


    body('products.*.product').notEmpty().withMessage('Product ID is required for each product').isMongoId().withMessage('Invalid Product ID'),


    body('products.*.quantity').notEmpty().withMessage('Quantity is required for each product').isInt({ min: 1 }).withMessage("Quantity must be at least 1"),



    asyncHandler(async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { products } = req.body;

            let totalAmount = 0;

            for (const item of products) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(400).json({ message: `Product with ID ${item.product} not found` });
                }
                totalAmount += product.price * item.quantity;

            }

            totalAmount = parseFloat(totalAmount.toFixed(2));
            // Create a new order instance
            const newOrder = new Order({
                user: req.user.userId,
                products,
                totalAmount,
                status: 'Pending' // Default status is "Pending"
            });

            await newOrder.save();
            res.status(201).json({ message: 'Order placed successfully', order: newOrder });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    })];





// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        else {

            res.status(200).json(updatedOrder);
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


