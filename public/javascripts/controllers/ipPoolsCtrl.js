angular.module('linkups2').controller('ipPoolsCtrl', [
	'$scope',
	'ipMgmtService',
	'settingsService',
	function($scope, ipMgmtService, settingsService) {

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

		$scope.subnets = [];

		$scope.addRange = function(range) {

			if (ipMgmtService.rangeIsValid(range.firstSubnet, range.lastSubnet, range.CIDR)) {
				$scope.subnetsUnformatted = ipMgmtService.getSubnetsInRange(range.firstSubnet, range.lastSubnet, range.CIDR);
				angular.forEach($scope.subnetsUnformatted, function(item) {
					$scope.subnets.push({
						subnet: item,
						cidr: range.CIDR,
						available: true,
					});
				})
			}
		};

		
		
		$scope.subnets = [ 
						{
							subnet: "172.16.0.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.2.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.4.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.6.0", 
							cidr: '29',
							available: false,
						},
						{
							subnet: "172.16.8.0", 
							cidr: '29',
							available: false,
						},
						{
							subnet: "172.16.10.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.12.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.14.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.16.0", 
							cidr: '29',
							available: false,
						},
						{
							subnet: "172.16.18.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.20.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.22.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.24.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.26.0", 
							cidr: '29',
							available: false,
						},
						{
							subnet: "172.16.28.0", 
							cidr: '29',
							available: false,
						},
						{
							subnet: "172.16.30.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.32.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.34.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.36.0", 
							cidr: '29',
							available: false,
						},
						{
							subnet: "172.16.38.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.40.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.42.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.44.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.46.0", 
							cidr: '29',
							available: true,
						},
						{
							subnet: "172.16.48.0", 
							cidr: '29',
							available: false,
						}
					];

					$scope.ipSubnetIcons = {
						true: "fa fa-square-o fa-fw",
						false: "fa fa-check-square fa-fw"
					}
		


		
		
		

	}
]);