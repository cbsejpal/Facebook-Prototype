//register user in mongodo db
var requestGen = require('./commons/responseGenerator');
var crypto = require('crypto');
var userSchema = require('./model/userSchema');

exports.register = function register(req, res) {

	var emailId = req.param('inputUsername'), 
	password = req.param('inputPassword'), 
	firstName = req.param('inputFirstName'), 
	lastName = req.param('inputLastName'), 
	DOB = req.param('inputDOB'), 
	gender = req.param('gender');

	var salt = "theSECRETString";
	password = crypto.createHash('sha512').update(password + salt).digest("hex");

	var newUser = new userSchema({

		userName : emailId,
		password : password,
		firstName : firstName,
		lastName : lastName,
		dateOfBirth : DOB,
		gender : gender
	});

	newUser.save(function(err) {
		if (err) {
			console.log(err);
			// res.send(requestGen.responseGenerator(401, null));
			res.render('failed_Query');
		}

		else {
			console.log('New User created!');
			// res.send(requestGen.responseGenerator(200, null));
			res.render('login', { title : 'Facebook - Login Please' });
		}

	});
};