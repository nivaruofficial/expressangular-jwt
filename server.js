var express = require('express');
var faker = require('faker');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var jwtSecret = 'hf759390gjhiuejd867465';
var expressJwt = require('express-jwt');

var user = {
    username:'luigi',
    password:'p'
};

// just in case of Cross Origin Requests
app.use(cors());

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(expressJwt({secret:jwtSecret}).unless({path:['/login']}));
// Custom Error Handler for Unauthorized Error
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});
// Create Fake Users in json format
app.get('/random-user', function(req,res){
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);
});

app.post('/login', authenticate, function(req, res){
    var token = jwt.sign({
        username: user.username
    }, jwtSecret);
    res.send({
        token:token,
        user:user
    });
});

app.get('/me', function(req, res){
    res.send(req.user);
});


// Util functions

function authenticate(req, res, next){
    var body = req.body;
    if(!body.username || !body.password){
        res.status(400).send('Must provide username and password!');
    }
    else if(body.username !== user.username || body.password !== user.password){
        res.status(401).send('Username or password incorrect');
    }

    /*else if(body.username == user.username || body.password == user.password){
        console.log('right!');
        next();
    }   */
    else {
        req.user = user;
        next();
    }

}

app.listen(3000, function(){
    console.log('Server ready on port 3000');
});
