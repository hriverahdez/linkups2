angular.module('linkups2').factory('ipMgmtService', [
	'$resource',
	'$http',
	'$httpParamSerializerJQLike',
	'auth',
	function ($resource, $http, $httpParamSerializerJQLike, auth) {

		var baseUrl = '/api/ipPools/:id';

		var headers = {
	        'Content-type' : 'application/x-www-form-urlencoded',
	        'Authorization': 'Bearer '+ auth.getToken()
	    };

	    var transformRequestFn = function(data, headersGetter) {
	        var str = [];
	        for(var d in data)
	            str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
	        return str.join("&");
	    };

	    var actions = {
	        getAllSubnets: {
	            method: 'GET',
	            isArray: true,
	            headers: headers
	        },
	        getById: {
	            method: 'GET',
	            headers: headers            
	        },
	        saveOneSubnet: {
	            method: 'POST',
	            headers: headers,
	            transformRequest: transformRequestFn,
	        },
	        saveBulk: {
	            method: 'POST',
	            isArray: true,
	            headers: headers,
	            transformRequest: $httpParamSerializerJQLike
	        },
	        updateSubnet: {
	            method: 'PUT',
	            isArray: false,
	            headers: headers,
	            transformRequest: transformRequestFn,
	        },
	        deleteSubnet: {
	            method: 'DELETE',
	            headers: headers
	        },	        
	    };

	    var IPResource = $resource(baseUrl, { id: '@_id' }, actions);


	    /**********************************************************/
	    /***                IP CALCULATIONS                     ***/
	    /**********************************************************/

		var ipMgmtService = {};

		/*	
			Get amount of octects in address that identify subnets. 
			Example: A /29 subnet mask is 255.255.255.248 and the method result is 3
		*/
		ipMgmtService.getNetworkOctets = function(CIDR) {
			return Math.floor(parseInt(CIDR) / 8);
		}

		/* 
			Get amount of bits that were borrowed from subnet's last octect. 			
			Example: A /29 subnet mask is 255.255.255.248 and the method result is 5,
			because 248 means that 5 bits were borrowed (in binary -> 11111000 = 248)
		*/
		ipMgmtService.getBorrowedBits = function(CIDR) {
			return parseInt(CIDR) % 8;
		};

		/*
			Obtain the octect that identifies hosts
			Example: Example: A /29 subnet mask is 255.255.255.248 and the method's result is 248
			See above.
		*/
		ipMgmtService.getHostsOctet = function(borrowedBits) {
			var maxPowerValue = 7;
			var variableOctet = 0;

			for (var i = 0; i < borrowedBits; i++) {
				//variableOctet += Math.pow(2, maxPowerValue);
				variableOctet += 2**maxPowerValue;
				maxPowerValue--;
			}
			return variableOctet;
		};

		/*
			Obtain netmask from a CIDR notation
			Example: For /29 CIDR the result is 255.255.255.248  
		*/
		ipMgmtService.obtainNetmask = function(CIDR) {

			var amountNetworkOctets = ipMgmtService.getNetworkOctets(CIDR);
			var borrowedBits 		= ipMgmtService.getBorrowedBits(CIDR);

			var netmask = "";
			for (var i = 0; i < amountNetworkOctets; i++) {
				netmask += "255.";
			};

			var maxPowerValue = 7;
			var variableOctet = 0;

			for (var i = 0; i < borrowedBits; i++) {
				//variableOctet += Math.pow(2, maxPowerValue);
				variableOctet += 2**maxPowerValue;
				maxPowerValue--;
			}

			netmask += ipMgmtService.getHostsOctet(borrowedBits).toString();

			switch(amountNetworkOctets) {
				case 1: netmask += ".0.0";
						break;
				case 2: netmask += ".0";
						break;
				case 3: break;
			}
			return netmask;

		};

		/*
			Get amount of subnets in a given subnet range
		*/
		ipMgmtService.getAmountOfSubnetsInRange = function(firstSubnet, lastSubnet, CIDR) {
			
			var amountNetworkOctets = ipMgmtService.getNetworkOctets(CIDR);
			var firstSubnetOctets 	= firstSubnet.split('.');
			var lastSubnetOctets 	= lastSubnet.split('.');

			var borrowedBits 		= ipMgmtService.getBorrowedBits(CIDR);

			var blockSize = 256 - ipMgmtService.getHostsOctet(borrowedBits);			
			var count = 0;
			var current = 0;
			var hostOctect = parseInt(firstSubnetOctets[amountNetworkOctets]);
			
			
			while (parseInt(lastSubnetOctets[amountNetworkOctets]) >= current) {
				current += blockSize;
				count++;
			};

			return count;
		}

		/*
			Returns an array with subnets in the given range, taking into account the block size for the jumps
		*/
		ipMgmtService.getSubnetsInRange = function(firstSubnet, lastSubnet, CIDR) {

			var amountNetworkOctets = ipMgmtService.getNetworkOctets(CIDR);			
			var borrowedBits 		= ipMgmtService.getBorrowedBits(CIDR);			
			var firstSubnetOctets 	= firstSubnet.split('.');
			var lastSubnetOctets 	= lastSubnet.split('.');

			var blockSize = 256 - ipMgmtService.getHostsOctet(borrowedBits);			
			var subnets = [];
			var current = firstSubnet;
			var amountOfSubnetsInRange = ipMgmtService.getAmountOfSubnetsInRange(firstSubnet, lastSubnet, CIDR);

			while (amountOfSubnetsInRange != 0) {
				
				subnets.push(current);
				firstSubnetOctets[amountNetworkOctets] = parseInt(firstSubnetOctets[amountNetworkOctets]) + blockSize
				current = firstSubnetOctets.join('.');
				amountOfSubnetsInRange--;

			}

			return subnets;

		};

		/* 
			Checks whether a given ip range is valid by comparing octets
		*/
		ipMgmtService.rangeIsValid = function(firstSubnet, lastSubnet, CIDR) {

			var firstSubnetOctets 	= firstSubnet.split('.');
			var lastSubnetOctets 	= lastSubnet.split('.');
			var amountNetworkOctets = ipMgmtService.getNetworkOctets(CIDR);
			var valid = true;

			for (var i = 0; i < amountNetworkOctets; i++) {
				
				if (firstSubnetOctets[i] != lastSubnetOctets[i]) {					
					valid = false;
					break;
				}
			}
			return valid;
		};

		/************************************************/
		/************************************************/
		/*	               DATA ACCESS                  */
		/************************************************/
		/************************************************/

		ipMgmtService.getAllSubnets = function() {
			return IPResource.getAllSubnets();
		};

		ipMgmtService.getById = function(_id) {
			return IPResource.getById({ id: _id});
		}

		ipMgmtService.addSingleSubnet = function(subnet) {
			return IPResource.saveOneSubnet(subnet);
		}

		ipMgmtService.updateSingleSubnet = function(subnet) {
			return IPResource.updateSubnet(subnet);
		};

		ipMgmtService.addSubnetRange = function(firstSubnet, lastSubnet, CIDR) {
			
			var subnetsUnformattedArray = ipMgmtService.getSubnetsInRange(firstSubnet, lastSubnet, CIDR);

			var subnetsArray = {};

			
			for (var i = 0; i < subnetsUnformattedArray.length; i++) {	
				subnetsArray[i] = {
					ip: 		subnetsUnformattedArray[i],
					mask: 		CIDR,
					available: 	true,
				}
			}
			subnetsArray.length = subnetsUnformattedArray.length;
			return IPResource.saveBulk(subnetsArray);
		}

		ipMgmtService.deleteSubnet = function(_id) {
			return IPResource.deleteSubnet({id: _id});
		};

		ipMgmtService.deleteAllSubnets = function() {
			return $http({
				method: 'DELETE',
				url: '/api/ipPools/deleteAll',
				headers: headers,				
			}).success(function (response) {
				
			}).error(function (error){
				console.log('error');
			});
		}

		ipMgmtService.getAllAvailableSubnets = function() {
			return $http({
				method: 'GET',
				url: '/api/ipPools/getAvailable',
				headers: headers,
				transformRequest: transformRequestFn,
				isArray: true
			}).success(function (response) {
				
			}).error(function (error){
				console.log('error');
			});
		};

		ipMgmtService.setUnavailable = function(subnet) {
			return $http({
				method: 'POST',
				url: '/api/ipPools/setAvailability',
				headers: headers,
				data: {
					ip: 		subnet.ip,
					available: 	false
				},
				transformRequest: $httpParamSerializerJQLike,
			}).success(function (response) {
				
			}).error(function (error){
				console.log('error');
			});
		};

		ipMgmtService.setAvailable = function(subnet) {
			return $http({
				method: 'POST',
				url: '/api/ipPools/setAvailability',
				headers: headers,
				data: {
					ip: 		subnet.ip,
					available: 	true
				},
				transformRequest: $httpParamSerializerJQLike,
			}).success(function (response) {
				
			}).error(function (error){
				console.log('error');
			});
		};

		return ipMgmtService;
	}
]);