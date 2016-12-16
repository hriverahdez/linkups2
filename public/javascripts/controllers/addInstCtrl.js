angular.module('linkups2').controller('addInstCtrl', [
	'$scope',
	'$state', 
	'instData',
	'notificationService',
	'$rootScope',
	'ModalService',
	'utilityService',
	'ipMgmtService',
	function($scope, $state, instData, notificationService, $rootScope, ModalService, utilityService, ipMgmtService){
		$scope.isLoading = false;
		$scope.isEdit = false;

		$scope.assignedWANID = "";
		$scope.assignedLANID = "";

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

			if ($scope.institution.wan == $scope.institution.lan) {
				$scope.error = "Las subredes WAN y LAN no pueden ser iguales";
			} else {

				utilityService.showLoader();
									
				instData.saveInst($scope.institution, function(){		

					var wanIpMask = $scope.institution.wan.split('/');
					ipMgmtService.setUnavailable({ip: wanIpMask[0]});
					
					if ($scope.assignedLANID != "") {
						var lanIpMask = $scope.institution.lan.split('/');
						ipMgmtService.setUnavailable({ip: lanIpMask[0]});
					}

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
			
		}

		$scope.cancel = function(){			
			$state.go('home');
		}

		/************************************/
		/*******  WAN/LAN assignment  *******/
		/************************************/

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



	}
])
.controller('selectSubnetCtrl', [
	'$scope',
	'ipMgmtService',
	'$rootScope',
	'close',
	'modalFor',
	function($scope, ipMgmtService, $rootScope, close, modalFor) {
		
		$scope.noSelection = true;
		
		$scope.activeTab = 'list';

		$scope.subnetListTabClass 	  = "active";
		$scope.addOneSubnetTabClass   = "";
		$scope.addSubnetRangeTabClass = "";

		$scope.setActiveTab = function(tab) {
			$scope.activeTab = tab;
			if (tab=='list') {
				$scope.subnetListTabClass 	  = "active";
				$scope.addOneSubnetTabClass   = "";
			}
			else if (tab=='addOne') {
				$scope.subnetListTabClass 	  = "";
				$scope.addOneSubnetTabClass   = "active";
			} 
		};


		$scope.noSubnets = false;
		ipMgmtService.getAllAvailableSubnets().then(function(response){
			if (response.data.length == 0)
				$scope.noSubnets = true;
			$scope.subnets = response.data;
		});

		$scope.refreshSubnetList = function() {
			ipMgmtService.getAllAvailableSubnets().then(function(response){
				if (response.data.length > 0)
					$scope.noSubnets = false;			
				$scope.subnets = response.data;
			});
		};

		$scope.radioValue = {};

		$scope.onRadioSelect = function(id) {
			$scope.noSelection = false;
			$scope.selectedID = id;
		};

		$scope.confirm = function() {

			$rootScope.$broadcast("selectedSubnet", {
				subnetId: $scope.selectedID,
				modalFor: modalFor
			});


			close({
        
            }, 500);
		};

		$scope.close = function() {

            //  Manually hide the modal.

            //  Now call close, returning control to the caller.
            close({
        
            }, 500); // close, but give 500ms for bootstrap to animate
    	};
	}
]);