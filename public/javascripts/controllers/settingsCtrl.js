angular.module('linkups2').controller('settingsCtrl', [
	'$scope',
	'settingsService',
	'$state',
	'$rootScope',
	'NAVBAR_TEMPLATE_URL',
	'auth',
	function ($scope, settingsService, $state, $rootScope, NAVBAR_TEMPLATE_URL, auth) {
        $scope.currentUserRole = auth.currentUserRole();
		$scope.navbar = {
			url: NAVBAR_TEMPLATE_URL
		};

		settingsService.getSettings().then(function(setting){
			$scope.setting = setting.data[0];
			
		});

		$scope.saveSettings = function(){
			settingsService.saveSettings($scope.setting);
			$rootScope.$broadcast("settingsSaved", {
				newProvinceName : $scope.setting.provinceName
			});
			$state.go('home');
		};
		
	}
]);