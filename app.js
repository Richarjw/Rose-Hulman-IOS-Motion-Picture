const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
// Re-enable this when we implement JWTs
// const logger = require('morgan');
// const cookieParser = require('cookie-parser');
// const expressSession = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

// Logging Service
const fs = require("fs");

var logFile = fs.createWriteStream("log.log", {flags: 'w'});

const index = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(cookieParser());
// app.use(expressSession({
//     secret: 'tempPrivateString',
//     resave: true,
//     saveUninitialized: false,
//     cookie: {secure: true}
// }));
app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    // uncomment to enable Access-Control-Allow-Credentials CORS header
    // credentials: true,
    methods: ['POST', 'GET', 'PUT']
}));

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use(function(req, res, next) {
    logFile.write("timeStamp: " + new Date().toISOString() + '\n');
    logFile.write("url: " + req.url + '\n');
    logFile.write("method: " + req.method + '\n');
    logFile.write("auth: " + req.headers.authorization + '\n');
    logFile.write('\n');
    next();
});

// ==================================================================
//                            Rouing
// ==================================================================

app.use('/', index);

// ==================================================================
//                          Error Handling
// ==================================================================

app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development Error Handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Error Handler
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

module.exports = app;
