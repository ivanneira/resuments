var express = require('express');
var router = express.Router();

var knex = require('knex')({
    client: 'mssql',
    connection: {
        host : '10.64.65.200',
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
        .column('id','Nombre')
        .select()
        .from('Departamento')
        .where('Nombre', 'like', '%'+q+'%')
        .andWhere('ProvinciaID','18')
        .then(function(rows){
            res.send(rows) ;
        })
        .catch(function(error){
            console.log(error);
        });
});

module.exports = router;