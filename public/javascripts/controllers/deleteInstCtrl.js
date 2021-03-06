angular.module('linkups2').controller('deleteInstCtrl', [
	'$scope',
	'$state', 	
	'auth',
	'$element',
	'close',
	'inst_id',
	'instData',
	'utilityService',
    'notificationService',
    '$rootScope',
    'view',
	function($scope, $state, auth, $element, close, inst_id, instData, utilityService, notificationService, $rootScope, view) {

        $scope.isView = view;
		$scope.hasLan = true;
		//Obtain Information
        instData.getById({id: inst_id}, function(info){
        	$scope.info = info;
        	$scope.hasLan = $scope.info.lan!=null?true:false;        	
        });
        $scope.typeIconClasses = utilityService.getInstTypeIcons("fa-5x");
        $scope.internetStatusIcons = utilityService.getHasInternetIcons("fa-1x");
        
        
        $scope.close = function() {
        	
        	instData.deleteInst({id: inst_id}, function(){
                notificationService.notifyDelete($scope.info.name);
                
                notificationService.getAmountOfUnreadNotifications().then(function(amount){                
                    $rootScope.$broadcast("notificationCountUp", {
                        unreadNotifications: amount
                    });
                });
            });
            

        	$state.transitionTo('home', {}, {reload: true});
            close({
                
            }, 500); // close, but give 500ms for bootstrap to animate
        };

        $scope.cancel = function() {

            //  Manually hide the modal.
            $element.modal('hide');

            //  Now call close, returning control to the caller.
            close({
        
            }, 500); // close, but give 500ms for bootstrap to animate
    	};
    }
]);