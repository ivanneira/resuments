var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {


    res.render('index', {title: 'Resumen estadístico mensual de trabajo social'});


});

module.exports = router;
