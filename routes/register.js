var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var userModel = require('../schemas/users.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Deadly Game' });
});
router.post('/', function(req, res){
	var username = req.body.username;
	var passwd = req.body.passwd;
	var name = req.body.name;
	var avatar = req.body.avatar;
	if(!(username && passwd && name && avatar)) return res.send('Missing form fields, go back and regis again!!!');
	return userModel.find({username: username}, function(err, result) {
		if(err) {
			console.log('EFCUSR: ', err)
			return res.send('Something went wrong -> Contact admin now');
		};
		if(result.length !== 0 ) return res.send('user existed!!!');
		var hashPasswd = crypto.createHash('md5').update(passwd + username).digest('hex');
		var user = new userModel({
			username,
			passwd: hashPasswd,
			name,
			avatar,
			score: 0,
		})
		user.save(function(err) {
			if(err) {
				console.log('ESAVEUSR: ', err)
				return res.send('Something went wrong -> Contact admin now');
			};
			return res.send('Created user ' + username);
		})
	}) 
})

module.exports = router;
