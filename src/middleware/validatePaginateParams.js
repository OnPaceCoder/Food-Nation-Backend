const { query, validationResult } = require('express-validator');

const validatePaginateParams = [

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page should be a positive number')
        .toInt(),


    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit should be a positive number')
        .toInt(),

    //Checking validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        if (!req.paginate) {
            req.paginate = {};
        }

        req.paginate.page = parseInt(req.query.page, 10) || 1;
        //Limiting only 6 items per page
        req.paginate.limit = 6;

        next();
    }
];

module.exports = validatePaginateParams;
