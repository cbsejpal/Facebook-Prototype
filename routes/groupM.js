/**
 * New node file
 */
var groupSchema = require('./model/groupSchema');
var userSchema = require('./model/userSchema');
var requestGen = require('./commons/responseGenerator');

function listGroupsOfUserPage(req, res) {
	var userId = req.session.username;

	if (userId) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('groups_user', { title : 'Groups' });
	} else {
		res.redirect('/');
	}
}

function groupInfoPage(req, res) {
	var userId = req.session.username;

	if (userId) {
		res.header( 'Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('group_home', { title : 'Group', group_id : req.param('group_id')});
	} else {
		res.redirect('/');
	}
}

var createGroup = function(req, res) {

	var group_name = req.param('group_name');
	var group_desc = req.param('group_desc');
	var members_to_add = req.param('add_friends');
	// var userID = req.session.userId;
	var userId = req.session.username;
	var userName = req.session.name;

	var memberArray = [];

	console.log(members_to_add);

	memberArray.push({ 
		memberId : userId,
		memberName : userName
	});

	if (members_to_add = !'undefined') {
		members_to_add.forEach(function(element, index, array) {
			memberArray.push({
				memberId : element.userId,
				memberName : element.userName
			});
		});
	}
	var groupInfo = new groupSchema({
		groupName : group_name,
		description : group_desc,
		adminId : userId,
		members : memberArray
	});

	console.log(JSON.stringify(groupInfo));

	groupInfo.save(function(err) {
		if (err) {
			console.log("Error !");
			res.send(requestGen.responseGenerator(401, null));
		}

		else {
			console.log('New Group created!');
			addGroupToUsers();
			res.send(requestGen.responseGenerator(200, null));
		}

	});
	
	var addGroupToUsers = function(){
	
		var membersId = [];
		
		for(var i=0; i<memberArray.length;i++){
			membersId.push(memberArray[i].memberId);
		}
		
		console.log("members " + membersId);
		
		var groupId;
		
		console.log("group name " + group_name);
		
		groupSchema.findOne({groupName:  group_name}, function(err, doc){
			
			console.log("group doc" + doc);
			console.log("doc group id" + doc.groupId);
			console.log("doc group name" + doc.groupName);
			console.log("doc adminId" + doc.adminId);
			
			groupId = doc.groupId;
		});
		
		console.log("group id " + groupId);
		
		userSchema.find({userName: {$in: membersId}}, function(err, docs){
			
			docs.forEach(function(doc){
				doc.groups.push({
					groupId: groupId
				});
				doc.save();
				console.log("user doc with groups: " + doc);
			});
		});
		
	};
	
}

var getGroupList = function(req, res) {
	var userId = req.session.username;

	if (userId) {
		groupSchema.find({ 'members.memberId' : userID }, function(err, groups) {
			if (err)
				throw err;

			else {
				// object of the user
				if (groups.length > 0) {
					console.log(groups);
					var groupList = [];

					groups.forEach(function(element, index, array) {
						groupList.push({
							groupId : element.groupId,
							groupName : element.groupName
						});
					});

					res.send(requestGen.responseGenerator(200, groupList));
				} else {
					console.log("No group Found");
					// res.render('failed_login');
					res.send(requestGen.responseGenerator(401, null));
				}
			}
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
}

var getGroupTopList = function(req, res) {
	var userId = req.session.username;
	console.log(userId);
	if (userId) {

		groupSchema.find({ 'members.memberId' : userId }).sort({ 'group_id' : -1 }).limit(5).exec(function(err, groups) {
			if (err)
				throw err;

			else {
				// object of the user
				if (groups.length > 0) {
					console.log(groups);
					var groupList = [];

					groups.forEach(function(element, index, array) {
						groupList.push({
							groupId : element.groupId,
							groupName : element.groupName
						});
					});

					res.send(requestGen.responseGenerator(200, groupList));
				} else {
					console.log("No group Found");
					// res.render('failed_login');
					res.send(requestGen.responseGenerator(401, null));
				}
			}
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));

	}
}

var getGroupInfo = function(req, res) {
	var groupID = req.param('group_id');
	var userId = req.session.username;

	if (userId) {

		groupSchema.findOne({ groupId : groupID }, function(err, doc) {
			var is_member = false;
			var is_admin = false;
			if (doc.adminId == userId) {
				is_admin = true;
			}

			for (var i = 0; i < doc.members.length; i++) {
				if (doc.members[i].memberId == userId) {
					is_member = true;
				}
			}

			var group = {
					groupname : doc.groupName,
					groupDescription : doc.description,
					adminID : doc.adminId,
					member_list : doc.members,
					is_admin : is_admin,
					is_member : is_member
			};

			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			} else {
				res.send(requestGen.responseGenerator(200, group));
			}
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
}

var getGroupMember = function(req, res, data) {
	var groupID = req.param('group_id');

	groupSchema.findOne({ groupId : groupID }, function(err, doc) {

		if (err) {
			res.send(requestGen.responseGenerator(401, null));
		} else {
			res.send(requestGen.responseGenerator(200, doc.members));
		}
	});
}

var getGroupPost = function(req, res) {
	var groupID = req.param('group_id');
	var userId = req.session.username;

	if (userId) {

		groupSchema.findOne({ groupId : groupID	}, function(err, doc) {

			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			} else {
				doc.posts.sort();
				doc.posts.reverse();
				res.send(requestGen.responseGenerator(200, doc.posts));
			}
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
}

var postInGroup = function(req, res) {
	var groupID = req.param('group_id');
	// var userID = req.session.userId;
	var status = req.param('post_status');
	var userId = req.session.username;
	var username = req.session.name;
	if (userId) {

		groupSchema.findOne({ groupId : groupID }, function(err, doc) {

			doc.posts.push({
				user : username,
				postText : status,
				postTime : new Date()
			});

			doc.save(function(err) {

				if (err) {
					res.send(requestGen.responseGenerator(401, null));
				} else {
					console.log("Adding post to group: " + userId);
					res.send(requestGen.responseGenerator(200, null));
				}
			});
		});
	} else {
		res.send(requestGen.responseGenerator(500, null));
	}
}

var addInGroup = function(req, res) {

	var groupID = req.param('group_id');
	var userID = req.param('user_id');
	var user_name = req.param('user_name');
	// var userID = "wayne@gmail.com";

	groupSchema.findOne({ groupId : groupID }, function(err, doc) {

		doc.members.push({
			memberId : userID
		});

		doc.save(function(err) {

			if (err) {

				res.send(requestGen.responseGenerator(401, null));
			} else {

				res.send(requestGen.responseGenerator(200, null));
			}
		});
	});

}

var joinGroup = function(req, res) {

	var groupID = req.param('group_id');
	// var userID = req.param('user_id');
	var userId = req.session.username;
	var userName = req.session.name;
	if (userId) {

		groupSchema.findOne({ groupId : groupID	}, function(err, doc) {

			doc.members.push({
				memberId : userId,
				memberName : userName
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
}

var leaveGroup = function(req, res) {
	var groupID = req.param('group_id');
	var userId = req.session.username;
	var username = req.session.name;

	var member = {
			memberId : userId,
			memberName : username
	};

	if (userId) {

		groupSchema.findOne({ groupId : groupID }, function(err, doc) {

			doc.members.remove(member);
			console.log("Removing memebr: " + userId);

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
}

var removeMember = function(req, res) {
	var groupID = req.param('group_id');
	var userID = req.param('user_id');
	var userName = req.param('user_name');

	var member = {
			memberId : userID,
			memberName : userName
	};

	groupSchema.findOne({ groupId : groupID }, function(err, doc) {

		doc.members.remove(member);
		console.log("Removing memebr: " + userID);

		doc.save(function(err) {

			if (err) {
				res.send(requestGen.responseGenerator(401, null));
			} else {
				res.send(requestGen.responseGenerator(200, null));
			}
		});
	});
}

exports.createGroup = createGroup;
exports.getGroupList = getGroupList;
exports.getGroupTopList = getGroupTopList;
exports.getGroupInfo = getGroupInfo;
exports.getGroupMember = getGroupMember;
exports.getGroupPost = getGroupPost;
exports.postInGroup = postInGroup;
exports.listGroupsOfUserPage = listGroupsOfUserPage;
exports.groupInfoPage = groupInfoPage;
exports.joinGroup = joinGroup;
exports.addInGroup = addInGroup;
exports.leaveGroup = leaveGroup;
exports.removeMember = removeMember;