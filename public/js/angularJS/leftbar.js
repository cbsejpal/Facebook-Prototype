/**
 * New node file
 */
app.controller('leftbar_list', [
		'$scope',
		'$http',
		'$location',
		function($scope, $http, $location) {

			$scope.groupTopList = [];

			$scope.navigateToGroup = function(group) {
				window.location.href = "/groupInfoPageM?group_id="
						+ group.groupId;
			};

			$scope.getGroupTopList = function() {
				$http({
					method : "GET",
					url : '/getGroupTopListM',
					data : {
						'user_id' : 1
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.status == 200) {
						console.log("success");
						$scope.groupTopList = data.data;
					} else {

					}
				}).error(function(error) {
					console.log("error");
				});

			};

			$scope.createGroup = function() {
				$http({
					method : "POST",
					url : '/createGroupM',
					data : {
						'group_name' : $scope.group_name,
						'group_desc' : $scope.group_desc,
						'add_friends' : $scope.selected_friends
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.status == 200) {
						console.log("success");
						$('#createGroup').modal('hide');
						$scope.getGroupTopList();
					} else {
						// alert(data.data);
					}
				}).error(function(error) {
					console.log("error");
				});

			};

			$scope.getFrienList = function() {
				$http.get("/getFrnds").success(function(response) {
					if (response.statusCode == 200) {
						$scope.friendList = response.status;
					} else {

						// handle error
					}
				});
			}

			$scope.getUserName = function() {
				$http({
					method : "POST",
					url : '/getUserNameM',
					data : {

					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.status == 200) {
						$scope.Username = data.data.name;
					} else {
						$scope.Username = "No Username";
					}
				}).error(function(error) {
					console.log("error");
				});

			}
			// add this in all left bar
			$scope.validate = function($event) {
				angular.forEach($scope.groupCreate.$error.required, function(
						field) {
					field.$setDirty();
				});
				if ($scope.groupCreate.$error.required) {
					$event.preventDefault();
				} else {
					// $scope.groupCreate.group_name = "";
					// $scope.groupCreate.group_desc = "";
					$scope.createGroup();
				}
			};

			$scope.getUserName();
			$scope.getGroupTopList();
		} ]);
