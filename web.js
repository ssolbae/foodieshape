//node express app쓰려면 web.js format가져와
//express is a web framework that allows to run server
var express = require('express');
  //req에다 body 붙여줘
var bodyParser = require('body-parser');
  //req에다 cookie를 붙여줘
var cookieParser = require('cookie-parser');
//2lines 무조건 써 package.json에서 가져와

// Specify Controllers here
var food = require('./routes/food');
var auth = require('./routes/auth');

var app = express();
//inject express into http
var http = require('http').Server(app);

// In order to track req's body. ;)
//request.body.~~ 하려면..
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
//to use cookie
app.use(cookieParser());

//Routes
app.get('/recipes', food.getRecipes);
app.post('/signup', auth.signup);
app.post('/login', auth.login);
app.get('/calories', food.getCalorie);
app.get('/user', auth.getUserInfo);
app.get('/', auth.index);
app.get('/logout', auth.logout);
app.get('/main', auth.main);

// Specify static file path here
app.use('/', express.static(__dirname + '/routes/static'))
// always required to run the server
var server = http.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
