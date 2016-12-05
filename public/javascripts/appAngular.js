(function(){

	angular.module('linkups2', [
		'ui.router', 
		'ngResource', 
		'angularModalService', 
		'datatables', 
		'datatables.bootstrap', 
		'ng-fusioncharts'
	])

	.config([
		'$stateProvider',
		'$urlRouterProvider',
		'$httpProvider',
		function($stateProvider, $urlRouterProvider, $httpProvider) {

			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: '/templates/login.html',
					controller: 'loginCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(auth.isLoggedIn()){
							$state.go('home');
						}
					}]
				})

				.state('register', {
					url: '/register',
					templateUrl: '/templates/register.html',
					controller: 'loginCtrl',
					onEnter: ['$state', 'auth', 'settingsService', function($state, auth, settingsService){						
						if(auth.isLoggedIn()){
							$state.go('home');
						}						
						settingsService.getSettings().then(function(settings){
							//returns an Array of settings, but since only 1 is ever instantiated
							// we get the first one and retrieve the property
							var canRegister = settings.data[0].canRegister;
							if (!canRegister) {
								$state.go('login');
							}
						});
					}]
				})

				.state('home', {
					url: '/home',
					templateUrl: '/templates/home.html',
					controller: 'homeCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]
				})
				.state('addInst', {
					url: '/addInst',
					templateUrl: '/templates/addInst.html',
					controller: 'addInstCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]
				})
				.state('updateInst', {
					url: '/updateInst/:id',
					templateUrl: '/templates/addInst.html',
					controller: 'updateInstCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]
				})
				.state('showAllNotifications', {
					url: '/showAllNotifications',
					templateUrl: '/templates/notifications.html',
					controller: 'notificationCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]
				})
				.state('viewUsers', {
					url: '/viewUsers',
					templateUrl: '/templates/viewUsers.html',
					controller: 'viewUsersCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]
				})
				.state('viewProfile', {
					url: '/viewProfile',
					templateUrl: '/templates/profile.html',
					controller: 'profileCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]
				})
				.state('createUser', {
					url: '/createUser',
					templateUrl: '/templates/register.html',
					controller: 'loginCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]				
				})
				.state('stats', {
					url: '/stats',
					templateUrl: '/templates/stats.html',
					controller: 'statsCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]	
				})
				.state('settings', {
					url: '/settings',
					templateUrl: '/templates/settings.html',
					controller: 'settingsCtrl',
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()){							
							$state.go('login');							
						}
					}]
				})
				

			$urlRouterProvider.otherwise('login');
	}])

	.run(function ($rootScope, $state, auth, settingsService) {

		$rootScope.initialConfig = function() {
			
			//CREATING DEFAULT USER
			var admin = {
				username: 	'admin',
				password: 	'admin',
				fullname: 	'DEFAULT USER',
				role: 		'ADMIN'
			}
			auth.checkUserAvailability(admin).then(function(response){
				if (response.data.available) {
					auth.createUser(admin);
				}
			});	

			//CREATING DEFAULT SETTINGS			
			settingsService.initialSettings();
			settingsService.getSettings().then(function(settings){
				$rootScope.provinceName = settings.data[0].provinceName;	
			});
		};

		$rootScope.initialConfig();

		// UPDATE PROVINCE NAME ON NAVBAR AFTER CHANGE IN SETTINGS
		$rootScope.$on('settingsSaved', function(event, args){
			$rootScope.provinceName = args.newProvinceName;
		});

		// TOGGLE OFF THE LOADING OVERLAY
		$rootScope.loadingOperation = false;
		// HIDE NAVBAR ON LOGIN SCREEN
		$rootScope.showNavbar = false;
		// GET CURRENT USER INFO - TRIGGERED AFTER LOG IN
		$rootScope.getCurrentUser = function(){
			$rootScope.currentUser 		= auth.currentUser();
			$rootScope.currentUserRole 	= auth.currentUserRole();
		};		
		$rootScope.checkIfUserLoggedIn = function(){ 
			return auth.isLoggedIn();
		};
		$rootScope.logOut = function(){
			auth.logOut();
		};
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		    if (toState.name === 'login' || toState.name === 'register') {
		    	//toState variable see the state you're going 
		        $rootScope.showNavbar = false;		        
		    } else {		    			    	
		    	if ($rootScope.checkIfUserLoggedIn()) {
		    		$rootScope.getCurrentUser();		    		
		        	$rootScope.showNavbar = true;
		    	}
		    }
		});
	});

})();