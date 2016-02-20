var merger = require('underscore');
var requestGen = require('./commons/responseGenerator');

var userSchema = require('./model/userSchema');

exports.renderer = function(req, res) {
	res.render('frnd_view_renderer');
}

exports.list = function(req, res) {

	var userId = req.session.username;

	if (userId) {
		userSchema.findOne({userName : userId},function(err, doc) {

			var myDoc = doc;

			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			}

			else {
				if (doc) {
					var userFriends = [];
					for (var i = 0; i < doc.friends.length; i++) {
						userFriends.push(doc.friends[i].user);
					}
					userSchema.find({userName : { $in : userFriends }}, function(err, docs) {
						if (err) {
							res.send(requestGen.responseGenerator(401,null));
						} else {
							if (docs) {

								var data = [];

								docs.forEach(function(doc) {

									for (var j = 0; j < myDoc.friends.length; j++) {
										if (myDoc.friends[j].user === doc.userName&& myDoc.friends[j].isFriend === true) {
											data.push({
												name : doc.firstName + " " + doc.lastName,
												isFriend : myDoc.friends[j].isFriend
											});
										}
									}
								});

								res.send(requestGen.responseGenerator(200,data));
							} else {
								res.send(requestGen.responseGenerator(401,null));
							}
						}
					});
				} else {
					res.send(requestGen.responseGenerator(401,null));
				}
			}

		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}

};

exports.pendingList = function(req, res) {
	// var session_id = req.session.userId;

	var userId = req.session.username;

	if (userId) {
		userSchema.findOne({userName : userId, 'friends.isFriend' : false }, function(err, doc) {

			var myDoc = doc;

			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			}

			else {
				if (doc) {
					console.log(doc);
					var userFriends = [];
					for (var i = 0; i < doc.friends.length; i++) {
						if (!doc.friends[i].isFriend)
							userFriends.push(doc.friends[i].user);
					}

					userSchema.find({userName : {$in : userFriends}},function(err, docs) {
						if (err) {
							res.send(requestGen.responseGenerator(401,null));
						} 
						else {
							if (docs) {

								var data = [];

								docs.forEach(function(doc) {

									for (var j = 0; j < myDoc.friends.length; j++) {
										if (myDoc.friends[j].user === doc.userName) {
											data.push({
												user : doc.userName,
												name : doc.firstName+ " "+ doc.lastName
											});
										}
									}
								});

								res.send(requestGen.responseGenerator(200,data));
							} else {
								res.send(requestGen.responseGenerator(401,null));
							}
						}
					});
				} else {
					res.send(requestGen.responseGenerator(401,null));
				}
			}

		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
};
