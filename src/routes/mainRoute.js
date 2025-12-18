const express = require("express");
const router = express.Router();
const testRoute = require('./testRoute/testRoute')
const userRoute = require('./userRoute/userRoute')
const adminRoute = require("./adminRoute/adminRoute")
router.use('/api', userRoute);
router.use('/api', testRoute);
router.use('/api', adminRoute);



module.exports = router;