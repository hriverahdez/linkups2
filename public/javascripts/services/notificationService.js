angular.module('linkups2').factory('notificationService', function($resource, auth, $q){
	
	var url = '/api/notifications/:id';
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
        getAllNotifications: {
            method: 'GET',
            isArray: true,
            headers: headers
        },
        getById: {
            method: 'GET',
            headers: headers            
        },
        saveNotification: {
            method: 'POST',
            headers: headers,
            transformRequest: transformRequestFn,
        },
        updateNotification: {
            method: 'PUT',
            isArray: false,
            headers: headers,
            transformRequest: transformRequestFn,
        },
        deleteNotification: {
            method: 'DELETE',
            headers: headers
        }
    };

    var NResource = $resource(url, { id: '@_id' }, actions);
	
	var notificationService = {};

	notificationService.notifySave = function(message){
		var today = new Date();
		var notification = {
			type: 'SAVE',
			message: 'Creado: ' + message,
			user: auth.currentUser(),
			time: today.getTime()
		};
		NResource.saveNotification(notification);
	};

	notificationService.notifyUpdate = function(message){
		var today = new Date();
		var notification = {
			type: 'UPDATE',
			message: 'Actualizado: ' + message,
			user: auth.currentUser(),
			time: today.getTime()
		};
		NResource.saveNotification(notification);
	};

	notificationService.notifyDelete = function(message){
		var today = new Date();
		var notification = {
			type: 'DELETE',
			message: 'Eliminado: ' + message,
			user: auth.currentUser(),
			time: today.getTime()
		};
		NResource.saveNotification(notification);
	};

	notificationService.read = function(notification) {
		NResource.updateNotification(notification);
	};

	notificationService.getAllNotifications = function(){
		var deferred = $q.defer();
		NResource.getAllNotifications(function(notification){
			//console.log('notif '+notification);
			deferred.resolve(notification);
		},function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};

	
	notificationService.getAmountOfUnreadNotifications =  function() {
		
		var deferred = $q.defer();

		notificationService.getAllNotifications().then(function(allNotifications){
			var count = 0;	
	    	angular.forEach(allNotifications, function(item){
	    		if (!item.read){
	    			count++;	    		
	    		}
	    	});
	    	deferred.resolve(count);	    	
		})		
		return deferred.promise;

	};

	notificationService.readAllNotifications = function(){
		return notificationService.getAllNotifications().then(function (allNotifications) {
			angular.forEach(allNotifications, function(item){
	    		if (!item.read){
	    			notificationService.read(item);
	    		}
	    	});	
		});

		
	};

	return notificationService;	
});