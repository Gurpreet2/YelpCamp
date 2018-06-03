
const mongoose = require("mongoose")
;

var commentSchema = mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	updated: {
		type: Date,
		default: null
	}
});

module.exports = mongoose.model("Comment", commentSchema);
