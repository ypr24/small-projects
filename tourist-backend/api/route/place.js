const express = require('express');
const router = express.Router();

const placeController = require('../controller/place');

router.get('/getallplaces', placeController.getAllPlaces);
router.put('/update', placeController.update);
router.post('/insert', placeController.insert);
router.delete('/delete', placeController.delete);

module.exports = router;

