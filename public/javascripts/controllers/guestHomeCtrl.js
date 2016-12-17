angular.module('linkups2').controller('guestHomeCtrl', [
	'$scope',
	'utilityService',
	'instRequestService',
	function($scope, utilityService, instRequestService) {

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
		
		instRequestService.getAllInstRequests(function(allReq) {
			$scope.allRequests = allReq; 
			$scope.approvedRequests = $scope.filterRequests(allReq, true);
			$scope.pendingRequests = $scope.filterRequests(allReq, false);

		});

		$scope.filterRequests = function(reqArray, filterBy) {
			var result = [];
			angular.forEach(reqArray, function(item) {
				if (item.approved == filterBy) 
					result.push(item);
			});
			return result;
		};

		/*
		$scope.approvedRequests = [
			{
				name: 'Centro Generica de fango al pecho',
				type: 'c_genetica',
				location:  'Fango al pecho',
				has_internet: true,
				status: 'APROBADO',
				statusIssue: 'SIN PROBLEMAS'
			},
			{
				name: 'Hospital Menganito Perez',
				type: 'hospital',
				location:  'San Juan y Martinez',
				has_internet: false,
				status: 'APROBADO',
				statusIssue: 'SIN PROBLEMAS'
			}
		];

		$scope.pendingRequests = [
			{
				name: 'Policlinico Fulano de tal',
				type: 'policlinico',
				location:  'Pinar del Rio',
				has_internet: true,
				status: 'EN ESPERA',
				statusIssue: 'En espera de revisión por parte del Administrador'
			},
			{
				name: 'Banco de sangre Masinguaso',
				type: 'b_sangre',
				location:  'San Luis',
				has_internet: false,
				status: 'PROBLEMA',
				statusIssue: 'Su solicitud no puede ser atendida porque ya existe una institución en esa localidad con ese nombre'
			}
		];
		*/
	}
]);