const mongoose = require('mongoose');


const validateMongoId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid MongoDB ObjectID' });
        }
        next();
    };
};

module.exports = validateMongoId;
