var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);  // requiring it exports a function to which the session needs to be passed into

var index = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

//mongoose.connect('localhost:27017/shopping');
mongoose.connect(process.env.MONGODB_URI || 'localhost:27017/shopping');

require('./config/passport');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
//app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator()); //order is important as it must be after the body is parsed as it validates the params from the parsed body
app.use(cookieParser());
app.use(session({
  secret: 'stevegibbs', resave: false, saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}), //uses same connection as mongoose rather than opening a new connection
    cookie: {maxAge: 180 * 60 * 1000} //expires after 3 hrs
}));
app.use(flash()); //ordering here matters as flash needs the session to be initialised first
app.use(passport.initialize());
app.use(passport.session()); //set it to use sessions to store the users - we will store user information locally - look at passport strategies to look at alternatives eg facebook or twitter authentication etc etc
app.use(express.static(path.join(__dirname, 'public')));

//setting a global variable called login which will be true or false, if authenticated, that will be available in all views.
app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session; //make session available to all views without having to pass it explicitly in the routes
  next(); //allows request to continue
});

app.use('/user', userRoutes);  //ordering is important as you want it to look for /user first to go to the user routes
// before defaulting to the / route.  Otherwise if it finds / it will always go to index route first.
app.use('/', index);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404 Error - Sorry the page was not found');
  err.status = 404;
  next(err);
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
