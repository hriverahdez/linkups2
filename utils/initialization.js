var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Institution = mongoose.model('Institution');
var IpPool = mongoose.model('IpPool');
var User = mongoose.model('User');
var Setting = mongoose.model('Setting');

module.exports = {
    initUser : function() {
        //Check if there's any user at the database
        User.findOne({}, function (err, user) {
            if (err) {
                console.log(err);
            }
            //If not initialize with ADMIN
            if (!user) {
                var user = new User();
                user.username = 'admin'
                user.fullname = 'System\'s Default User'
                user.role = 'ADMIN';
                user.setPassword('admin');
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('created default user')
                });
            } else {
                console.log('default user already created')
            }
        });
    },
    initSettings : function() {
        Setting.findOne({}, function (err, setting){
            if(err){
                console.log(err);
            }
            if (!setting) {
                //res.status(404).json({message: 'Can\'t find Setting'});
                var setting = new Setting();
                setting.save(function(err, setting){
                    if (err) {
                        console.log('There was an error saving to the database: ' + err);
                    }
                    console.log('Settings initialized');
                })
            }
            else {
                console.log("Settings already initialized");
            }
        });
    },
    runUpdate : function () {
        console.log(process.env.updatingVersion);
        if (process.env.updatingVersion === 'yes') {
            console.log('------> PERFORMING APP UPDATE <------');
            IpPool.findOne({}, function (err, ip) {
                if (err) {
                    console.log('There was an error querying for ip pools');
                    console.log(err);
                }
                if (!ip) {
                    // No ip pools found. Query for institutions
                    Institution.findOne({}, function (err, inst) {
                        if (err) {
                            console.log('There was an error querying for institutions');
                            console.log(err);
                        }
                        if (!inst) {
                            //No institutions found. App is running for the fist time. Update not required.
                            console.log('Skipping update process as is not required. ' +
                                'Change the configuration variable accordingly in /config/_env/config');
                        }
                        else {
                            createIpPoolsFromExistingInstitutionsData();
                        }
                    }); // end institution callback
                }
                else {
                    //At least 1 ip pool was found, meaning DB already has data.
                    console.log('Skipping update process as is not required. ' +
                        'Change the configuration variable accordingly in /config/_env/config');
                }
            }); //end ip pool callback
        }
        else {
            console.log('SKIPPING APP UPDATE > If app update is required you can change this in /config/_env_config');
        }
    }
}

function createIpPoolsFromExistingInstitutionsData() {
    Institution.find(function(err, institutionList){
        if(err){
            console.log('error querying institutions');
            console.log(err);
        }
        //console.log(institutionList);
        for(var inst in institutionList){
            var wan = institutionList[inst].wan.split('/');
            var lan = institutionList[inst].lan;
            var newWAN = new IpPool({
                ip: wan[0],
                mask: wan[1],
                available: false
            });

            newWAN.save(function(err, pool){
                if(err){
                    console.log('error creating wan ip pool');
                    console.log(err);
                }
                console.log('Created pool ' + pool.ip);
            });

            if (lan !== '' && lan !== undefined) {
                lan = institutionList[inst].lan.split('/');
                var newLAN = new IpPool({
                    ip: lan[0],
                    mask: lan[1],
                    available: false
                });

                newLAN.save(function(err, pool){
                    if(err){
                        console.log('error creating lan ip pool');
                        console.log(err);
                    }
                    console.log('Created pool ' + pool.ip);
                });
            }
        } //endfor

    });
}