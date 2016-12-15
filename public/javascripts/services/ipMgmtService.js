angular.module('linkups2').factory('ipMgmtService', [
	function () {
		var ipMgmtService = {};

		/*	
			Get amount of octects in address that identify subnets. 
			Example: A /29 subnet mask is 255.255.255.248 and the method result is 3
		*/
		ipMgmtService.getAmountOfFullOctets = function(CIDR) {
			return Math.floor(CIDR / 8);
		}

		/* 
			Get amount of bits that were borrowed from subnet's last octect. 			
			Example: A /29 subnet mask is 255.255.255.248 and the method result is 5,
			because 248 means that 5 bits were borrowed (11111000 = 248)
		*/
		ipMgmtService.getBorrowedBits = function(CIDR) {
			return CIDR % 8;
		};

		/*
			Obtain the octect that identifies hosts
			Example: Example: A /29 subnet mask is 255.255.255.248 and the method result is 248
			See above.
		*/
		ipMgmtService.getHostsOctet = function(borrowedBits) {
			var maxPowerValue = 7;
			var variableOctet = 0;

			for (var i = 0; i < borrowedBits; i++) {
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

			var amountOfFullOctets 	= ipMgmtService.getAmountOfFullOctets(CIDR);
			var borrowedBits 		= ipMgmtService.getBorrowedBits(CIDR);

			var netmask = "";
			for (var i = 0; i < amountOfFullOctets; i++) {
				netmask += "255.";
			};

			var maxPowerValue = 7;
			var variableOctet = 0;

			for (var i = 0; i < borrowedBits; i++) {
				variableOctet += 2**maxPowerValue;
				maxPowerValue--;
			}

			netmask += ipMgmtService.getHostsOctet().toString();

			switch(amountOfFullOctets) {
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
			
			var amountOfFullOctets 	= ipMgmtService.getAmountOfFullOctets(CIDR);
			var firstSubnetOctets 	= firstSubnet.split('.');
			var lastSubnetOctets 	= lastSubnet.split('.');

			var borrowedBits 		= ipMgmtService.getBorrowedBits(CIDR);
			var blockSize = 256 - ipMgmtService.getHostsOctet(borrowedBits);
			var count = 0;
			var current = 0;
			var octectToIncrement = parseInt(firstSubnetOctets[amountOfFullOctets]);
			
			//console.log(octectToIncrement);
			
			while (parseInt(lastSubnetOctets[amountOfFullOctets]) >= current) {
				current += octectToIncrement + blockSize;
				count++;
			};

			return count;
		}

		/*
			Returns an array with subnets in the given range, taking into account the block size for the jumps
		*/
		ipMgmtService.getSubnetsInRange = function(firstSubnet, lastSubnet, CIDR) {

			var amountOfFullOctets 	= ipMgmtService.getAmountOfFullOctets(CIDR);
			var borrowedBits 		= ipMgmtService.getBorrowedBits(CIDR);
			var firstSubnetOctets 	= firstSubnet.split('.');
			var lastSubnetOctets 	= lastSubnet.split('.');

			var blockSize = 256 - ipMgmtService.getHostsOctet(borrowedBits);
			var subnets = [];
			var current = firstSubnet;
			var amountOfSubnetsInRange = ipMgmtService.getAmountOfSubnetsInRange(firstSubnet, lastSubnet, CIDR);
			while (amountOfSubnetsInRange != 0) {
				
				subnets.push(current);
				firstSubnetOctets[amountOfFullOctets] = parseInt(firstSubnetOctets[amountOfFullOctets]) + blockSize
				current = firstSubnetOctets.join('.');
				amountOfSubnetsInRange--;

			}

			return subnets;

		};

		ipMgmtService.rangeIsValid = function(firstSubnet, lastSubnet, CIDR) {

			var firstSubnetOctets 	= firstSubnet.split('.');
			var lastSubnetOctets 	= lastSubnet.split('.');
			var amountOfFullOctets 	= ipMgmtService.getAmountOfFullOctets(CIDR);


			var valid = true;
			for (var i = 0; i < amountOfFullOctets; i++) {
				if (firstSubnetOctets[i] > lastSubnetOctets[i]) {
					valid = false;
					break;
				}
			}

			return valid;
		};



		return ipMgmtService;
	}
]);