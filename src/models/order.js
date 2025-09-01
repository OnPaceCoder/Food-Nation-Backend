const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Delivered"],
        default: "Pending",
    },

},

    {
        timestamps: true,
    });


orderSchema.plugin(paginate);
module.exports = mongoose.model('Order', orderSchema);