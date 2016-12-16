angular.module('linkups2').controller('addInstCtrl', [
	'$scope',
	'$state', 
	'instData',
	'notificationService',
	'$rootScope',
	'ModalService',
	'utilityService',
	function($scope, $state, instData, notificationService, $rootScope, ModalService, utilityService){
		$scope.isLoading = false;
		$scope.isEdit = false;

		/* ADDING DEFAULT VALUES SO THAT THE SELECT ELEMENT DOESN'T ALLOW FOR NULL VALUES */
		$scope.institution = {
			state: "Activo",
			final_destination: "VPN Provincial",
			type: "NODO"
		};

		$scope.ipRegExp = utilityService.getIPRegex();
		$scope.ipMaskRegExp = utilityService.getIPMASKRegex();

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

		$scope.save = function(inst_form){	

			utilityService.showLoader();
								
			instData.saveInst($scope.institution, function(){		
				

				utilityService.hideLoader();

				notificationService.notifySave($scope.institution.name);
				
				notificationService.getAmountOfUnreadNotifications().then(function(amount){	    			
	    			$rootScope.$broadcast("notificationCountUp", {
						unreadNotifications: amount
					});
	    		});

				$state.go('home');
			}, function(err){
				console.log(err.message);
			});
			
		}

		$scope.cancel = function(){			
			$state.go('home');
		}
	}
]);