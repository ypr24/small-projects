var express = require('express');
var router = express.Router();

const PlaceController = require('../controller/place')

router.get('/getallplaces', PlaceController.getallplaces);
router.put('/update',PlaceController.update);
router.post('/insert', PlaceController.insert);
router.delete('/delete', PlaceController.delete);

module.exports = router;

