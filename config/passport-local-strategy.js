const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//authetnication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done) {
        //find a user and establish the identity
        User.findOne({ email: email }, function(err, user) {
            if (err) {
                console.log('Error in finding User --> Passport');
                return done(err);
            }

            if (!user || user.password != password) {
                console.log('Invalid UserName & Password');
                return done(null, false);
            }
            return done(null, user);
        })
    }));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) {
    done(null, user.id); //automatically encrpyts
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if (err) {
            console.log('Error in finding User --> passport');
            return done(err);
        }
        return done(null, user);
    });
});


//check if the user is authentiacted
passport.checkAuthentication = function(req, res, next) {
    // if the user is signed in, then pass on the requset to the next function(controller's action)
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in')
}


passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contains the current signed in user from the session cookie and we r just sending this to the local for the views
        res.locals.user = req.user;
    }
    next();
}




module.exports = passport;