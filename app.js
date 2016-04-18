/* 
 * _    _       _                     _      
 *| |  | |     | |                   | |     
 *| |__| | __ _| |__  _ __   ___   __| | ___ 
 *|  __  |/ _` | '_ \| '_ \ / _ \ / _` |/ _ \
 *| |  | | (_| | |_) | | | | (_) | (_| |  __/
 *|_|  |_|\__,_|_.__/|_| |_|\___/ \__,_|\___| 
 *                                         
 * HabNode v1.0 -VIS000 2016
 * 
 */
//Requires
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var core = require('./habbo/class.core');

//Routes
var routes = require('./routes/index');
var client = require('./routes/client');
var register = require('./routes/register');

//Server
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3001);

//Call objects
core = new core();

//Session settings
var sesSettings = {
    secret: '123iodoifHabnode@0934',
    resave: false,
    saveUninitialized: true,
    cookie: {}};
if(core.httpsEnabled) {
    sesSettings.cookie.secure = true;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session(sesSettings));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    function updateOnline() {
        core.getUsersOnline(function(activeplayers){
            app.locals.online = activeplayers;
            socket.emit('online', activeplayers);
        });
    };
    updateOnline();
    setInterval(updateOnline, 10000);
});


app.use('/', routes);
app.use('/client', client);
app.use('/register', register);

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if(err) {
            res.status(500);
            res.send(err);
        } else {
            res.redirect('/');
        }
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
