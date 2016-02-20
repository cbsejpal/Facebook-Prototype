/**
 * New node file
 */
var app = angular.module('init', []);

app.controller('search', function($scope, $http) {

	$scope.init = function(search) {
		$scope.search = search;
		$scope.getUserSearch();
		$scope.getGroupSearch();
	}

	$scope.getUserSearch = function() {

		$http({
			method : "GET",
			url : '/userSearchM',
			params : {
				searchValue : $scope.search
			}
		}).success(function(data) {
			$scope.userData = [];
			// checking the response data for statusCode
			if (data.status == 200) {
				console.log("success");
				$scope.userData = data.data;
			} else {
				console.log("dofaaa");
			}
		}).error(function(error) {
			console.log("error");
		});

	};

	$scope.getGroupSearch = function() {

		$http({
			method : "GET",
			url : '/groupSearchM',
			params : {
				searchValue : $scope.search
			}
		}).success(function(data) {
			$scope.groupData = [];
			// checking the response data for statusCode
			if (data.status == 200) {
				console.log("success");
				$scope.groupData = data.data;
			} else {
				console.log("dofaaa");
			}
		}).error(function(error) {
			console.log("error");
		});

	};

});
