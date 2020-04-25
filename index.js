const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);

//accesing form data with this middleware
app.use(express.urlencoded({ extended: true }));


//assign cookie parser
app.use(cookieParser());

//accessing staitic files and layouts
app.use(express.static('./assets'));
app.use(expressLayouts);


//extract styles and sctipts from the sub-folder into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'Social',
    // Todo change the secret before deployment in production node
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }),
    function(err) {
        console.log(err || 'connect-mongodb setup ok');
    }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//middleware to access route folder
app.use('/', require('./routes'));


app.listen(port, function(err) {
    if (err) {
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
})