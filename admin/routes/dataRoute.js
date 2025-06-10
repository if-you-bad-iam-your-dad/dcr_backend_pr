const express = require('express');
const router = express.Router();


const dataController = require('../controllers/dataController');

router.post('/newdata', dataController.datainsert);
router.get('/getdata', dataController.getAllData);
// router.post('/login', userController.loginUser);




module.exports = router;