var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/properties/add', ensureAuthenticated, ensureServerOnline, function(req, res){
	res.render('propAdd');
});

router.get('/', ensureAuthenticated, ensureServerOnline, function(req, res){
	res.render('index');
});

router.get('/sistema', ensureAuthenticated, ensureServerOnline, function(req, res){
	var sensors, actions;
	request({
		rejectUnauthorized: false,
		uri: "https://domoticuz.duckdns.org:8484/properties?token=cKXRTaRylYWQiF3MICaKndG4WJMcVLFz",
		headers: {'Accept': 'application/json'},
	  method: "GET"
	}, function(error, response, body){
		if (error) {
			console.log(error);
		}
		sensors = JSON.parse(body);
		request({
			rejectUnauthorized: false,
			uri: "https://domoticuz.duckdns.org:8484/actions?token=cKXRTaRylYWQiF3MICaKndG4WJMcVLFz",
			headers: {'Accept': 'application/json'},
		  method: "GET"
		}, function(error, response, body){
			if (error) {
				console.log(error);
			}
			actions = JSON.parse(body);
			res.render('sistema', {
				sensors: sensors,
				actions: actions,
				user: req.user
			});
	});
	});
});

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg', 'No estás logueado en el sistema');
		res.redirect('/users/login');
	}
}

function ensureServerOnline(req, res, next){
	request({
		url: "http://eliasherrero.es:4000/",
	  method: "POST",
	  json: {
	    name: req.user.name,
	    username: req.user.username,
	    authorization: req.user.key
	  }
	}, function(error, response, body){
		if (error) {
			req.flash('error_msg', 'El servidor general está apagado.');
			return next();
		}
		req.flash('success_msg', 'Servidor general funcionando correctamente y los datos personales son correctos.');
		return next();
	});
}

module.exports = router;