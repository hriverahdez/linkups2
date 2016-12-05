angular.module('linkups2')

	.controller('loginCtrl', [
		'$scope',
		'$state', 
		'auth',
		'$rootScope',
		'settingsService',
		function($scope, $state, auth, $rootScope, settingsService){
			$scope.user = {};
			$scope.error;
			$scope.userIsAvailable = false;
			$scope.userIsNotAvailable = true;
			$scope.canCheck = false;
			$scope.passwordsDontMatch = true;
			$scope.create = false;

			//Allowing resgitration depending on app settings 
			settingsService.getSettings().then(function(settings){
				//returns an Array of settings, but since only 1 is ever instantiated
				// we get the first one and retrieve the property
				$scope.canRegister = settings.data[0].canRegister;

			}, function(err){

			});

			
			//Control whether to call the register o the create user methods
			if ($state.$current.name == "createUser")
				$scope.create = true;

			/* Activate the check available button */
			$scope.canCheckAvailability = function(){
				if ($scope.user.username != undefined && $scope.user.username != ""){
					$scope.canCheck = true;				
				}
				else{				
					$scope.canCheck = false;
				}
			};

			/*Check password match */
			$scope.checkPasswordsMatch = function(){			
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


			$scope.isLogged = auth.isLoggedIn();

			/* Check if the input username is available for use */
			$scope.checkUserAvailability = function(){
				
				auth.checkUserAvailability($scope.user).then(function(response){				
					$scope.userIsAvailable = response.data.available;
					$scope.userIsNotAvailable = response.data.available;				
				});
			};


			$scope.register = function(){	
				auth.register($scope.user)
				.error(function(err){
					$scope.error = err;
				})
				.then(function(){				
					$state.go('home', {}, {reload: true});
				});			
				
			};
			

			$scope.createUser = function(){
				$scope.user.role = $scope.user.role?'ADMIN':'GUEST';
				auth.createUser($scope.user)
				.error(function(err){
					$scope.error = err;
				})
				.then(function(){				
					$state.go('viewUsers', {}, {reload: true});
				});			
				
			};

			$scope.logIn = function(){			
				auth.logIn($scope.user)
				.error(function(err){
					$scope.error = err;
				})
				.then(function(){			
					$state.go('home', {}, {reload: true});
				});
			};	

			$scope.logOut = function(){
				auth.logOut();				
			}
	

	} /* close function brace */
]);

