angular.module('linkups2').controller('guestHomeCtrl', [
	'$scope',
	'utilityService',
	function($scope, utilityService) {
		$scope.typeIconClasses = utilityService.getInstTypeIcons("fa-2x fa-fw");
		$scope.internetStatusIcons = utilityService.getHasInternetIcons("fa-1x");
		$scope.reqStatusIcons = {
			true: 'fa fa-check',
			false: 'fa fa-close'
		};
		$scope.requests = [
			{
				name: 'Policlinico Fulano de tal',
				type: 'policlinico',
				location:  'Pinar del Rio',
				has_internet: true,
				bandwidth: '256',
				approved: true
			},
			{
				name: 'Policlinico Fulano de tal',
				type: 'policlinico',
				location:  'San Juan y Martinez',
				has_internet: false,
				bandwidth: '256',
				approved: false
			}
		];
	}
]);