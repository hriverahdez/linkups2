angular.module('linkups2').controller('guestHomeCtrl', [
	'$scope',
	'utilityService',
	function($scope, utilityService) {
		$scope.typeIconClasses = utilityService.getInstTypeIcons("fa-2x fa-fw");
		$scope.internetStatusIcons = utilityService.getHasInternetIcons("fa-1x");
		$scope.activeTab = 'pending';

		$scope.pendingClass = "active";
		$scope.approvedClass = "";

		$scope.setActiveTab = function(tab) {
			$scope.activeTab = tab;
			if (tab=='pending') {
				$scope.pendingClass = "active";
				$scope.approvedClass = "";
			}
			else {
				$scope.pendingClass = "";
				$scope.approvedClass = "active";
			}
		};

		$scope.pendingClass = "active";


		$scope.reqStatusIcons = {
			true: 'fa fa-check',
			false: 'fa fa-close'
		};
		
		$scope.approvedRequests = [
			{
				name: 'Centro Generica de fango al pecho',
				type: 'c_genetica',
				location:  'Fango al pecho',
				has_internet: true,
				bandwidth: '256',
				approved: true
			},
			{
				name: 'Hospital Menganito Perez',
				type: 'hospital',
				location:  'San Juan y Martinez',
				has_internet: false,
				bandwidth: '256',
				approved: true
			}
		];

		$scope.pendingRequests = [
			{
				name: 'Policlinico Fulano de tal',
				type: 'policlinico',
				location:  'Pinar del Rio',
				has_internet: true,
				bandwidth: '256',
				approved: false
			},
			{
				name: 'Banco de sangre Masinguaso',
				type: 'b_sangre',
				location:  'San Luis',
				has_internet: false,
				bandwidth: '256',
				approved: false
			}
		];
	}
]);