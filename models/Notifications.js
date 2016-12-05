var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema({
	type: String,
	message: String,
	time: String,
	user: String,
	read: {type: Boolean, default: false}
});

NotificationSchema.methods.updateFields = function(newData) {
	this.type = newData.type;
	this.message = newData.message;
	this.time = newData.time;
	this.user = newData.user;
};

NotificationSchema.methods.readNotification = function() {
	this.read = true;
};

NotificationSchema.methods.unreadNotification = function() {
	this.read = false;
};

mongoose.model('Notification', NotificationSchema);