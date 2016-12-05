angular.module('linkups2').controller('viewUsersCtrl', [
	'$scope', 
	'auth',
	'ModalService',
	'$element',
	'$rootScope',
	'$state',
	function($scope, auth, ModalService, $element, $rootScope, $state){

		auth.retrieveUserList().then(function(users){
			$scope.users = users.data;
			// ASSIGN ADMIN DEFAULT USER TO ANOTHER VARIABLE
			angular.forEach($scope.users, function(user){
				if (user.username == "admin"){
					$scope.admin = user;					
				}
			});
		});

		$scope.currentUser = $rootScope.currentUser;

		$scope.changeRole = function(user) {
			user.role = user.role=='GUEST'?'ADMIN':'GUEST';
			auth.changeRole(user);			
		};

		$scope.deleteUser = function(_id){
						
	    	ModalService.showModal({
			    templateUrl: '/templates/confirmDeleteModal.html',
			    controller: 'confirmModalCtrl',
			    inputs: {
			    	deleteUserId: _id
			    }
			    
			}).then(function(modal) {
            	modal.element.modal();
            	
            	//modal.close();
            });

	    };

	        
		
	}
])
.controller('confirmModalCtrl', [
	'$scope',
	'deleteUserId',
	'auth', 
	'$state',
	function($scope, deleteUserId, auth, $state){

		$scope.confirm = function(){
	    	
	    	console.log(deleteUserId);
	    	auth.deleteUser(deleteUserId);
	    	$state.transitionTo('viewUsers', {}, {reload: true});	    		    	
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