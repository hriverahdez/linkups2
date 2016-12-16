angular.module('linkups2').controller('addSingleSubnetCtrl', [
	'$scope',
	'ipMgmtService',
	function($scope, ipMgmtService) {
		
		$scope.singleSubnet = {
			fullMask: "X.X.X.X"
		};

		$scope.showFullNetMask = function() {
			if ($scope.singleSubnet.ipMask) {
				var subnet = $scope.singleSubnet.ipMask.split('/');
				var mask = subnet[1];
				$scope.singleSubnet.fullMask = ipMgmtService.obtainNetmask(mask);
			}
		};

		$scope.addOneSubnet = function() {
			var subnet = $scope.singleSubnet.ipMask.split('/');
			$scope.singleSubnet.ip = subnet[0];
			$scope.singleSubnet.mask = subnet[1];
			ipMgmtService.addSingleSubnet($scope.singleSubnet).$promise.then(function(){
				$scope.refreshSubnetList();
			});
		};
	}
]);