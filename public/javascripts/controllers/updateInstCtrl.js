angular.module('linkups2').controller('updateInstCtrl', [
	'$scope',
	'$state',
	'$stateParams',
	'auth',
	'instData',
	'notificationService',
	'$rootScope',
	'utilityService',
	function($scope, $state, $stateParams, auth, instData, notificationService, $rootScope, utilityService){
		
		$scope.isEdit = true;

		/* ADDING DEFAULT VALUES SO THAT THE SELECT ELEMENT DOESN'T ALLOW FOR NULL VALUES */
		$scope.institution = {
			state: "Activo",
			final_destination: "VPN Provincial"
		};

		/* OBJ THAT HOLDS POSSIBLE VALUES FOR THE SELECT ELEMENTS */
		$scope.selectionOpts = [
			{ 
				state: "Activo", 
				destination: "VPN Provincial"
			},
			{ 
				state: "Inactivo",
				destination: "Infomed"
			}
		];
		$scope.instTypes = {};
		angular.copy(utilityService.getInstitutionTypes(), $scope.instTypes);

		//Obtain Information
        instData.getById({id: $stateParams.id}, function(institution){
        	$scope.institution = institution;
        });

        $scope.save = function(inst_form){

        	if (inst_form.$valid) {
        		var today = new Date();        		
        		$scope.institution.last_modification_by = auth.currentUser();
        		$scope.institution.last_modification_time =  today.getTime();
        		utilityService.showLoader();
				instData.updateInst($scope.institution, function(){
					notificationService.notifyUpdate($scope.institution.name);
					utilityService.hideLoader();
					notificationService.getAmountOfUnreadNotifications().then(function(amount){	    			
		    			$rootScope.$broadcast("notificationCountUp", {
							unreadNotifications: amount,

						});
		    		});

					$state.go('home');
				});
			}
        };

        $scope.cancel = function(){			
			$state.go('home');
		};
	}
]);