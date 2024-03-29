
const mongoose = require("mongoose");

function createPrice() {
      return Math.floor(10 + Math.random() * 50);
}

const campgroundSchema = new mongoose.Schema({
      name: String,
      image: String,
      description: String,
      author: {
            id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User"
            },
            username: String
      },
      comments: [
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Comment"
            }
      ],
      price: {
            type: String,
            default: createPrice
      },
	updated: {
		type: Date,
		default: null
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);

