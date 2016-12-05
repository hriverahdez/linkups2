var mongoose = require('mongoose');

var InstitutionSchema = new mongoose.Schema({
	type: String,
	line_number: String,
	name: String,
	location: String,
	wan: String,
	lan: String,
	bandwidth: String,
	state: String,
	final_destination: String,
	gate_type: String,
	phone_number: String,
	last_report: String,
	has_internet: {type: Boolean, default: false},
	notes: String,
	createdAt: String,
	createdBy: String,
	last_modification_by: String,
	last_modification_time: String
});

InstitutionSchema.methods.updateFields = function(newData) {
	this.type = newData.type;
	this.line_number = newData.line_number;
	this.name = newData.name;
	this.location = newData.location;
	this.wan = newData.wan;
	this.lan = newData.lan;
	this.bandwidth = newData.bandwidth;
	this.state = newData.state;
	this.final_destination = newData.final_destination;
	this.gate_type = newData.gate_type;
	this.phone_number = newData.phone_number;
	this.last_report = newData.last_report;
	this.has_internet = newData.has_internet;
	this.notes = newData.notes;	
	this.last_modification_by = newData.last_modification_by;
	this.last_modification_time = newData.last_modification_time;
};

mongoose.model('Institution', InstitutionSchema);

