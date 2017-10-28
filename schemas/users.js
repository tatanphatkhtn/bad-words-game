const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let playerSchema = Schema({
	name: String,
	isAdmin: {type: Boolean, default: false},
	score: Number,
	username: String,
	passwd: String,
	avatar: String,
})
playerSchema.index({
	name: 1,
	score: 1,
	username: 1,
})
module.exports = mongoose.model('player', playerSchema);