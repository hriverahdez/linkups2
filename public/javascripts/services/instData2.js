angular.module('linkups2').factory('instData2', function($http, auth, $q){
    var service = {};
    var url = '/api/institutions';

    service.getAllInstitutions = function(){
        //console.log('hereff');
        var deferred = $q.defer();
        $http({
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+ auth.getToken()
            },
            url: url,

        }).success(function(data, status, headers, config){
            deferred.resolve(data)
            
        }).error(function(data, status, headers, config){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    service.saveInst = function(inst) {
        /*
        $http({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+ auth.getToken()
            },
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: inst
        }).success(function (data) {
            console.log('success');
        }).error(function(data){
            console.log('error');
            console.log(data.message);
        });


*/



        
        var config = { 
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+ auth.getToken()
            },
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        };
        
        $http.post(url, inst, config)
        .success(function(data, status, headers, config){
            console.log('post successful');
            
        })
        .error(function(data, status, headers, config){
            console.log('effing error');            
            console.log(data.message);            
        });
    }
	return service;
});