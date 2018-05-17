var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

    req.body.user = false;

    res.send(true);

});

module.exports = router;

