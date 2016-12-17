angular.module('linkups2').factory('instRequestService', [
	'auth',
	'$resource',
	function(auth, $resource) {
		var instRequestService = {};

		var baseUrl = '/api/instRequests/:id';
	    var headers = {
	        'Content-type' : 'application/x-www-form-urlencoded',
	        'Authorization': 'Bearer '+ auth.getToken()
	    };

	    var transformRequestFn = function(data, headersGetter) {
	        var str = [];
	        for(var d in data)
	            str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
	        return str.join("&");
	    };
	    
	    var actions = {
	        getAllInstRequests: {
	            method: 'GET',
	            isArray: true,
	            headers: headers
	        },
	        getById: {
	            method: 'GET',
	            headers: headers            
	        },
	        saveInstRequest: {
	            method: 'POST',
	            headers: headers,
	            transformRequest: transformRequestFn,
	        },
	        updateInstRequest: {
	            method: 'PUT',
	            isArray: false,
	            headers: headers,
	            transformRequest: transformRequestFn,
	        },
	        deleteInstRequest: {
	            method: 'DELETE',
	            headers: headers
	        }
	    };

	    var IResource = $resource(baseUrl, { id: '@_id' }, actions);

		return IResource;
	}
]);