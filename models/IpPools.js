var mongoose = require('mongoose');

var IpPoolSchema = new mongoose.Schema({
	ip: String,
	mask: 	String,
	available: { type: Boolean, default: true }
});


IpPoolSchema.methods.updateFields = function(newData) {
	this.ip = newData.ip;
	this.mask 	= newData.mask;
	this.available = newData.available;
};

IpPoolSchema.methods.setUnavailable = function () {
	this.available = false;
};

IpPoolSchema.methods.setAvailable = function () {
	this.available = true;
};

mongoose.model('IpPool', IpPoolSchema);