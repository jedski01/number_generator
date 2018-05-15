const express = require('express');
const port = process.env.PORT || 5000;
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');

var app = express();
const server = require('http').createServer(app);

var db = require('./model/db.js');
var numbers = require('./routes/number');

app.use(express.static(path.join(__dirname, "client","/build")))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    secret:'mysecretkey',
    resave:true,
    saveUninitialized:true
}));

app.use('/api', numbers);

app.get('/', function(req, resp){
    resp.sendFile(pFolder+'/index.html');
});

app.post('/login', function(req, resp) {
    
    var email = req.body.email;
    var password = req.body.password;

    db.getUser(email,password, function(success, data){
        if(success) {
            jwt.sign({user:data},'mysecretkey', function(err, token){
                if(err){
                    console.log(err);
                    resp.send({success: false, data:'something went wrong with generating token'})
                } else {
                    req.session.data = {...data, token}
                    
                    resp.send({success, info:{
                        token, 
                        number: data.number,
                        email: data.email
                    }});
                
                }
            });
            return;
        }

        resp.send({success, info:data});
    })
});

app.post('/loggedin', function(req, resp){
    if(req.session.data) {
        resp.send({success: true,
            data: {
                token: req.session.data.token,
                email: req.session.data.email
            }
        });
    } else {
        resp.send({success: false});
    }
})

app.post('/logout', function(req, resp) {
    
    req.session.destroy();
    resp.send({success:true});
});

app.post('/addUser', function(req, resp){

    var email = req.body.email;
    var password = req.body.password;

    db.addUser(email, password, function(success, data){
        if(success) {
            jwt.sign({user:data},'mysecretkey', function(err, token){
                if(err){
                    console.log(err);
                    resp.send({success: false, data:'something went wrong with generating token'})
                } else {
                    req.session.data = {...data, token}

                    resp.send({success, info:{
                        token, 
                        number: data.number,
                        email: data.email
                    }});
                
                }
            });
            return
        }
        
        resp.send({success, info:data});
    });
});

server.listen(port, err=>{
    if(err) {
        console.log(err);
        return false;
    }

    console.log('Server is running on port ' + port);
})