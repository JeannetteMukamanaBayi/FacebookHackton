var _this = this;


/*
               
                *Authors
                1. Gilbert N. Adding Join Communty related logic/methods
                *Main Purpose:This file is to hold all use cases logic directly from the routes 
*/



var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var userModel = require("../models/User.js");
var statusCrumb = require("../models/StatusCrumb.js")
let date = require('node-datetime');
var session = require('express-session');
var moment = require('moment');
const dateformat = require("node.date-time");





/*
                            Method name:isUser Emergency Status set to okay
                            Purpose:
                            Parameters:
                            Return:
 */

module.exports.isUserRegistered = async function isUserRegistered(userData, callback) {

    var user = new userModel();
    user.isUserExists(userData.username, function(err, result) {
        callback(err, result);
    });

}




/*
  Method name:updateOnlineStatusForLogin
Purpose:
Parameters:
 Return:
  
 */
module.exports.updateOnlineStatusForEmergency = async function  updateOnlineStatusForEmergency(theUsername, callback) {
    var escalateHitWord = new escalateHitWords();
escalateHitWord.updateOnlineStatusForEmergency(username, function(err, numAffected) {
        callback(err, numAffected);
    });
}

/*
                            Method name:verifyUserOnline
                            Purpose:
                            Parameters:
                            Return:
  
 */
exports.verifyUserOnline = async function verifyUserOnline(username, callback) {
    var user = new userModel();
    user.verifyUserOnline(username, function(err, result) {
        callback(err, result);
    });

}

/*
                            Method name:updateLastStatusCode
                            Purpose:
                            Parameters:
                            Return:
  
 */
exports.updateLastStatusCode = async function updateLastStatusCode(user, callback) {
    var user = new userModel();
    user.updateLastStatusCode(user.username, user.lastStatusCode, function(err, result) {
        callback(err, result);
    });
}

/*
                            Method name:updateOnlineStatusForLogout
                            Purpose:
                            Parameters:
                            Return:
  
 */

exports.updateOnlineStatusForLogout = async function updateOnlineStatusForLogout(username, callback) {

    var user = new userModel();
    user.updateOnlineStatusForLogout(username, function(err, numbAffected) {
        console.log("jC log:" + numbAffected.ok);
        callback(err, numbAffected);
    });

}


/*
                            Method name:updateOnlineStatusForLogoutbySocketID
                            Purpose:
                            Parameters:
                            Return:
  
 */

exports.updateOnlineStatusForLogoutbySocketID = async function updateOnlineStatusForLogoutbySocketID(socketid, callback) {
    var user = new userModel();
    user.updateOnlineStatusForLogoutbySocketID(socketid, function(err, numAffected) {
        callback(err, numAffected);
    });

}

/*
                            Method name:AssignUserSocketId
                            Purpose:
                            Parameters:
                            Return:
*/
exports.AssignUserSocketId = async function AssignUserSocketId(user, callback) {
    var user = new userModel();
    user.AssignUserSocketId(user.username, user.socketId, function(err, numAffected) {
        callback(err, numAffected);

    });
}


/*

                            Method name:Ending session
                            Purpose:
                            Parameters:
                            Return:
*/
exports.endSession = async function endSession(session) {
    session = session;
    session.destroy(function(err) {
        console.log("Killing session");
    });
}


exports.addScrumb = async function addScrumb(scrumbData, callback) {
    var datetime = new Date();
    var statusCrumb1 = new statusCrumb(scrumbData.username, scrumbData.statusCode, datetime);
    statusCrumb1.save().then(function(feedback) {

        callback(false, feedback)
        console.log("Record user scrumb data")

    }).catch(err => {

        console.log("ERROR WHILE SAVING STATUS CODE FOR : " + err);
        callback(true, err)
    })

}