var express = require('express');
var jwt = require('jsonwebtoken');

var router = express.Router();
var db = require('../model/db');

//router.use
router.use(function(req, resp, next){

    //get the auth header value
    var token = req.body.token;

    if(token) {
        //verify the token;
        jwt.verify(token, 'mysecretkey', function(err, decoded){
            if(err){
                resp.sendStatus(403);
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        resp.sendStatus(403);
    }
});

router.post('/getNumber', function(req, resp){

    var id = req.session.data.id;

    db.getNumber(id, function(success, data){
        resp.send({success, number:data});
    })
});

router.post('/getNumberWithIncrement', function(req, resp){

    var id = req.session.data.id;

    db.getNumberWithIncrement(id, function(success, data){
        resp.send({success, number:data});
    });
});

router.post('/setValue', function(req, resp){
    
    var id = req.session.data.id;
    var value = req.body.value;

    db.setNumber(id, value, function(success, data){
        resp.send({success, number:data});
    });
});

module.exports = router;