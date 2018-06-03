
const express = require("express"),
      Campground = require("../models/campground");

let router = express.Router(),
    middleware = require("../middleware");



// INDEX get campgrounds
router.get("/", function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array
    req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
    }
    //var newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(req.body.campground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            // redirect back to campgrounds array
            req.flash("success", "Created a new campground!");
            res.redirect("/campgrounds");
        }
    });
});


// NEW create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    // get campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if (err || !campground) {
            console.log(err);
            req.flash("error", "Campground does not exist!");
            res.redirect("/campgrounds");
        } else {
            // render show template with found campground
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkUserCampground, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: req.campground});
        }
    });
});

// UPDATE
router.put("/:id", middleware.isLoggedIn, middleware.checkUserCampground, function(req, res) {
    req.body.campground.updated = Date.now();
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Updated the campground!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE
router.delete("/:id", middleware.isLoggedIn, middleware.checkUserCampground, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Deleted the campground!");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
