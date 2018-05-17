var express = require('express');
var router = express.Router();

var knex = require('knex')({
    client: 'mssql',
    connection: {
        host : '200.0.236.210',
        port: 5000,
        user : 'sa',
        password : 'Alamitos+2016',
        database : 'MSP-Ares'
    },
    debug: false,
    pool: { min: 0, max: 40 }
});


router.get('/', function(req, res, next) {

    var q = req.query.q;

    knex
        .column('id10','dec10')
        .select()
        .from('db29179_cie10')
        .where('id10', 'like', '%'+q+'%')
        .orWhere('dec10','like', '%'+q+'%')
        .then(function(rows){

            //console.log(rows)
            res.send(rows) ;
        })
        .catch(function(error){
            console.log(error);
        });
});

module.exports = router;