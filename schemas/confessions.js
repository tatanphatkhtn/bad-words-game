const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let confessionSchema = Schema({
	player: String,
	type: String,
	content: String,
	location: String,
	createdAt: {type: Date, default: Date.now}
})
confessionSchema.index({
	player: 1,
	type: 1,
	content: 1,
	location: 1,
	createdAt: 1
})
module.exports = mongoose.model('confession', confessionSchema);