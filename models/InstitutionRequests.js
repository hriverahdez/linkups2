var mongoose = require('mongoose');

var InstitutionRequestSchema = new mongoose.Schema({
	type: String,
	name: String,
	location: String,
	status: String,
	statusIssue: String,
	createdAt: String,
	createdBy: String,
	approved: {type: Boolean, default: false},
	approvedBy: String,
	approvedAt: String,
});

InstitutionRequestSchema.methods.updateFields = function(newData) {
	this.type 			= newData.type;
	this.name 			= newData.name;
	this.location 		= newData.location;
	this.status 		= newData.status;
	this.statusIssue 	= newData.statusIssue;
	this.createdAt 		= newData.createdAt;
	this.createdBy 		= newData.createdBy;
	this.approved 		= newData.approved;
	this.approvedBy 	= newData.approvedBy;
	this.approvedAt 	= newData.approvedAt;
};

mongoose.model('InstitutionRequest', InstitutionRequestSchema);

