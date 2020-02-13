const CosmosClient = require('@azure/cosmos').CosmosClient
const config = require('./config')
const UserOps = require('./routes/userops')
const UserDao = require('./models/userDao')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
var upload = multer();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'img')));
app.use('/img',express.static('img'));
app.use(express.static(path.join(__dirname, 'js')));
app.use('/js',express.static('js'));
app.use(express.static(path.join(__dirname, 'css')));
app.use('/css',express.static('css'));
app.use(express.static(path.join(__dirname, 'vendor')));
app.use('/vendor',express.static('vendor'));
app.use(express.static(path.join(__dirname, 'device-mockups')));
app.use('/device-mockups',express.static('device-mockups'));

app.use('/favicon.ico', express.static('img/favicon.ico'));

//Planit App Database:
const cosmosClient = new CosmosClient({
  endpoint: config.host,
  key: config.authKey
})
const userDao = new UserDao(cosmosClient, config.databaseId, config.userContainerId)
const userOps = new UserOps(userDao)
userDao
  .init(err => {
    console.error(err)
  })
  .catch(err => {
    console.error(err)
    console.error(
      'Shutting down because there was an error settinig up the database.'
    )
    process.exit(1)
  })


app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/signup', (req, res, next) => userOps.signUpUser(req,res).catch(next));
app.post('/login', (req, res, next) => userOps.loginUser(req,res).catch(next));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
