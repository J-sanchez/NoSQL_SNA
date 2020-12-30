const router = require('express').Router();
const userRoutes = require('./User-routes');
const thoughtRoutes = require('./Thoughts-routes');

router.use('/Users', userRoutes);
router.use('/Thoughts', thoughtRoutes);

module.exports = router;