const express = require('express');
const router = express.Router();


const dataController = require('../controllers/dataController');

router.post('/newdata', dataController.datainsert);
router.get('/getdata', dataController.getAllData);
router.put('/update/:id', dataController.updatecrime);
router.delete('/delete/:id', dataController.deleteData);
router.get('/casecount', dataController.totalcasecount);
router.get('/crimetypecount', dataController.crimeTypeCount);





module.exports = router;