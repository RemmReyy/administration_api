var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { connect } = require('./data/db');

const salesmenRouter = require('./routes/salesmen');
const performanceRouter = require('./routes/performance');

var app = express();
connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/salesmen', salesmenRouter);
app.use('/api/performance', performanceRouter);

app.get('/', (req, res) => {
    res.send(`
    <h1>REST API — interface for the administration of salesmen and social performance records</h1>
    <ul>
      <li><a href="/api/salesmen">GET /api/salesmen</a></li>
      <li><a href="/api/salesmen/1">GET /api/salesmen/1</a></li>
      <li><a href="/api/performance">GET /api/performance</a></li>
      <li><a href="/api/performance/salesman/1">GET /api/performance/salesman/1</a></li>
      <li><a href="/api/performance/salesman/1/year/2025">GET /api/performance/salesman/1/year/2025</a></li>
    </ul>
  `);
});

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
