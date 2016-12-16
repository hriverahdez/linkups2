var mongoose = require('mongoose');

var IpPoolSchema = new mongoose.Schema({
	ip: 		String,
	mask: 		String,
	available: 	{ type: Boolean, default: true }
});


IpPoolSchema.methods.updateFields = function(newData) {
	this.ip = newData.ip;
	this.mask 	= newData.mask;
	this.available = newData.available;
};

IpPoolSchema.methods.setAvailability = function (availability) {
	this.available = availability;
};

mongoose.model('IpPool', IpPoolSchema);