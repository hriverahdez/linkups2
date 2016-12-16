angular.module('linkups2').controller('ipPoolsCtrl', [
	'$scope',
	'ipMgmtService',
	'settingsService',
	'$state',
	'ModalService',
	'utilityService',
	function($scope, ipMgmtService, settingsService, $state, ModalService, utilityService) {

		$scope.range = {
			mask: "24"
		};
		$scope.sortOrder = "ip";
		$scope.singleSubnet = {
			fullMask: "X.X.X.X"
		};

		// ************ SHOW FULL NESTMASK 
		$scope.fullNetmask = ipMgmtService.obtainNetmask($scope.range.mask);

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

		/* ICONS FOR AVAILABILITY IN SUBNET LISTING */
		$scope.ipSubnetIcons = {
			true: "fa fa-square-o fa-fw",
			false: "fa fa-check-square fa-fw"
		}

		$scope.noSubnets = true;
		$scope.invalidRange = true;

		// REGULAR EXPRESSIONS FOR IP AND IP/CIDR FORMATS 
		$scope.ipRegExp = utilityService.getIPRegex();
		$scope.ipMaskRegExp = utilityService.getIPMASKRegex();

		$scope.refreshSubnetList = function() {
			ipMgmtService.getAllSubnets().$promise.then(function(data){			
				$scope.subnets = data;				
				if (data.length != 0)
					$scope.noSubnets = false;
				else
					$scope.noSubnets = true;
			});
		};

		$scope.refreshSubnetList();

		$scope.validateRange = function(form) {
			$scope.fullNetmask = ipMgmtService.obtainNetmask($scope.range.mask);
			if (form.$valid) {
				if (ipMgmtService.rangeIsValid($scope.range.firstSubnet, $scope.range.lastSubnet, $scope.range.mask)) {
					$scope.invalidRange = false;
				}
				else {
					$scope.invalidRange = true;	
				}
			}
		};

		$scope.showFullNetMask = function() {
			if ($scope.singleSubnet.ip) {
				var subnet = $scope.singleSubnet.ip.split('/');
				var mask = subnet[1];
				$scope.singleSubnet.fullMask = ipMgmtService.obtainNetmask(mask);
			}
		};

		$scope.addOneSubnet = function() {
			var subnet = $scope.singleSubnet.ip.split('/');
			$scope.singleSubnet.ip = subnet[0];
			$scope.singleSubnet.mask = subnet[1];
			ipMgmtService.addSingleSubnet($scope.singleSubnet).$promise.then(function(){
				$scope.refreshSubnetList();
			});
		};

		$scope.addRange = function() {
			if (ipMgmtService.rangeIsValid($scope.range.firstSubnet, $scope.range.lastSubnet, $scope.range.mask)) {
				ipMgmtService.addSubnetRange($scope.range.firstSubnet, $scope.range.lastSubnet, $scope.range.mask)
					.$promise.then(function(){
						$scope.refreshSubnetList();
					});
			}
		};

		$scope.$on("subnetDeletion", function (event, args) {
			$scope.refreshSubnetList();
		});

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
	    		ipMgmtService.deleteAllSubnets().then(function() {
	    			$rootScope.$broadcast("subnetDeletion", {						
					});
	    		});
	    	}
	    	//$state.transitionTo('viewUsers', {}, {reload: true});	    		    	
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