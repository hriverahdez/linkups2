var mongoose = require('mongoose');

var SettingSchema = new mongoose.Schema({
	provinceName: {type: String, default: "PROVINCIA(CAMBIAR_EN_AJUSTES)"},
	canRegister: {type: Boolean, default: false},
	showLineNumber: {type: Boolean, default: false}
});

SettingSchema.methods.updateFields = function(newData) {
	this.provinceName 	= newData.provinceName;
	this.canRegister 	= newData.canRegister;
	this.showLineNumber = newData.showLineNumber;
};

mongoose.model('Setting', SettingSchema);