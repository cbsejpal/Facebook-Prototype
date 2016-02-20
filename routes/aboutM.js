var requestGen = require('./commons/responseGenerator');
var userSchema = require('./model/userSchema');

exports.renderAbout = function(req, res) {
	var userId = req.session.username;

	console.log(userId);
	if (userId) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('about', { title : 'About'});

	} else {
		res.redirect('/');
	}
}

exports.about = function(req, res) {

	var userId = req.session.username;

	if (userId) {
		userSchema.findOne({userName : userId}, function(err, doc) {
			if (err)
				throw err;

			else {
				// object of the doc
				if (doc) {
					// console.log(doc);
					// res.header('Cache-Control', 'no-cache, private, no-store,
					// must-revalidate, max-stale=0, post-check=0,
					// pre-check=0');
					// res.render('home_main', { title: 'Home'});
					var data = {
							music : doc.interests.music,
							shows : doc.interests.shows,
							sports : doc.interests.sports,
							city : doc.address.city,
							country : doc.address.country,
							phoneNumber : doc.phoneNumber,
							relationship : doc.relationship,
							emailId : doc.userName,
							dateOfBirth : doc.dateOfBirth,
							companyName : doc.workDetails[0].companyName,
							position : doc.workDetails[0].position,
							schoolName : doc.educationDetails[0].schoolName,
							major : doc.educationDetails[0].major
					};
					res.send(requestGen.responseGenerator(200, data));
				} else {
					console.log("Error!");
					// res.render('failed_login');
					res.send(requestGen.responseGenerator(401, null));
				}
			}
		});

	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
};