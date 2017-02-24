angular.module('linkups2')

.controller('homeCtrl', [
	'$scope', 
	'instData', 
	'ModalService',
	'utilityService',
	'DTOptionsBuilder',
	'$rootScope',	
	'settingsService',
	'NAVBAR_TEMPLATE_URL',
	'auth',
	function($scope, instData, ModalService, utilityService, DTOptionsBuilder, $rootScope, settingsService, NAVBAR_TEMPLATE_URL, auth) {

		$scope.currentUserRole = auth.currentUserRole();
		$scope.navbar = {
			url: NAVBAR_TEMPLATE_URL
		};

		$scope.canShowLineNumber = false;

		settingsService.getSettings().then(function(setting){
			$scope.provinceName = setting.data[0].provinceName;
			$scope.canShowLineNumber = setting.data[0].showLineNumber;
		});

		$scope.typeIconClasses = utilityService.getInstTypeIcons("fa-2x fa-fw");
		$scope.legendIconClasses = utilityService.getInstTypeIcons("fa-1x");

		$scope.showFilters = false;
		$scope.role = $rootScope.currentUserRole;

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