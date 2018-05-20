var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var fs = require('fs');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var views = require('./routes/views');
var usersApi = require('./routes/rest/users');
var filesApi = require('./routes/rest/files');
var foldersApi = require('./routes/rest/folders');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static(path.resolve(__dirname,'public')));
app.use('/routes', express.static(path.resolve(__dirname,'routes')));
app.use('/node_modules', express.static(path.resolve(__dirname,'node_modules')));
app.use('/views', express.static(path.resolve(__dirname,'views')));

app.use('/', views);
app.use('/api/users', usersApi);
app.use('/api/files', filesApi);
app.use('/api/folders', foldersApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
    res.sendFile('error.html', {root: path.resolve(__dirname, 'views'),  title: '404' });
});

var mysqlConfig = config.get('mysql');
var mysql = require('mysql');

con = mysql.createConnection({
    host: mysqlConfig.host ,
    port :  mysqlConfig.port,
    user: mysqlConfig.user,
    password : mysqlConfig.password,
    database : mysqlConfig.database,
    multipleStatements: true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});



process.argv.forEach(function(val, index){
    if(val === '--import-db'){
        console.log('Importing data to database...');
        var sqlQuery = fs.readFileSync('./test.sql').toString();
        con.query(sqlQuery, function(err, res){
            if(err){
                throw err;
            }
            console.log('Data succesfully imported to database')
        });
    }
});

passport.use(new BasicStrategy(
    function(username, password, done) {

        var query = 'SELECT * FROM user WHERE ?? = ? AND ?? = ?;';
        var inserts = ['username', username, 'password', password];
        query = mysql.format(query, inserts);

        con.query(query, function(err, data){
            if(err){
                return done(err)}
            if(data && data.length && data !== undefined) {
                if(data.length > 1){
                    return done(null, false);
                }
                else{
                    return done(null, {id : data[0].id, password : password, username : username})
                }
            }
            else{
                return done(null, false);
            }
        });
    }
));

module.exports = app;


