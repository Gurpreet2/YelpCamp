
// modules
const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      Campground = require("./models/campground"),
      seedDB     = require("./seeds"),
      Comment    = require("./models/comment")
;

// settings
app.use(express.static(__dirname + "public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp");

// load test data
seedDB();

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

// landing page
app.get("/", function(req, res) {
    res.render("landing");
})


// INDEX get campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});


// CREATE post campgrounds
app.post("/campgrounds", function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body["name"];
    var image = req.body["image"];
    var description = req.body["description"];
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log("NEW CAMPGROUND SUCCESSFULLY ADDED: ");
            console.log(newlyCreated);
        }
    });
    // redirect back to campgrounds array
    res.redirect("/campgrounds");
});


// NEW create a new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    // get campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log(campground);
            // render show template with found campground
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// =====================
// == Comments Routes ==
// =====================

app.get("/campgrounds/:id/comments/new", function(req, res) {
    // find campground by Id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add comment to campground
                    campground.comments.push(comment._id);
                    campground.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            // redirect to campground show page
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                }
            });
        }
    });
});


//================================
//============ LISTEN ============
//================================

// start listening for requests
app.listen(process.env.PORT, process.env.HOST, function() {
    console.log("YelpCamp Server up and running on port " + process.env.PORT);
})
