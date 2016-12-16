angular.module('linkups2').controller('addSubnetRangeCtrl', [
	'$scope',
	'ipMgmtService',
	function($scope, ipMgmtService) {
		
		$scope.range = {
			mask: "24"
		};

		// ************ SHOW FULL NESTMASK 
		$scope.fullNetmask = ipMgmtService.obtainNetmask($scope.range.mask);
		
		$scope.invalidRange = true;

		$scope.validateRange = function(form) {
			$scope.fullNetmask = ipMgmtService.obtainNetmask($scope.range.mask);
			if (form.$valid) {
				if (ipMgmtService.rangeIsValid($scope.range.firstSubnet, $scope.range.lastSubnet, $scope.range.mask)) {
					$scope.invalidRange = false;
				}
				else {
					$scope.invalidRange = true;	
				}
			}
		};

		$scope.addRange = function() {
			if (ipMgmtService.rangeIsValid($scope.range.firstSubnet, $scope.range.lastSubnet, $scope.range.mask)) {
				ipMgmtService.addSubnetRange($scope.range.firstSubnet, $scope.range.lastSubnet, $scope.range.mask)
					.$promise.then(function(){
						$scope.refreshSubnetList();
					});
			}
		};
	}
]);