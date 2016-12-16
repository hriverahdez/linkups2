angular.module('linkups2').controller('updateInstCtrl', [
	'$scope',
	'$state',
	'$stateParams',
	'auth',
	'instData',
	'notificationService',
	'$rootScope',
	'utilityService',
	'ipMgmtService',
	'ModalService',
	function($scope, $state, $stateParams, auth, instData, notificationService, $rootScope, utilityService, ipMgmtService, ModalService){
		
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
        	$scope.oldWANIP = $scope.institution.wan;
        	$scope.oldLANIP = $scope.institution.lan;
        });


        $scope.clearWAN = function() {
			$scope.institution.wan = "";
		};

		$scope.clearLAN = function() {
			$scope.institution.lan = "";
		};


		$scope.$on("selectedSubnet", function(event, args){
			var selectedSubnetID = args.subnetId;
			var modalFor = args.modalFor;
			modalFor=="WAN" ? $scope.assignedWANID = selectedSubnetID : $scope.assignedLANID = selectedSubnetID;

			ipMgmtService.getById(selectedSubnetID).$promise.then(function(subnet){
				if (modalFor == "WAN") {					
					$scope.institution.wan = subnet.ip + '/' + subnet.mask;
				}
				else if (modalFor == "LAN") {
					$scope.institution.lan = subnet.ip + '/' + subnet.mask;
				}

			});
		})

        $scope.selectWan = function(){
			var modalFor = "WAN";
			$scope.callModal(modalFor);
	    };

	    $scope.selectLan = function(){
			var modalFor = "LAN";
			$scope.callModal(modalFor);
	    };

	    $scope.callModal = function(modalFor) {
	    	ModalService.showModal({
			    templateUrl: '/templates/subnetListModal.html',
			    controller: 'selectSubnetCtrl',
			    inputs: {
			    	modalFor: modalFor,
			    }
			    
			}).then(function(modal) {
            	modal.element.modal();
            	
            	//modal.close();
            });
	    };

	    $scope.updateSubnetAvailability = function(oldValue, currentValue){
    		if (oldValue !== currentValue) {
    			ipMgmtService.setAvailable({ip:   oldValue.split('/')[0]});
    			ipMgmtService.setUnavailable({ip: currentValue.split('/')[0]});
    		}	    	
	    }

        $scope.save = function(inst_form){

        	if (inst_form.$valid) {    

        		$scope.updateSubnetAvailability($scope.oldWANIP, $scope.institution.wan);
        		if ($scope.oldLANIP != undefined && $scope.oldLANIP != "") {
        			if ($scope.institution.lan !== undefined && $scope.institution.lan !== "")
        				$scope.updateSubnetAvailability($scope.oldLANIP, $scope.institution.lan);
        			else 
						ipMgmtService.setAvailable({ip: $scope.oldLANIP.split('/')[0]});        				
        		}
        		else {
        			if ($scope.institution.lan !== undefined && $scope.institution.lan !== "")
        				ipMgmtService.setUnavailable({ip: $scope.institution.lan.split('/')[0]});
        		}


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