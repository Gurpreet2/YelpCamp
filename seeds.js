
const mongoose   = require("mongoose"),
      Campground = require("./models/campground"),
      Comment    = require("./models/comment")
;

const data = [
	{
		name: "Frozen Mountain",
		image: "/pictures/photo-frozen-mountain-light.jpeg",
		description: "Close to the peak of an ice mountain! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Beach Fun",
		image: "/pictures/photo-juice-on-the-beach.jpeg",
		description: "Camping on the beach? Why not! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Mountain Camp",
		image: "/pictures/photo-mountains.jpeg",
		description: "Lets go camping in the mountains! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
];

function seedDB() {
	// Remove all campgrounds
	Campground.remove({}, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Deleted all campgrounds!");
			// add a few campgrounds
			data.forEach(function(seed) {
				Campground.create(seed, function(err, campground) {
					if (err) {
						console.log(err);
					} else {
						console.log("Added a campground!");
						campground.author = {id: "5afb70f3fc779013de84f37e", username: "abc"};
						campground.save();
						// create a comment on each campground
						Comment.create(
							{
								text: "This place is great, but I wish there was internet!",
								author: {
									id: "5afb70f3fc779013de84f37d",
									username: "Homer"
								}
							}, function (err, comment) {
								if (err) {
									console.log(err);
								} else {
									campground.comments.push(comment);
									campground.save();
									console.log("Created a new comment");
								}
							});
					}
				});
			});
		}
	});
	// add a few comments
}

module.exports = seedDB;
