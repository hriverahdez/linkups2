angular.module('linkups2').controller('notificationCtrl', [
	'$scope',
	'auth',	
	'notificationService',
	'$timeout',
	'utilityService',
	'DTOptionsBuilder',
	'NAVBAR_TEMPLATE_URL',
	function($scope, auth,notificationService, $timeout, utilityService, DTOptionsBuilder, NAVBAR_TEMPLATE_URL){

		$scope.navbar = {
			url: NAVBAR_TEMPLATE_URL
		}
		
		$scope.sortOrder = '-time';
		$scope.notificationIcons = utilityService.getNotificationIcons("fa-1x");
		
	    $scope.updateNotificationList = function(){
	    	notificationService.getAllNotifications().then(function(notifications){	    	
		    	$scope.notifications = notifications;
		    });
	    };
	    
		$scope.updateNotificationList();

		/* Building Options for the DataTable */
    	$scope.dtOptions = DTOptionsBuilder
					        .newOptions()            
	            			.withOption('hasBootstrap', true);

	    
	    notificationService.getAmountOfUnreadNotifications().then(function(amount){
	    	$scope.unreadNotifications = amount;
	    });

	    //Capture notification count up broadcast
	    $scope.$on("notificationCountUp", function (event, args) {
			$scope.unreadNotifications = args.unreadNotifications;
			$scope.updateNotificationList();
		});

	    $scope.readAll = function(){	    	
	    	
	    	//Wait 2 seconds then mark all notifications as read 	
	    	$timeout(function() {

	    		//Loop through all the unread notif and mark them as read
	    		notificationService.readAllNotifications().then(function(){
	    			//When it's done refresh the list
	    			$scope.updateNotificationList();	

	    			//Update local copy of badge counter
	    			$scope.unreadNotifications = 0;
	    		});	    		
	    		
	    	}, 2000);			

	    }

	}
]);