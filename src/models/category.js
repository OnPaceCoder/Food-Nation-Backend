const mongoose = require('mongoose');
const paginate = require("mongoose-paginate-v2");
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A category must have a name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg"
    }
}, {
    timestamps: true
});

categorySchema.plugin(paginate);

module.exports = mongoose.model('Category', categorySchema);
