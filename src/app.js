require('dotenv').config(); // get .env stuffs
require('./strategies/discordstrategy');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
// register express session with MongoStore
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const db = require('./database/database');
const path = require('path');

db.then(() => console.log('Connected to MongoDB.')).catch(err => console.log(err));

// Routes for different page sections
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');

app.use(session({
    secret: 'some random secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false, // session management
    resave: false,
    name: 'discord.oauth2',
    // Session Store for users to stay logged in
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.set('view engine', 'ejs'); // pug and jade also exist
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute); // applies middlewares to application.
app.use('/dashboard', dashboardRoute);

// Middleware function doing checks on users' discord logins. 
function isAuthorized(req, res, next) {
    if (req.user) {
        console.log("Main: User is logged in.");
        res.redirect('/dashboard');
    }
    else {
        console.log("Main: User is not logged in.");
        next();
    }
}


app.get('/', isAuthorized, (req, res) => {
    res.render('home', {
        users: [
            {name: 'Anson', email: 'anson@gmail.com'},
            {name: 'Greg', email: 'greg@gmail.com'},
            {name: 'Chris', email: 'chris@gmail.com'},
            {name: 'Dan', email: 'dan@gmail.com'},
            {name: 'Drew', email: 'drew@gmail.com'}
        ]
    });
});


app.listen(PORT, () => {
    console.log(`Now listening to requests on port ${PORT}`);
});


