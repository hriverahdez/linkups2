angular.module('linkups2').factory('instData', function($resource, auth){
    var url = '/api/institutions/:id';
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
        getAllInstitutions: {
            method: 'GET',
            isArray: true,
            headers: headers
        },
        getById: {
            method: 'GET',
            headers: headers            
        },
        saveInst: {
            method: 'POST',
            headers: headers,
            transformRequest: transformRequestFn,
        },
        updateInst: {
            method: 'PUT',
            isArray: false,
            headers: headers,
            transformRequest: transformRequestFn,
        },
        deleteInst: {
            method: 'DELETE',
            headers: headers
        }
    };

    var IResource = $resource(url, { id: '@_id' }, actions);
	return IResource;
	
})