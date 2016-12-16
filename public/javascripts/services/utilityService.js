angular.module('linkups2').factory('utilityService', [
	'$rootScope', 
	'$state',
	'auth',
	function($rootScope, $state, auth){
		var utilityService = {};

		var institutionTypes = {
			"NODO": {		
				type: "NODO",
				name: "NODO",
				iconClass: "fa fa-sitemap" + " "
			},
			"policlinico": {	    	
		    	type: "policlinico",
		    	name: "Policlinico",
		    	iconClass: "fa fa-stethoscope" + " "
			},
			"hospital" : {	    	
		    	type: "hospital",
		    	name: "Hospital",
		    	iconClass: "fa fa-heartbeat" + " "
			},
			"dir_salud" : {	    	
		    	type: "dir_salud",
		    	name: "Dirección de Salud",
		    	iconClass: "fa fa-building" + " "
			},
			"c_genetica" : {	    	
		    	type: "c_genetica",
		    	name: "Centro de Genética",
		    	iconClass: "fa fa-venus-mars" + " "
			},
			"b_sangre" : {	    	
		    	type: "b_sangre",
		    	name: "Banco de Sangre",
		    	iconClass: "fa fa-tint" + " "
			},
			"c_higiene" : {	    	
		    	type: "c_higiene",
		    	name: "Centro de Higiene y Epidemiología",
		    	iconClass: "fa fa-h-square" + " "
			},
			"filial" : {	    	
		    	type: "filial",
		    	name: "Filial Estudiantil",
		    	iconClass: "fa fa-university" + " "
			},
			"other" : {	    	
		    	type: "other",
		    	name: "Otros",
		    	iconClass: "fa fa-ellipsis-h" + " "
			},
		};

		utilityService = {
			institutionTypes: institutionTypes,
		}

		utilityService.getInstitutionTypes = function(){
			return utilityService.institutionTypes;
		};

		utilityService.getInstTypeIcons = function(size){
			var cp = {};
			/* Make a copy of the original object */
			angular.copy(utilityService.institutionTypes, cp);
			/* Loop through the obj and add the size to the class of  every item */
			angular.forEach(cp, function(item){
				item.iconClass = item.iconClass + size;			
			});
	    	return cp;
		};

		utilityService.getHasInternetIcons = function(size){
			var internet = {
				true: "fa fa-thumbs-up " + size,
				false: "fa fa-thumbs-down " + size
			}
			return internet;
		};
		utilityService.getNotificationIcons = function(size){
			var notificationIcons = {
				SAVE: "fa fa-plus " + size,
				UPDATE: "fa fa-pencil " + size,
				DELETE: "fa fa-trash " + size,
				LOGIN: "fa fa-sign-in " + size,
				true: "fa fa-check-circle " + size,
				false: "fa fa-circle-thin " + size		
			}
			return notificationIcons;
		};
		utilityService.showLoader = function(){
			$rootScope.loadingOperation = true;
		};
		utilityService.hideLoader = function(){
			$rootScope.loadingOperation = false;
		};

		utilityService.secureRouteFrom = function(userRole){
			if (auth.currentUserRole() == userRole) {
				$state.go(auth.getCurrentUserHome());
			}
		};

		utilityService.getIPMASKRegex = function() {
			var reg_exp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([8-9]|[12]\d|3[0]))$/;
			return reg_exp;
		};

		utilityService.getIPRegex = function() {
			var reg_exp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
			return reg_exp;
		}


		return utilityService;
		
	}
]);
