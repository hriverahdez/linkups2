angular.module('linkups2').controller('statsCtrl', [
	'$scope',
	'instData',
	'$filter',
	'settingsService',
	'utilityService',
	'NAVBAR_TEMPLATE_URL',
	'auth',
	function($scope, instData, $filter, settingsService, utilityService, NAVBAR_TEMPLATE_URL, auth) {
		$scope.currentUserRole = auth.currentUserRole();
		$scope.navbar = {
			url: NAVBAR_TEMPLATE_URL
		};

		$scope.bandwidthGroups = [];
		$scope.internetGroups = [];
		$scope.institutionTypeGroups = [];
		
		

	    instData.getAllInstitutions(function(institutions){	    	
	    	$scope.institutions = institutions;
	    	
	    	
	    	$scope.groupBy($scope.institutions, $scope.bandwidthGroups, "bandwidth", "Kbps");
	    	
	    	var aliasesInternet = {
				"first" : {
					'type' : 'true',
					'name' : 'SI'
				},
				"second" : {
					'type' : 'false',
					'name' : 'NO'
				}
			};

	    	$scope.groupBy($scope.institutions, $scope.internetGroups, "has_internet", "", aliasesInternet);

	    	var aliasesInst = utilityService.getInstitutionTypes();

	    	$scope.groupBy($scope.institutions, $scope.institutionTypeGroups, "type", "", aliasesInst);
	    });

	    /* 
	    	Loop through <collection> and group items by <groupByParameter> then add them to <resultArray>. 
	    	If present, add <labelSuffix> to the name of the grouped items.
	    	If present change the name of the item from to collection to the defined alias in the <aliases> array
	    	
	    */
	   	$scope.groupBy = function(collection, resultArray, groupByParameter, labelSuffix, aliases) {

	   		angular.forEach(collection, function(item){
	    		var index = -1;	    		
	    		for (var i = 0; i < resultArray.length; i++) {
	    			if (resultArray[i]) {
	    				if (resultArray[i].label == (item[groupByParameter] + labelSuffix)) {
	    					index = i;
	    					break;
	    				}
	    			}	    			
	    		}
	    		if (index == -1) {
	    			resultArray[resultArray.length] = {
	    				"label" : item[groupByParameter] + labelSuffix,
	    				"value" : 1
		    		}		    		
	    		}
	    		else {	    			
	    			resultArray[index].value++;
	    		}

	    	});

	    	if (aliases) {
	    		for (var i = 0; i < resultArray.length; i++) {
	    			angular.forEach(aliases, function(alias){
	    				if (resultArray[i].label == alias.type)
	    					resultArray[i].label = alias.name;
	    			});
	    		}
	    	}	    	

	   	};

	    /* Mockup Data */
		$scope.test = [
	        [ 
		        { "label": "Paper Cost", "value": "25" },
		        { "label": "Binding", "value": "20" },
		        { "label": "Printing Cost", "value": "20" },
		        { "label": "Royality", "value": "15" },
		        { "label": "Transportation Cost", "value": "10" },
		        { "label": "Promotion Cost", "value": "10" } 
	        ],
	        [ 
		        { "label": "Paper Cost", "value": "25" },
		        { "label": "Binding", "value": "20" },
		        { "label": "Printing Cost", "value": "20" },
		        { "label": "Royality", "value": "15" },
		        { "label": "Transportation Cost", "value": "10" },
		        { "label": "Promotion Cost", "value": "10" } 
	        ],
	        [ 
		        { "label": "Paper Cost", "value": "25" },
		        { "label": "Binding", "value": "20" },
		        { "label": "Printing Cost", "value": "20" },
		        { "label": "Royality", "value": "15" },
		        { "label": "Transportation Cost", "value": "10" },
		        { "label": "Promotion Cost", "value": "10" }
	        ]
	    ]; 

	    $scope.getChartCommonOpts = function () {
	    	var cp = {};
	    	var chartCommon = { 
	    		"bgcolor": "FFFFFF",
		        "showvalues": "1",
		        "showpercentvalues": "0",
		        "showborder": "0",
		        "showplotborder": "0",
		        "showlegend": "1",
		        "legendborder": "0",
		        "legendposition": "bottom",
		        "enablesmartlabels": "1",
		        "use3dlighting": "0",
		        "showshadow": "0",
		        "legendbgcolor": "#CCCCCC",
		        "legendbgalpha": "20",
		        "legendborderalpha": "0",
		        "legendshadow": "0",
		        "legendnumcolumns": "3",
		        "palettecolors": "#f8bd19,#e44a00,#008ee4,#33bdda,#6baa01,#583e78,#00CC66,#36BAE2",	
		        "enableRotation": "0",		        
		        "enableMultiSlicing" : "0"
			};
			angular.copy(chartCommon, cp);
			return cp;
	    }
	   

	    /* Parameters for the Bandwidth Graph */
	    var bandwidthDataCaption = "Ancho de banda de los Enlaces";
		$scope.bandwidthData = {
		    "chart": $scope.getChartCommonOpts(),
		    "data": $scope.bandwidthGroups
		};

		var institutionTypeDataCaption = "Cantidad de instituciones por tipo";
		$scope.institutionTypeData = {
		    "chart": $scope.getChartCommonOpts(),
		    "data": $scope.institutionTypeGroups
		};

		var internetDataCaption = "Cantidad de instituciones con acceso a Internet";
		$scope.internetData = {
		    "chart": $scope.getChartCommonOpts(),
		    "data": $scope.internetGroups
		};



		//Assign caption and subcaption to charts after settings have been retrieved
		settingsService.getSettings().then(function(setting){
			$scope.bandwidthData.chart.caption = bandwidthDataCaption;
			$scope.bandwidthData.chart.subcaption = setting.data[0].provinceName;

			$scope.internetData.chart.caption = internetDataCaption;
			$scope.internetData.chart.subcaption = setting.data[0].provinceName;

			$scope.institutionTypeData.chart.caption = institutionTypeDataCaption;
			$scope.institutionTypeData.chart.subcaption = setting.data[0].provinceName;
		});

	}  /* function closure brace */
])