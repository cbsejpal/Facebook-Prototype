//login using mongodb
var crypto = require('crypto');
var userSchema = require('./model/userSchema');

var requestGen = require('./commons/responseGenerator');

exports.login = function login(req, res) {

	var emailId = req.param('emailId');
	var password = req.param('password');

	var salt = "theSECRETString";
	var newPassword = crypto.createHash('sha512').update(password + salt).digest("hex");
	console.log(newPassword);

	userSchema.find( { userName : emailId, password : newPassword }, function(err, user) {
		if (err)
			throw err;

		else {
			// object of the user
			if (user.length > 0) {
				console.log(user);
				req.session.username = user[0].userName;
				req.session.id = user[0].userId;
				req.session.name = user[0].firstName + ' ' + user[0].lastName;
				console.log("Request session : " + req.session.username);

				res.header( 'Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				if (req.param("firstLogIn") == "yes") {
					res.render( "addProfile", { title : 'Facebook - Add Profile Information' });
				} else {

					res.render('home_main', { title : 'Home' });
				}
				// res.send(requestGen.responseGenerator(200,  null));
			} else {
				console.log("Wrong pwd/uname");
				res.render('failed_login');
				// res.send(requestGen.responseGenerator(401, null));
			}
		}
	});
};