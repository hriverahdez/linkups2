angular.module('linkups2').controller('ipPoolsCtrl', [
	'$scope',
	'ipMgmtService',
	'settingsService',
	'$state',
	'ModalService',
	'utilityService',
	function($scope, ipMgmtService, settingsService, $state, ModalService, utilityService) {

		
		$scope.sortOrder = "ip";		

		// GETTING PROVINCE NAME FROM SETTINGS
		settingsService.getSettings().then(function(setting){
			$scope.provinceName = setting.data[0].provinceName;
		});

		// ****************** TABS CONTROL
		$scope.activeTab = 'list';

		$scope.subnetListTabClass 	  = "active";
		$scope.addOneSubnetTabClass   = "";
		$scope.addSubnetRangeTabClass = "";

		$scope.setActiveTab = function(tab) {
			$scope.activeTab = tab;
			if (tab=='list') {
				$scope.subnetListTabClass 	  = "active";
				$scope.addOneSubnetTabClass   = "";
				$scope.addSubnetRangeTabClass = "";
			}
			else if (tab=='addOne') {
				$scope.subnetListTabClass 	  = "";
				$scope.addOneSubnetTabClass   = "active";
				$scope.addSubnetRangeTabClass = "";
			} 
			else {
				$scope.subnetListTabClass 	  = "";
				$scope.addOneSubnetTabClass   = "";
				$scope.addSubnetRangeTabClass = "active";
			}
		};
		// ******************END TABS CONTROL

		$scope.noSubnetsAvailable = true;

		/* ICONS FOR AVAILABILITY IN SUBNET LISTING */
		$scope.ipSubnetIcons = {
			true: "fa fa-square-o fa-fw",
			false: "fa fa-check-square fa-fw"
		}

		// REGULAR EXPRESSIONS FOR IP AND IP/CIDR FORMATS 
		$scope.ipRegExp = utilityService.getIPRegex();
		$scope.ipMaskRegExp = utilityService.getIPMASKRegex();

		$scope.anySubnetAvailable = function(subnets) {
			var result = false;
			angular.forEach(subnets, function(item) {
				if (item.available) {					
					result = true;
				}
			});
			return result;
		};

		$scope.refreshSubnetList = function() {
			ipMgmtService.getAllSubnets().$promise.then(function(data){			
				$scope.subnets = data;				
				if ($scope.anySubnetAvailable(data)) {
					$scope.noSubnetsAvailable = false;
				}
				else
					$scope.noSubnetsAvailable = true;
			});
		};
		$scope.refreshSubnetList();

		$scope.$on("subnetDeletion", function (event, args) {
			$scope.refreshSubnetList();
		});

		$scope.editSubnet = function(_id){
						
	    	ModalService.showModal({
			    templateUrl: '/templates/editSubnet.html',
			    controller: 'editSubnetCtrl',
			    inputs: {
			    	subnetId: _id
			    }
			    
			}).then(function(modal) {
            	modal.element.modal();
            	
            	//modal.close();
            });

	    };

		$scope.deleteSubnet = function(_id){
						
	    	ModalService.showModal({
			    templateUrl: '/templates/confirmDeleteModal.html',
			    controller: 'confirmDeleteSubnetsModalCtrl',
			    inputs: {
			    	deleteSubnetId: _id
			    }
			    
			}).then(function(modal) {
            	modal.element.modal();
            	
            	//modal.close();
            });

	    };

	    $scope.deleteAllSubnets = function() {
	    	ModalService.showModal({
			    templateUrl: '/templates/confirmDeleteModal.html',
			    controller: 'confirmDeleteSubnetsModalCtrl',
			    inputs: {
			    	deleteSubnetId: "ALL"
			    }
			    
			}).then(function(modal) {
            	modal.element.modal();
            	
            	//modal.close();
            });
	    }


	}
])
.controller('confirmDeleteSubnetsModalCtrl', [
	'$scope',
	'deleteSubnetId',
	'ipMgmtService', 
	'$state',
	'$rootScope',
	function($scope, deleteSubnetId, ipMgmtService, $state, $rootScope){

		$scope.confirm = function(){
	    	
	    	if (deleteSubnetId != "ALL") {
	    		ipMgmtService.deleteSubnet(deleteSubnetId).$promise.then(function(){
	    			$rootScope.$broadcast("subnetDeletion", {						
					});
	    		});
	    	}
	    	else if (deleteSubnetId == "ALL") {
	    		ipMgmtService.deleteSubnet("ALL").$promise.then(function() {
	    			$rootScope.$broadcast("subnetDeletion", {						
					});
	    		});
	    	}

	    	close({
                
            }, 500);
	    };

	    $scope.cancel = function() {

            //  Manually hide the modal.
            $element.modal('hide');

            //  Now call close, returning control to the caller.
            close({
        
            }, 500); // close, but give 500ms for bootstrap to animate
    	};
	}
]);