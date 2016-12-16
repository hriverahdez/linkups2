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
    'ipMgmtService',
	function($scope, $state, auth, $element, close, inst_id, instData, utilityService, notificationService, $rootScope, view, ipMgmtService) {
        $scope.info = {};
        $scope.isView = view;
		$scope.hasLan = true;
		//Obtain Information
        instData.getById({id: inst_id}, function(info){
        	$scope.info = info;
        	$scope.hasLan = ($scope.info.lan!=undefined&&$scope.info.lan!="")?true:false;       	
        });
        $scope.typeIconClasses = utilityService.getInstTypeIcons("fa-5x");
        $scope.internetStatusIcons = utilityService.getHasInternetIcons("fa-1x");
        
        
        $scope.confirm = function() {
        	
        	instData.deleteInst({id: inst_id}, function(){
                
                var wanIpMask = $scope.info.wan.split('/');
                console.log(wanIpMask);
                ipMgmtService.setAvailable({ip: wanIpMask[0]});
                if ($scope.info.lan !== "" && $scope.info.lan !== undefined) {
                    var lanIpMask = $scope.info.lan.split('/');
                    ipMgmtService.setAvailable({ip: lanIpMask[0]});
                };

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