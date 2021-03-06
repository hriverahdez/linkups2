angular.module('linkups2')
.factory('auth', ['$http', '$window', '$resource', '$q', function($http, $window, $resource, $q){
	var auth = {};

	var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
	
	var transformRequestFn = function(obj) {
		var str = [];
		for(var p in obj)
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		return str.join("&");
	};

	auth.saveToken = function (token){
		$window.localStorage['linkups2-token'] = token;			
	};

	auth.getToken = function (){		
		return $window.localStorage['linkups2-token'];
	};


	auth.logOut = function(){		
		$window.localStorage.removeItem('linkups2-token');
	};

	auth.isLoggedIn = function(){		
		var token = auth.getToken();

		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	/* In case of a page refresh, reinstantiate the variable with the proper headers */
	if (auth.isLoggedIn()) {		
		headers.Authorization = 'Bearer ' + auth.getToken();
	}

	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.currentUserFullName = function() {
		
		if(auth.isLoggedIn()){
			
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.fullname;
		}
		
	};

	auth.register = function(user) {
		return $http({
			method: 'POST',
			url: '/api/users/register',
			headers: headers,
			transformRequest: transformRequestFn,
			data: { 
				username: user.username,
				fullname: user.fullname, 
				password: user.password 
			}
		}).success(function (user) {
			auth.saveToken(user.token);
		});
	};

	auth.createUser = function(user) {
		return $http({
			method: 'POST',
			url: '/api/users/register',
			headers: headers,
			transformRequest: transformRequestFn,
			data: { 
				username: user.username,
				fullname: user.fullname, 
				password: user.password 
			}
		}).success(function (user) {
			
		});
	};
	
	auth.logIn = function(user) {
		return $http({
			method: 'POST',
			url: '/api/users/login',
			headers: headers,
			transformRequest: transformRequestFn,
			data: { 
				username: user.username, 
				password: user.password 
			}
		}).success(function (user) {			
			auth.saveToken(user.token);			
			/* Add authorization bearer to http headers */
			headers.Authorization = 'Bearer ' + auth.getToken();
		});
	};

	auth.checkUserAvailability = function(user) {
		return $http({
			method: 'POST',
			url: '/api/users/check',
			headers: headers,
			transformRequest: transformRequestFn,
			data: { 
				username: user.username, 
				password: user.password 
			}
		}).success(function (response) {
			
		}).error(function (error){
			console.log('error');
		});
	};

	/* ------------------------------------ */
	/* NEED AUTHENTICATION TOKEN IN HEADERS */
	/* ------------------------------------ */
	
	
	auth.updateProfile = function(user) {
		return $http({
			method: 'PUT',
			url: '/api/users/updateProfile',
			headers: headers,
			transformRequest: transformRequestFn,			
			data: { 
				username: user.username,
				fullname: user.fullname,
				password: user.password 
			}
		}).success(function (user) {
			auth.saveToken(user.token);
		});
	};	

	auth.retrieveUserList = function() {
		return $http({
			method: 'GET',
			url: '/api/users',
			headers: headers,
			transformRequest: transformRequestFn,
			isArray: true
		}).success(function (response) {
			
		}).error(function (error){
			console.log('error');
		});
	};

	auth.deleteUser = function(_id){
		return $http({
			method: 'DELETE',
			url: '/api/users/' + _id,
			headers: headers,
			transformRequest: transformRequestFn,
		}).success(function (response) {
			
		}).error(function (error){
			console.log('error');
		}); 
	}


	return auth;

}]);