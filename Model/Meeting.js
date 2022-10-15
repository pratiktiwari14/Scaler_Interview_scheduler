const mongoose = require('mongoose');
const MeetingSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Meeting title required"],
	},
	users:[
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	],
	startTime:{
		type:Date,
		required:[true,"start time required"]
	},
	endTime:{
		type:Date,
		required:[true,"end time required"]
	}
}, { timestamps: true })

module.exports = mongoose.model("Meeting", MeetingSchema);