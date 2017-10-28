var express = require('express');
var router = express.Router();
var configJSON = require('../config.json');
var async = require('async');
var confessionModel = require('../schemas/confessions.js');
var userModel = require('../schemas/users.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  async.waterfall([
  	function(next) {
  		userModel.find({}, function(err, result) {
	  		if(err) return next('EGETLISTUSR: '+ err);
	  		next(null, { 
	  			title: 'Deadly Game',
	  			currentUsername: req.session.username, 
	  			usrList: result, 
	  			ruleArr: configJSON.rule, 
	  			typeArr: configJSON.type
	  		})
		})
	}, function(payload, next) {
		confessionModel.find({})
		.sort({createdAt: -1})
		.exec(function(err, result) {
	  		if(err) return next('EGETLISTCONFSS: '+ err);
  			payload.confessArr = result;
	  		next(null, payload);
		})
	}
  ], function(err, payload) {
  	if(err){
  		console.log(err)
		return res.send('Something went wrong -> Contact admin now');
	}
	return res.render('index', payload);
  })
});
router.post('/add-confession', function(req, res) {
	var type = req.body.type; 
	var content = req.body.rule;
	var location = req.body.location;
	var player = req.body.username;
	if(!(type && content && location && player)) return res.status(400).send('Missing form field');
	if(req.session.username !== player) return res.status(400).send('Hey! just confess ur self dude');
	var confession = new confessionModel({
		type, content, location, player
	})
	async.waterfall([
		function(next) {
			confession.save(function(err) {
				if(err) return next('ESAVECONFSS: ' + err);
				return next(null)
			})
		},function(next) {
			userModel.update({username: player}, {$inc: {score: 1}}, function(err) {
				if(err) return next('EINCSCORE: ' + err);
				return next();
			})
		} ,
		function(next){
			confessionModel.find({player: player})
			.sort({createdAt: -1})
			.exec(function(err ,result) {
	  			if(err) return next('EGETLISTCONFSS: '+ err);
  				next(null, result)
			})
		}
	],function(err, payload) {
		if(err) return res.status(400).send('Error occoured when add confession');
		res.setHeader('Score', payload.length);
		return res.render('./partials/player-confession-record.jade', {confessArr: payload, usr: {username: player}, ruleArr: configJSON.rule, 
	  			typeArr: configJSON.type});
	})
})
module.exports = router;
