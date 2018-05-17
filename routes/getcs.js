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
        .column('id','Nombre')
        .select()
        .from('ProturEquivalenciasCaps')
        .where('Nombre', 'like', '%'+q+'%')
        .then(function(rows){
          res.send(rows) ;
        })
        .catch(function(error){
            console.log(error);
        });
/*
    sql.connect(config, err => {

        var queryString = 'select id, Nombre from ProturEquivalenciasCaps where Nombre like '+ q +' order by Nombre asc';

        new sql.Request().query(queryString, (err, result) => {

            if(err){

                console.dir(err);
                res.send('error');

            }else{

                res.send(result);

            }
        });
    });

    sql.on('error', err => {

        // ... error handler
        console.log(err);
        res.send('error');

    });

    sql.close()*/
});

module.exports = router;