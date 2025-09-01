const mongoose = require('mongoose');
const paginate = require("mongoose-paginate-v2");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true,
        maxlength: [40, 'A product name must have less or equal then 40 characters'],
        minlength: [5, 'A product name must have more or equal then 5 characters']
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    description: {
        type: String,
        trim: true
    },
    stocks: {
        type: Number,
        required: [true, 'A product must have a stock']
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'A product must have a category']
    },
    rating: {
        type: Number,
        default: 4.5
    },

}, {
    timestamps: true
});

productSchema.plugin(paginate);
module.exports = mongoose.model('Product', productSchema);