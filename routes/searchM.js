/**
 * New node file
 */
var requestGen = require('./commons/responseGenerator');
var userSchema = require('./model/userSchema');
var groupSchema = require('./model/groupSchema');

exports.renderSearch = function(req, res) {
	var userId = req.session.username;
	var searchText = req.param('searchValue');

	console.log(userId);
	if (userId) {
		res.header( 'Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('SearchResults', { title : 'Search', searchText : searchText });

	} else {
		res.redirect('/');
	}
}

exports.userSearch = function(req, res) {

	var searchText = req.param('searchValue');
	console.log("user: " + searchText);
	var data = [];

	userSchema.find({ $or : [ { userName : new RegExp(searchText, 'i')},
	                          { firstName : new RegExp(searchText, 'i')},
	                          { lastName : new RegExp(searchText, 'i') } ]}, function(err, docs) {
	                        	  if (err) {
	                        		  res.send(requestGen.responseGenerator(401, null));
	                        	  } else {

	                        		  if (docs.length > 0) {

	                        			  docs.forEach(function(doc) {
	                        				  data.push({
	                        					  userId : doc.userName,
	                        					  firstName : doc.firstName,
	                        					  lastName : doc.lastName
	                        				  });
	                        			  });

	                        			  res.send(requestGen.responseGenerator(200, data));

	                        		  } else {
	                        			  res.send(requestGen.responseGenerator(200, null));
	                        		  }

	                        	  }
	                          });

};
exports.groupSearch = function(req, res) {

	var searchText = req.param('searchValue');

	console.log("group: " + searchText);

	var data = [];

	groupSchema.find({ $or : [ { groupName : new RegExp(searchText, 'i') }] }, function(err, docs) {
		if (err) {
			res.send(requestGen.responseGenerator(401, null));
		} else {
			console.log("docs" + docs);

			if (docs.length > 0) {

				docs.forEach(function(doc) {
					data.push({
						groupId : doc.groupId,
						groupName : doc.groupName
					});
				});

				res.send(requestGen.responseGenerator(200, data));

			} else {
				res.send(requestGen.responseGenerator(200, null));
			}

		}
	});
};
