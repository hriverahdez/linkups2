angular.module('linkups2').factory('settingsService', function ($resource, auth, $q, $http) {
	
	var base_url = '/api/settings';
    var headers = {
        'Content-type' : 'application/x-www-form-urlencoded',
    };


    var transformRequestFn = function(data, headersGetter) {
        var str = [];
        for(var d in data)
            str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        return str.join("&");
    };

    var settingsService = {};

    settingsService.getSettings = function(){
    	return $http({
			method: 'GET',
			url: base_url,
			headers: headers,
			transformRequest: transformRequestFn,
			isArray: true
		}).success(function (response) {
			
		}).error(function (error){
			console.log(error);
		});
    };

    settingsService.saveSettings = function(setting){
    	return $http({
			method: 'POST',
			url: base_url,
			headers: headers,
			transformRequest: transformRequestFn,
			data: { 
				canRegister: 	setting.canRegister,
				provinceName: 	setting.provinceName,
				showLineNumber: setting.showLineNumber,
			}
		}).success(function (user) {
			
		});
    };

    settingsService.initialSettings = function(){
    	return $http({
			method: 'POST',
			url: base_url + '/initialize',
			headers: headers,
			transformRequest: transformRequestFn,			
		}).success(function (user) {
			
		});
    }

	return settingsService;

});