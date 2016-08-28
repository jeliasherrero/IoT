var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var Client = require('node-rest-client').Client;
var request = require('request');

var User = require('../models/user');

router.get('/update', function(req,res){
	res.render('update', {user: req.user});
});

router.post('/update', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var key = req.body.key;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('name', 'Debes incluir tu nombre').notEmpty();
	req.checkBody('email', 'Debes incluir tu email').notEmpty();
	req.checkBody('email', 'Formato de email no válido').isEmail();
	req.checkBody('username', 'Debes incluir tu usuario').notEmpty();
	req.checkBody('key', 'Debes incluir la key que encontrarás en la caja de tu producto').notEmpty();
	req.checkBody('password', 'Debes incluir una contraseña').notEmpty();
	req.checkBody('password2', 'Las dos contraseñas no coinciden').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors){
		res.render('register', {
			errors: errors
		});
	} else {
		var updateUser = new User({
			name: name,
			email: email,
			username: username,
			key: key,
			password: password
		});

		User.updateUser(updateUser, function(err, user){
			if (err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Actualización correcta. Chequea el sistema.');

		res.redirect('/');
	}
});

router.get('/register', function(req, res){
	res.render('register');
});

router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('name', 'Debes incluir tu nombre').notEmpty();
	req.checkBody('email', 'Debes incluir tu email').notEmpty();
	req.checkBody('email', 'Formato de email no válido').isEmail();
	req.checkBody('username', 'Debes incluir tu usuario').notEmpty();
	req.checkBody('password', 'Debes incluir una contraseña').notEmpty();
	req.checkBody('password2', 'Las dos contraseñas no coinciden').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors){
		res.render('register', {
			errors: errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if (err) throw err;
				console.log(user);
		});

		req.flash('success_msg', 'Registro correcto. Ya puedes loguearte en el sistema');

		res.redirect('/users/login');
	}

});

router.get('/login', function(req, res){
	res.render('login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
    	if (err) throw err;
    	if (!user){
    		return done(null,false, {message: 'Usuario desconocido'});
    	}
    	User.comparePassword(password, user.password, function(err, isMatch){
    		if (err) throw err;
    		if(isMatch){
    			return done(null, user);
    		} else {
    			return done(null, false, {message: 'Contraseña incorrecta'});
    		}
    	});
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'Saliste correctamente del sistema');

	res.redirect('/users/login');
});

module.exports = router;