var requestGen = require('./commons/responseGenerator');

var userSchema = require('./model/userSchema');
var groupSchema = require('./model/groupSchema');

exports.homepage = function(req, res) {

	var userId = req.session.username;

	if (userId) {
		res.header( 'Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('home_main', { title : 'Home' });
	} else {
		res.redirect('/');
	}

};

exports.getUserName = function(req, res) {

	var userId = req.session.username;

	if (userId) {
		userSchema.findOne({ userName : userId }, function(err, doc) {

			if (err)
				throw err;

			else {
				// object of the doc
				if (doc) {
					var data = {
							name : doc.firstName + " " + doc.lastName
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

exports.newsFeed = function(req, res) {

	var userId = req.session.username;

	if (userId) {
		userSchema.findOne( { userName : userId, $and : [ { $or : [ { 'friends.isFriend' : true }, { userName : userId } ] } ]}, function(err, doc) {

			var myDoc = doc;
			
			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			} else {
				if (doc) {
					// console.log(doc);
					var userFriends = [];
					for (var i = 0; i < doc.friends.length; i++) {
						userFriends.push(doc.friends[i].user);
					}

					userSchema.find({ userName : { $in : userFriends }}, function(err, docs) {
						if (err) {
							res.send(requestGen.responseGenerator(401, null));
						} else {
							if (docs) {
								var data = {
										posts : []
								};


								for (var i = 0; i < doc.posts.length; i++) {

									data.posts.push(doc.posts[i]);
								}

								for (var j = 0; j < docs.length; j++) {
									for (var i = 0; i < docs[j].posts.length; i++) {
										// console.log(i);
										if (docs[j].friends.length > 0)
											for (var k = 0; k < docs[j].friends.length; k++) {
												if (docs[j].friends[k].user === userId)
													data.posts.push(docs[j].posts[i]);
											}
									}
								}

								console.log('myDoc ' + myDoc);
								
								console.log('length: ' + myDoc.groups.length);
								
								if(myDoc.groups.length > 0){
									console.log('inside group schema fn');
									groupSchema.find({groupId: {$in: myDoc.groups[0].groupId }}, function(err, docs){
	
										if(docs.length > 0){
											docs.forEach(function(doc){
												console.log(doc);
												for(var i=0; i<doc.posts.length; i++){
													//if (doc.[k].user === userId)
														data.posts.push(doc.posts[i]);
												}
											});
										}
										data.posts.sort();
										data.posts.reverse();
										res.send(requestGen.responseGenerator(200, data));
									});
								}
								else{
									data.posts.sort();
									data.posts.reverse();
									res.send(requestGen.responseGenerator(200, data));
								}
								
								
							} else {
								var data;

								data.posts.push(doc.posts);

								res.send(requestGen.responseGenerator( 200, data));
							}
						}
					});
				} else {
					res.send(requestGen.responseGenerator(401, null));
				}

			}
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
}

exports.postStatus = function(req, res) {

	var userId = req.session.username;

	var postText = req.param('postValue');

	if (userId) {
		userSchema.findOne({ userName : userId }, function(err, doc) {

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