(function(){

	angular.module('linkups2', [
		'ui.router', 
		'ngResource', 
		'angularModalService', 
		'datatables', 
		'datatables.bootstrap', 
		'ng-fusioncharts'
	])

	.constant('NAVBAR_TEMPLATE_URL', '/templates/nav.html')

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
				})

				.state('register', {
					url: '/register',
					templateUrl: '/templates/register.html',
					controller: 'loginCtrl',
					onEnter: ['$state', 'auth', 'settingsService', function($state, auth, settingsService){
						settingsService.getSettings().then(function(settings){
							// If registration is disabled, send user back to login page
							// returns an Array of settings, but since only 
							// 1 setting obj is ever instantiated
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
				})				
				.state('addInst', {
					url: '/addInst',
					templateUrl: '/templates/addInst.html',
					controller: 'addInstCtrl',					
				})
				.state('updateInst', {
					url: '/updateInst/:id',
					templateUrl: '/templates/addInst.html',
					controller: 'updateInstCtrl',					
				})
				.state('showAllNotifications', {
					url: '/showAllNotifications',
					templateUrl: '/templates/notifications.html',
					controller: 'notificationCtrl',					
				})
				.state('viewUsers', {
					url: '/viewUsers',
					templateUrl: '/templates/viewUsers.html',
					controller: 'viewUsersCtrl',					
				})
				.state('viewProfile', {
					url: '/viewProfile',
					templateUrl: '/templates/profile.html',
					controller: 'profileCtrl',					
				})
				.state('createUser', {
					url: '/createUser',
					templateUrl: '/templates/register.html',
					controller: 'loginCtrl',					
				})
				.state('stats', {
					url: '/stats',
					templateUrl: '/templates/stats.html',
					controller: 'statsCtrl',					
				})
				.state('settings', {
					url: '/settings',
					templateUrl: '/templates/settings.html',
					controller: 'settingsCtrl',					
				})
				.state('ipPools', {
					url: '/ipPools',
					templateUrl: '/templates/ipPools.html',
					controller: 'ipPoolsCtrl'
				})		

			$urlRouterProvider.otherwise('login');

	}])

	.run(function ($rootScope, $state, auth, settingsService, $location) {

		// INITITALIZING APP //
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
		/////////////////////////////////////////

		// TOGGLE OFF THE LOADING OVERLAY
		$rootScope.loadingOperation = false;

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

			var securedAppStates = [
				'home', 
				'addInst', 
				'updateInst', 
				'showAllNotifications', 
				'viewUsers', 
				'viewProfile',
				'createUser',
				'stats',
				'settings',
				'ipPools'
			];
			var adminAppStates = [
				'addInst',
				'updateInst',
                'showAllNotifications',
                'viewUsers',
                'createUser',
                'settings',
                'ipPools'
			];

			// If accessing one of the securedAppStates and user is not logged in
			if (($.inArray(toState.name, securedAppStates) !== -1) && !auth.isLoggedIn()) {
				event.preventDefault();
				$state.go('login');
			}

            // If accessing one of the securedAppStates and user is not logged in
            if (($.inArray(toState.name, adminAppStates) !== -1) && auth.currentUserRole() === 'GUEST') {
                event.preventDefault();
                $state.go('home');
            }

		    if ((toState.name === 'login' || toState.name === 'register') && auth.isLoggedIn()) {		    
		        event.preventDefault();
		        $state.go('home');
		    }
		    
		});
	});

})();