
var app = angular.module('groups_home', []);

app.controller('group_info', [
		'$scope',
		'$http',
		function($scope, $http) {

			$scope.groupMembers = [];
			$scope.groupPosts = [];

			$scope.getGroupInfo = function(groupid) {

				$scope.groupID = groupid;
				$http({
					method : "GET",
					url : '/getGroupInfoM',
					params : {
						group_id : $scope.groupID
					}
				}).success(
						function(data) {
							// checking the response data for statusCode
							if (data.status == 200) {
								console.log("success");
								var groupInfo = data.data;
								$scope.groupMembers = groupInfo.member_list;
								$scope.groupName = groupInfo.groupname;
								$scope.groupDesc = groupInfo.groupDescription;
								$scope.isMember = groupInfo.is_member,
										$scope.isAdmin = groupInfo.is_admin
								if ($scope.isMember) {
									$scope.getGroupPosts();
								} else {
									$scope.groupPosts = [];
								}
							} else {
								console.log("No datat found");
							}
						}).error(function(error) {
					console.log("error");
				});

			};

			$scope.getGroupPosts = function() {

				$http({
					method : "GET",
					url : '/getGroupPostM',
					params : {
						group_id : $scope.groupID
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.status == 200) {
						console.log("success");
						$scope.groupPosts = data.data;
					} else {
						console.log("dofaaa");
					}
				}).error(function(error) {
					console.log("error");
				});

			};

			$scope.postInGroup = function() {
				$http({
					method : "POST",
					url : '/postInGroupM',
					data : {
						group_id : $scope.groupID,
						post_status : $scope.post_status
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.status == 200) {
						console.log("success");
						$scope.getGroupPosts();
						$scope.post_status = "";
					} else {
						console.log("dofaaa");
					}
				}).error(function(error) {
					console.log("error");
				});

			};

			$scope.joinGroup = function() {
				$http({
					method : "POST",
					url : '/joinGroupM',
					data : {
						group_id : $scope.groupID
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.status == 200) {
						console.log("success");
						$scope.getGroupInfo($scope.groupID);
					} else {
						console.log("dofaaa");
					}
				}).error(function(error) {
					console.log("error");
				});

			};

			$scope.leaveGroup = function() {
				$http({
					method : "POST",
					url : '/leaveGroupM',
					data : {
						group_id : $scope.groupID
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.status == 200) {
						console.log("success");
						$scope.getGroupInfo($scope.groupID);
					} else {
						console.log("dofaaa");
					}
				}).error(function(error) {
					console.log("error");
				});

			};

			$scope.removeMember = function(people) {
				$http({
					method : "POST",
					url : '/removeMemberM',
					data : {
						group_id : $scope.groupID,
						user_id : people.userID
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.status == 200) {
						console.log("success");
						$scope.getGroupInfo($scope.groupID);
					} else {
						console.log("dofaaa");
					}
				}).error(function(error) {
					console.log("error");
				});

			};

		} ]);
