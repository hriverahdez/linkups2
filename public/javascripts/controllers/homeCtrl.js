angular.module('linkups2')

.controller('homeCtrl', [
	'$scope', 
	'instData', 
	'ModalService',
	'utilityService',
	'$filter',
	'DTOptionsBuilder',
	function($scope, instData, ModalService, utilityService, $filter, DTOptionsBuilder) {
	
		$scope.typeIconClasses = utilityService.getInstTypeIcons("fa-2x fa-fw");
		$scope.legendIconClasses = utilityService.getInstTypeIcons("fa-1x");

		$scope.selectedPage = 1;
		$scope.pageSize = 2;

		$scope.selectPage = function (newPage) {
			$scope.selectedPage = newPage;
		};

		/* Building Options for the DataTable */
    	$scope.dtOptions = DTOptionsBuilder
					        .newOptions()            
	            			.withOption('hasBootstrap', true);	            			
	            			
	    
	    instData.getAllInstitutions(function(institutions){	    	
	    	$scope.institutions = institutions;
	    	//console.log($scope.institutions);
	    });

	    $scope.viewInst = function(_id){
	    	ModalService.showModal({
			    templateUrl: '/templates/modal.html',
			    controller: 'deleteInstCtrl',
			    inputs: {
			        inst_id: _id,
			        view: true
			    }
			}).then(function(modal) {
            	modal.element.modal();
            	//modal.close();
            });
	    };
	    
	    $scope.deleteInst = function(_id){
	    	
	    	ModalService.showModal({
			    templateUrl: '/templates/modal.html',
			    controller: 'deleteInstCtrl',
			    inputs: {
			        inst_id: _id,
			        view: false
			    }
			}).then(function(modal) {
            	modal.element.modal();
            	//modal.close();
            });

	    }
    
	}
]);