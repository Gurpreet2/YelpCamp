
// modules
const express    = require("express"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      flash      = require("connect-flash"),
      passport   = require("passport"),
      LocalStrategy = require("passport-local"),
      Campground = require("./models/campground"),
      User          = require("./models/user"),
      seedDB     = require("./seeds"),
      Comment    = require("./models/comment"),
      methodOverride = require("method-override")
;

var app = express(),
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")
;

// settings
app.locals.moment = require("moment");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/assets"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.disable('x-powered-by');

// db settings
mongoose.connect("mongodb://localhost/yelp_camp");
let db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function() {
    console.log("CONNECTED TO DATABASE!");
});
//seedDB(); // seed the database

// passport configuration
app.use(require("express-session")({
    secret: "asdfneu9f3bfuq39fh",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://images.unsplash.com/photo-1499363536502-87642509e31b",
//         description: "This is a huge granite hill. No bathrooms. No water. Just beautiful granite!"
//     }, function(err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEW CAMPGROUND ADDED: ");
//             console.log(campground);
//         }
//     });

//================================
//============ ROUTES ============
//================================

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//================================
//============ LISTEN ============
//================================

// start listening for requests
app.listen(process.env.PORT, process.env.HOST, function() {
    console.log("YelpCamp Server up and running on port " + process.env.PORT);
})
