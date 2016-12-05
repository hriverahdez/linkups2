angular.module('linkups2').factory('mockService', [function(){
	return {
		getAllInstitutions: function(){
			var data = [{
					"type":"NODO",
					"line_number":"ED6121",
					"name":"Etecsa - Infomed",
					"location":"Pinar del Río",
					"wan":"201.220.192.144/30",					
					"lan":"201.220.204.88/29",
					"bandwidth":"6144",
					"state":"UP",
					"final_destination":"Infomed",
					"gate_type":"MPLS",
					"last_report":"<NO DISPONIBLE>",
				},{
					"type":"policlinico",
					"line_number":"ED010068",
					"name":"1ro de Enero",
					"location":"Consolación del Sur",
					"wan":"201.220.204.4/30",
					"bandwidth":"64",
					"state":"UP",
					"final_destination":"Nodo Pinar",
					"gate_type":"SHDSL",
					"last_report":"<NO DISPONIBLE>",
				},{
					"type":"NODO",
					"line_number":"ED010001",
					"name":"UCM",
					"location":"Pinar del Río",
					"wan":"10.11.0.0/30",
					"lan":"201.220.204.96/27",
					"bandwidth":"4096",
					"state":"UP",
					"final_destination":"Nodo Pinar",
					"gate_type":"Fibra",
					"last_report":"<NO DISPONIBLE>",			
				},{
					"type":"other",
					"line_number":"ED7378",
					"name":"CPICM",
					"location":"Pinar del Río",
					"wan":"10.11.5.72/30",
					"lan":"10.11.6.24/29",
					"bandwidth":"512",
					"state":"UP",
					"final_destination":"Nodo Pinar",
					"gate_type":"MPLS",
					"last_report":"<NO DISPONIBLE>"
				}];
			return data;
		}

	}
}]);