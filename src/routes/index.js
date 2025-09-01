const productRoutes = require('./product.js')
const orderRoutes = require('./order.js')
const userRoutes = require('./user.js')
const categoryRoutes = require('./category.js')


module.exports = (app) => {

    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/category', categoryRoutes);
};