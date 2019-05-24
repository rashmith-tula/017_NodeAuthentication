var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    User = require("./models/user"),
    bodyParser = require("body-parser"),
    eSession = require("express-session"),
    passport = require("passport"),
    psptlocl = require("passport-local"),
    psptmngs = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/authentication");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(eSession({ secret: "Hare Krishna Hare Rama", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new psptlocl(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res) {
    res.render("login");
});

app.get("/signup", function(req, res) {
    res.render("signup");
});

app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});

app.post("/signup", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/secret");
        });
    });
});


//login logic
//middleware
app.post("/login", passport.authenticate("local", { successRedirect: "/secret", failureRedirect: "/" }), function(req, res) {

});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Running your app...");
});
