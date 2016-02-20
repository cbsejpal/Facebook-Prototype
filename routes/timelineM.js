var requestGen = require('./commons/responseGenerator');

var userSchema = require('./model/userSchema');

exports.renderVisitTimeline = function(req, res) {
	var userId = req.session.username;
	var visitId = req.param('username');
	if (userId) {
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if (userId == visitId) {
			res.redirect('/timelineM');
		} else {
			res.render('visit_timeline', {title : 'Timeline',userId : visitId});

		}
	} else {
		res.redirect('/');
	}
}

exports.renderTimeline = function(req, res) {
	var userId = req.session.username;

	if (userId) {
		res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('timeline_new', {title : 'Timeline'});
	} else {
		res.redirect('/');
	}
}

exports.timelineDetails = function(req, res) {

	var userId = req.session.username;

	if (userId) {
		userSchema.findOne({userName : userId}, function(err, doc) {

			if (err)
				throw err;

			else {
				// object of the doc
				if (doc) {
					var data = {
							wholeName : doc.firstName + " " + doc.lastName,
							city : doc.address.city,
							country : doc.address.country,
							userId : doc.userName,
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

exports.userTimelineDetails = function(req, res) {

	var userId = req.session.username;
	var visitId = req.param('user');

	if (userId) {
		userSchema.findOne({userName : visitId}, function(err, doc) {

			if (err)
				throw err;

			else {
				// object of the doc
				if (doc) {
					var isFriend = false, isReqSent = false;
					for (var i = 0; i < doc.friends.length; i++) {
						friend = doc.friends[i];
						if (friend.user == userId) {
							isReqSent = true;
							if (friend.isFriend == true) {
								isFriend = true;
							}
						}
					}

					var data = {
							wholeName : doc.firstName + " " + doc.lastName,
							city : doc.address.city,
							country : doc.address.country,
							userId : doc.userName,
							companyName : doc.workDetails[0].companyName,
							position : doc.workDetails[0].position,
							schoolName : doc.educationDetails[0].schoolName,
							major : doc.educationDetails[0].major,
							isFriend : isFriend,
							isReqSent : isReqSent
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
