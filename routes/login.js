/*
 * check login data in database
 */

var requestGen = require('./commons/responseGenerator');

function signin(req, res) {

	res.render('home', { title : 'Login' });

}

exports.signin = signin;

exports.firstLogIn = function() {
	res.render('login', { title : "Login" });
};
