var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var session = require('express-session')

var userModel = require('../schemas/users.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.isLogined == true){
	return res.redirect('/');
  }
  res.render('login', { title: 'Deadly Game' });
});
router.post('/', function(req, res) {
	var username = req.body.username;
	var passwd = req.body.passwd;
	if(!(username && passwd)) return res.send('Missing username or password');
	userModel.findOne({username: username}, function(err, result) {
		if(err) {
			console.log('EFLUSR: ', err)
			return res.send('Something went wrong -> Contact admin now');
		};
		if(!result) return res.send('Wrong username or passwd');
		var hashRequestPasswd = crypto.createHash('md5').update(passwd + username).digest('hex');
		if(hashRequestPasswd !== result.passwd) return res.send('Wrong username or passwd');
		req.session.isLogined = true;
		req.session.username = username;
		return res.redirect('/');
	})
})
module.exports = router;
