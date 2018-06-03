
var Campground = require("../models/campground");
var Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that!");
    res.redirect("/login");
}


// middlewareObj.checkCampgroundOwnership = function(req, res, next) {
//     // is user logged in
//     if (req.isAuthenticated()) {
//         Campground.findById(req.params.id, function(err, campground) {
//             if (err) {
//                 res.redirect("back");
//             } else {
//                 // does user own the campground?
//                 if (campground.author.id.equals(req.user._id)) {
//                     next();
//                 } else { // if not redirect somewhere
//                     req.flash("error", "You don't have permission to do that!");
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else { // otherwise redirect
//         req.flash("error", "You must be logged in to do that!");
//         res.redirect("/login");
//     }
// }


// middlewareObj.checkCommentOwnership = function(req, res, next) {
//     if (req.isAuthenticated()) {
//         Comment.findById(req.params.commentId, function(err, comment) {
//             if (err) {
//                 console.log(err);
//                 res.redirect("back");
//             } else {
//                 if (comment.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     // unauthorized
//                     req.flash("error", "You don't have permission to do that!");
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         req.flash("error", "You must be logged in to do that!");
//         res.redirect("/login");
//     }
// }

middlewareObj.checkUserCampground = function(req, res, next) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err || !campground) {
            req.flash("error", "That campground does not exist!");
            res.redirect("/campgrounds");
        } else if (campground.author.id.equals(req.user._id)) {
            req.campground = campground;
            next();
        } else {
            req.flash("error", "You don't have permission to do that!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
}

middlewareObj.checkUserComment = function(req, res, next) {
    Comment.findById(req.params.commentId, function(err, comment) {
        if (err || !comment) {
            req.flash("error", "That comment does not exist!");
            res.redirect("/campgrounds/" + req.params.id);
        } else if (comment.author.id.equals(req.user._id)) {
            req.comment = comment;
            next();
        } else {
            req.flash("error", "You don't have permission to do that!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
}


module.exports = middlewareObj;
