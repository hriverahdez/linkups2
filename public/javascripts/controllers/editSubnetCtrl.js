angular.module('linkups2').controller('editSubnetCtrl', [
	'$scope',
	'$state',	
	'ipMgmtService',
	'subnetId',
	'utilityService',
	function($scope, $state, ipMgmtService, subnetId, utilityService) {
		
		$scope.ipMaskRegExp = utilityService.getIPMASKRegex();		

		ipMgmtService.getById(subnetId).$promise.then(function(subnet){
			$scope.singleSubnet = subnet;
			$scope.singleSubnet.ipMask = $scope.singleSubnet.ip + '/' + $scope.singleSubnet.mask;
			$scope.singleSubnet.fullMask = ipMgmtService.obtainNetmask($scope.singleSubnet.mask);
		});

		$scope.showFullNetMask = function() {
			if ($scope.singleSubnet.ipMask) {
				var subnet = $scope.singleSubnet.ipMask.split('/');
				var mask = subnet[1];
				$scope.singleSubnet.fullMask = ipMgmtService.obtainNetmask(mask);
			}
		};

		$scope.confirm = function() {
        	var subnet = $scope.singleSubnet.ipMask.split('/');
        	$scope.singleSubnet.ip = subnet[0];
        	$scope.singleSubnet.mask = subnet[1];
        	ipMgmtService.updateSingleSubnet($scope.singleSubnet);
        	$state.transitionTo('ipPools', {}, {reload: true});
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