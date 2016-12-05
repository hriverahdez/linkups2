var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Setting = mongoose.model('Setting');

var jwt = require('express-jwt');
var secret = process.env.secret;
var auth = jwt({secret: secret, userProperty: 'payload'});

/* GET - Reading all */
router.get('/', function(req, res, next) {

	Setting.find(function(err, setting){
		if(err){ return next(err); }

		res.json(setting);
	});
});

/* POST - Creating one */
router.post('/', function(req, res, next) {	
	
	Setting.findOne({}, function (err, setting){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!setting) { 
			//res.status(404).json({message: 'Can\'t find Setting'});
			var setting = new Setting(req.body);
			
		}
		else {
			setting.updateFields(req.body);
		}		
		setting.save(function(err, setting){ 
			if (err) {
				console.log('There was an error saving to the database: ' + err);
				res.status(404).json(err);
				return;
			}
			res.status(201).json(setting);
		})
		
	});	

});

/* POST - Creating one */
router.post('/initialize', function(req, res, next) {	
	
	Setting.findOne({}, function (err, setting){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!setting) { 
			//res.status(404).json({message: 'Can\'t find Setting'});
			var setting = new Setting(req.body);
			setting.save(function(err, setting){ 
				if (err) {
					console.log('There was an error saving to the database: ' + err);
					res.status(404).json(err);
					return;
				}
				res.status(201).json(setting);
			})
		}	
		else {
			return;
		}		
		
	});	

});



/*
router.post('/check', function(req, res) {
	console.log(req.body.settingName)	;
	Setting.findOne({ settingName: req.body.settingName }, function (err, setting){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!setting) { 
			res.status(404).json({message: 'can\'t find Setting'});
			return;
		}		
		res.json(setting);	
	});	
}); */


/* GET - Reading one */
router.get('/:id', function(req, res) {
	
	Setting.findOne({ _id: req.params.id }, function (err, setting){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!setting) { 
			res.status(404).json({message: 'can\'t find Setting'});
			return;
		}		
		res.json(setting);	
	});
	
});


/* PUT - Updating one */
router.put('/:id', function(req, res){
    
    Setting.findOne({ settingName: req.body.settingName }, function (err, setting){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!setting) { 
			res.status(404).json({message: 'Can\'t find Setting'});
			return;
		}
		setting.updateFields(req.body);
		setting.save(function(err, setting){ 
			if (err) {
				console.log('There was an error saving to the database: ' + err);
				res.status(404).json(err);
				return;
			}
			res.status(201).json(setting);
		})
		
	});


});

/* DELETE - Deleting one */
/*
router.delete('/:id', auth, function(req, res){
    
    Notification.remove({ _id: req.params.id }, function(err, notification){
        if (err) throw err;

        res.json(notification);
    });
});
*/

module.exports = router;