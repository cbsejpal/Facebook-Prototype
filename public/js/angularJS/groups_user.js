
var app = angular.module('groups_user', []);

app.controller('group_list', [
		'$scope',
		'$http',
		'$location',
		function($scope, $http, $location) {

			$scope.groupList = [];

			$scope.navigateToGroup = function(group) {
				window.location.href = "/groupInfoPage?group_id="
						+ group.groupid;
			};

			$scope.getGroupList = function() {
				$http({
					method : "GET",
					url : '/getGroupListM',
				}).success(function(data) {
					// checking the response data for statusCode
					// alert(JSON.stringify(data));
					if (data.status == 200) {
						console.log("success");
						$scope.groupList = data.data;
					} else {

					}
				}).error(function(error) {
					console.log("error");
				});

			};

			$scope.getGroupList();
		} ]);
