/**
 * New node file
 */
var requestGen = require('./commons/responseGenerator');
var userSchema = require('./model/userSchema');

exports.getJsonTimeline = function(req, res) {

	var userId = req.session.username;

	if (userId) {

		userSchema.find({userName : userId}, function(err, docs) {

			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			} else {
				if (docs) {
					res.send(requestGen.responseGenerator(200, docs[0].posts));
				} else {
					res.send(requestGen.responseGenerator(401, null));
				}

			}
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
};

exports.getJsonUserTimeline = function(req, res) {

	var userId = req.session.username;
	var visitId = req.param('user');
	console.log(visitId);

	if (userId) {

		userSchema.find({userName : visitId}, function(err, docs) {

			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			} else {
				if (docs) {
					console.log(docs);
					res.send(requestGen.responseGenerator(200, docs[0].posts));
				} else {
					res.send(requestGen.responseGenerator(401, null));
				}

			}
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
};

exports.postStatusTimeline = function(req, res) {
	var postText = req.param('postValue');
	var userId = req.session.username;

	if (userId) {

		userSchema.findOne({userName : userId}, function(err, doc) {

			doc.posts.push({
				user : doc.firstName + " " + doc.lastName,
				postText : postText,
				postTime : new Date()
			});

			doc.save(function(err) {

				if (err) {
					res.send(requestGen.responseGenerator(401, null));
				} else {
					res.send(requestGen.responseGenerator(200, null));
				}
			});

		});

	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
};

exports.postStatusUserTimeline = function(req, res) {
	var postText = req.param('postValue');
	var visitId = req.param('user');
	var userId = req.session.username;
	var username = req.session.name;

	if (userId) {

		userSchema.findOne({userName : visitId}, function(err, doc) {

			doc.posts.push({
				user : username,
				postText : postText,
				postTime : new Date()
			});

			doc.save(function(err) {

				if (err) {
					res.send(requestGen.responseGenerator(401, null));
				} else {
					res.send(requestGen.responseGenerator(200, null));
				}
			});

		});

	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
};

var checkFriendStatus = function(req, res) {

	var userId = req.session.username;

	if (userId) {

		var freindship_status = {
				isFriend : false,
				isRequestSent : false
		};

		userSchema.findOne({userName : userId,'friends.user' : friendName }, function(err, doc) {

			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			} else {
				if (doc) {

					freindship_status.isRequestSent = true;
					var myFriends;
					for (var i = 0; i < doc.friends.length; i++) {
						if (doc.friends[i].user === friendName) {
							myFriends = doc.friends[i];
						}
					}

					if (myFriends.isFriend === true) {
						freindship_status.isFriend = true;
					}
					res.send(requestGen.responseGenerator(200,
							freindship_status));
				} else {
					res.send(requestGen.responseGenerator(200,
							freindship_status));
				}

			}
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
}
exports.sendFriendRequest = function(req, res) {

	var userId = req.session.username;
	var visitId = req.param('user');

	if (userId) {

		userSchema.findOne({userName : visitId}, function(err, doc) {

			doc.friends.push({
				user : userId,
				isFriend : false
			});

			console.log("Doc " + doc);
			doc.save(function(err) {

				if (err) {
					res.send(requestGen.responseGenerator(401, null));
				} else {
					res.send(requestGen.responseGenerator(200, null));
				}
			});
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
};

exports.acceptFriendRequest = function(req, res) {

	var userId = req.session.username;
	var visitId = req.param('user');

	if (userId) {
		userSchema.update({ 'userName' : userId, 'friends.user' : visitId}, { $set : { 'friends.$.isFriend' : true } }, function(err, doc) {
			console.log("Doc " + JSON.stringify(doc));
			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			} else {
				userSchema.findOne({ userName : visitId }, function(err, doc) {

					doc.friends.push({
						user : userId,
						isFriend : true
					});

					console.log("Doc " + doc);
					doc.save(function(err) {

						if (err) {
							res.send(requestGen.responseGenerator(401, null));
						} else {
							res.send(requestGen.responseGenerator(200, null));
						}
					});
				});
			}
			console.log("Going good");
		});

	} else {
		res.send(requestGen.responseGenerator(500, null));
	}

};

exports.ignoreFriendRequest = function(req, res) {

	var userId = req.session.username;
	var visitId = req.param('user');

	if (userId) {

		userSchema.findOne({userName : visitId}, function(err, doc) {

			doc.friends.pull({
				user : userId,
				isFriend : false
			});

			doc.save(function(err) {
				if (err) {
					res.send(requestGen.responseGenerator(401, null));
				} else {
					res.send(requestGen.responseGenerator(200, null));
				}
			});
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
};

exports.checkFriendStatus = checkFriendStatus;
