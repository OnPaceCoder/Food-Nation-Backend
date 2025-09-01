const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const paginate = require("mongoose-paginate-v2");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
});

userSchema.plugin(paginate);
//Hash password before saving
userSchema.pre("save", { document: true, query: false }, async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
}
module.exports = mongoose.model('User', userSchema);