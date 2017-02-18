angular.module('linkups2').controller('navBarCtrl', [
	'$scope',
	'auth',
	function($scope, auth) {

		$scope.currentUser 		= auth.currentUser();
		$scope.currentUserRole 	= auth.currentUserRole();
		
		
		$scope.logOut = function(){
			auth.logOut();
		};

		$scope.$on('settingsSaved', function(event, args){
			$scope.provinceName = args.newProvinceName;
		});
	}
]);