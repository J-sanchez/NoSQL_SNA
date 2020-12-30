const router = require('express').Router();
const pizzaRoutes = require('./User-routes');

router.use('/pizzas' , pizzaRoutes);

module.exports = router;