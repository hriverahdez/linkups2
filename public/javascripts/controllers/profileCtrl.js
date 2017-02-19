angular.module('linkups2').controller('profileCtrl', [
	'$scope',
	'auth',
	'$state',
	'NAVBAR_TEMPLATE_URL',
	function($scope, auth, $state, NAVBAR_TEMPLATE_URL){

		$scope.navbar = {
			url: NAVBAR_TEMPLATE_URL
		};
		$scope.passwordChange = false;
		$scope.passwordsDontMatch = false;

		$scope.somethingChanged = false;

		/* If the user has updated some fields */
		$scope.hasUpdated = function() {
			$scope.somethingChanged = true;
		};

		$scope.user = {
			username: auth.currentUser(),
			fullname: auth.currentUserFullName(),
		};

		/* Checking password match */
		$scope.checkPasswordsMatch = function(){
			$scope.somethingChanged = true;
			if ($scope.user.password != $scope.user.passconfirm) {				
				$scope.error = {
					message: "Las contraseñas no coinciden",
				};
				$scope.passwordsDontMatch = true;
			}
			else {				
				$scope.error = null;
				$scope.passwordsDontMatch = false;
			}
		};

		/* Check whether the user decided to change the password or not */
		$scope.passCheckChange = function(){
			if (!$scope.passwordChange){
				$scope.user.password = null;
				$scope.user.passconfirm = null;
			}
		}

		$scope.updateProfile = function(){

			if (($scope.user.password == null || $scope.user.password == "") && ($scope.passwordChange)) {
				$scope.error = {
					message: "El campo de contraseña no puede estar vacío",
				}
			}
			else {
				if (!$scope.passwordChange)
					$scope.user.password = "not";
				auth.updateProfile($scope.user);
				$state.go('home', {}, {reload: true});
			}
		}

	}
]);