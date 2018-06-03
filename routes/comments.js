
const express = require("express"),
      Campground = require("../models/campground"),
      Comment = require("../models/comment");

let router = express.Router({mergeParams: true}),
    middleware = require("../middleware/index");


// show new comment page
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by Id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// create a comment
router.post("/", middleware.isLoggedIn, function(req, res) {
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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

// edit a comment
router.get("/:commentId/edit", middleware.isLoggedIn, middleware.checkUserComment, function(req, res) {
    Comment.findById(req.params.commentId, function(err, comment) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.render("comments/edit", {comment: req.comment, campgroundId: req.params.id});
        }
    });
});

// update comment route
router.put("/:commentId", middleware.isLoggedIn, middleware.checkUserComment, function(req, res) {
    req.body.comment.updated = Date.now();
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy a comment
router.delete("/:commentId", middleware.isLoggedIn, middleware.checkUserComment, function(req, res) {
    Comment.findByIdAndRemove(req.params.commentId, function(err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;
