var requestGen = require('./commons/responseGenerator');

var userSchema = require('./model/userSchema');

exports.profile = function(req, res) {

	var userId = req.session.username;
	console.log(req.session.username);

	if (userId) {

		var schoolName = req.param("schoolName"), 
		major = req.param("major"), 
		e_startDate = req.param("eStartDate"),
		e_endDate = req.param("eEndDate"), 
		companyName = req.param("companyName"),
		position = req.param("position"), 
		w_startDate = req.param("wStartDate"), 
		w_endDate = req.param("wEndDate"),
		phoneNumber = req.param("phoneNumber"), 
		relationship = req.param("relationship"), 
		city = req.param("city"),
		country = req.param("country"), 
		music = req.param("music"), 
		shows = req.param("shows"), 
		sports = req.param("sports");

		userSchema.findOne( { userName : userId }, function(err, doc) {

			doc.educationDetails.push({
				schoolName : schoolName,
				major : major,
				startDate : e_startDate,
				endDate : e_endDate
			});

			doc.workDetails.push({
				companyName : companyName,
				position : position,
				startDate : w_startDate,
				endDate : w_endDate
			});

			doc.phoneNumber = phoneNumber;
			doc.relationship = relationship;

			doc.interests.music = music;
			doc.interests.shows = shows;
			doc.interests.sports = sports;

			doc.address.city = city;
			doc.address.country = country;

			doc.save(function(err) {

				if (err) {

					res.render('failed_Query');
				} else {
					res.header( 'Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('home_main', { title : "Home" });
				}
			});

		});

	} else {
		res.send(requestGen.responseGenerator(401, null));
	}
};