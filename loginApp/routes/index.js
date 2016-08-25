var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

router.get('/sistema', ensureAuthenticated, function(req, res){
	res.render('sistema');
});

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg', 'No estás logueado en el sistema');
		res.redirect('/users/login');
	}
}

module.exports = router;