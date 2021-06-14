
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const teacherRoutes = require('./api/routes/teachers');
const classesRoutes = require('./api/routes/classes');
const studentRoutes = require('./api/routes/students');
const userRoutes = require('./api/routes/login');
const passport = require('./auth');
const MongoStore = require('connect-mongo');

mongoose.connect(process.env.MONGODB_URI || "");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin"), "*";
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    secret: "secert",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongoUrl: ""})
}));

app.use('/teachers', teacherRoutes);
app.use('/classes', classesRoutes);
app.use('/students', studentRoutes);
app.use('/login', userRoutes);



app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



module.exports = app;