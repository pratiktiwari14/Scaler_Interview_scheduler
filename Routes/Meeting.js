const router = require('express').Router();
const Meeting = require("../Model/Meeting");
const User = require("../Model/User");
const moment = require('moment');

// create Meeting
router.post("/", async (req, res) => {
	try {
		if (req.body.users.length < 2) {
			res.status(400).json({ error: "time", desc: "meeting participant should be more than or equal to 2" });
		}
		else if (req.body.startTime > req.body.endTime) {
			res.status(400).json({ error: "time", desc: "start time should be less than the end time" });
		}
		else if (moment().isAfter(req.body.startTime)) {
			res.status(400).json({ error: "time", desc: "Start time should be more than the current time" });
		}
		else {
			let users = req.body.users;
			let startTime = req.body.startTime;
			let endTime = req.body.endTime;

			const allMeeting = await Meeting.find();

			let collideMeetingUser = new Set([]);
			let collideUser = [];
			allMeeting.forEach(m => {
				if (!(moment(m.startTime).isAfter(endTime) || moment(m.endTime).isBefore(startTime))) {
					m.users.forEach(u => collideMeetingUser.add(u.toString()));
				}
			})
			for (i = 0; i < users.length; i++) {
				if (collideMeetingUser.has(users[i])) {
					collideUser.push(users[i]);
				}
			}

			if (collideUser.length !== 0) {
				let arr = [];
				for (i = 0; i < collideUser.length; i++) {
					let userDetail = await User.findById(collideUser[i])
					arr.push(userDetail.email);
				}
				console.log(arr);
				res.status(400).json({ error: "collide", desc: "Following users are busy at mention time", users: arr });
			}
			else {
				const newMeeting = await new Meeting(req.body);
				const meeting = await newMeeting.save();
				res.status(200).json(meeting);
			}
		}
	} catch (error) {
		res.status(500).json(error.message);
	}
})
// update Meeting
router.put("/:meetingId", async (req, res) => {
	try {
		if (req.body.users.length < 2) {
			res.status(400).json({ error: "time", desc: "meeting participant should be more than or equal to 2" });
		}
		else if (req.body.startTime > req.body.endTime) {
			res.status(400).json({ error: "time", desc: "start time should be less than the end time" });
		}
		else if (moment().isAfter(req.body.startTime)) {
			res.status(400).json({ error: "time", desc: "Start time should be more than the current time" });
		}
		else {
			let users = req.body.users;
			let startTime = req.body.startTime;
			let endTime = req.body.endTime;

			const allMeeting = await Meeting.find();

			let collideMeetingUser = new Set([]);
			let collideUser = [];
			allMeeting.forEach(m => {
				if (!(moment(m.startTime).isAfter(endTime) || moment(m.endTime).isBefore(startTime)) && m._id != req.params.meetingId) {
					m.users.forEach(u => collideMeetingUser.add(u.toString()));
				}
			})
			for (i = 0; i < users.length; i++) {
				if (collideMeetingUser.has(users[i])) {
					collideUser.push(users[i]);
				}
			}

			if (collideUser.length !== 0) {
				let arr = [];
				for (i = 0; i < collideUser.length; i++) {
					let userDetail = await User.findById(collideUser[i])
					arr.push(userDetail.email);
				}
				res.status(400).json({ error: "collide", desc: "Following users are busy at mention time", users: arr });
			}
			else {
				const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.meetingId, { $set: req.body }, { new: true });
				res.status(200).json(updatedMeeting);
			}
		}
	}
	catch (err) {
		res.status(500).json(err.message);
	}
})
//delete Meeting
router.delete("/:meetingId", async (req, res) => {
	try {
		await Meeting.findByIdAndDelete(req.params.meetingId);
		res.status(200).json("meeting deleted");
	} catch (error) {
		res.status(400).json(error.message);
	}
})
//get all meeting
router.get("/", async (req, res) => {
	try {
		const meeting = await Meeting.find().populate("users");
		res.status(200).json(meeting)
	} catch (error) {
		res.status(400).json(error.message)
	}
})
//get meeting detail
router.get("/:meetingId", async (req, res) => {
	try {
		const meeting = await Meeting.findById(req.params.meetingId).populate("users");
		res.status(200).json(meeting)
	} catch (error) {
		res.status(400).json(error.message)
	}
})

module.exports = router;
