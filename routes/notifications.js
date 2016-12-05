var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Notification = mongoose.model('Notification');

var jwt = require('express-jwt');

var auth = jwt({secret: 'asusme99b', userProperty: 'payload'});

/* GET - Reading all */
router.get('/', function(req, res, next) {

	Notification.find(function(err, notification){
		if(err){ return next(err); }

		res.json(notification);
	});
});

/* POST - Creating one */
router.post('/', auth, function(req, res, next) {	
		
	var notification = new Notification(req.body);

	notification.save(function(err, notification){
		if(err){ return next(err); }

		res.json(notification);
	});
});


/* GET - Reading one */
router.get('/:id', auth, function(req, res) {
	
	Notification.findById({ _id: req.params.id }, function (err, notification){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!notification) { 
			res.status(404).json({message: 'can\'t find Notification'});
			return;
		}		
		res.json(notification);	
	});
	
});


/* PUT - Updating one */
router.put('/:id', auth, function(req, res){
    
    Notification.findById({ _id: req.params.id }, function (err, notification){
		if(err){ 
			res.status(404).json(err);
			return; 
		}
		if (!notification) { 
			res.status(404).json({message: 'Can\'t find Notification'});
			return;
		}
		notification.readNotification();		
		notification.save(function(err, notification){ 
			if (err) {
				console.log('There was an error saving to the database: ' + err);
				res.status(404).json(err);
				return;
			}
			res.status(201).json(notification);
		})
		
	});


});

/* DELETE - Deleting one */
router.delete('/:id', auth, function(req, res){
    
    Notification.remove({ _id: req.params.id }, function(err, notification){
        if (err) throw err;

        res.json(notification);
    });
});



module.exports = router;

