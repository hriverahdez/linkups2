angular.module('linkups2').controller('ipPoolsCtrl', [
	'$scope',
	'ipMgmtService',
	'settingsService',
	'$state',
	'ModalService',
	function($scope, ipMgmtService, settingsService, $state, ModalService) {

		// GETTING PROVINCE NAME FROM SETTINGS
		settingsService.getSettings().then(function(setting){
			$scope.provinceName = setting.data[0].provinceName;
		});


		// TABS CONTROL
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
		// END TABS CONTROL

		$scope.ipSubnetIcons = {
			true: "fa fa-square-o fa-fw",
			false: "fa fa-check-square fa-fw"
		}
		$scope.noSubnets = true;

		ipMgmtService.getAllSubnets().$promise.then(function(data){			
			$scope.subnets = data;
			console.log(data.length);
			if (data.length != 0)
				$scope.noSubnets = false;
			else
				$scope.noSubnets = true;
		});

		$scope.addRange = function(range) {
			if (ipMgmtService.rangeIsValid(range.firstSubnet, range.lastSubnet, range.CIDR)) {
				ipMgmtService.addSubnetRange(range.firstSubnet, range.lastSubnet, range.CIDR)
					.$promise.then(function(){
						$scope.subnets = ipMgmtService.getAllSubnets();
					});
			}
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
	function($scope, deleteSubnetId, ipMgmtService, $state){

		$scope.confirm = function(){
	    	
	    	if (deleteSubnetId != "ALL") {
	    		ipMgmtService.deleteSubnet(deleteSubnetId);
	    	}
	    	else if (deleteSubnetId == "ALL") {
	    		ipMgmtService.deleteAllSubnets();
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