var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {

    var user = req.body.user;
    var pass = req.body.pass;

    //aca tiene que ir la verificación por base de datos
    if(user == '1'){

        req.session.user = user;

        res.send(true);

    }else{
        res.send(false);
    }

});

module.exports = router;