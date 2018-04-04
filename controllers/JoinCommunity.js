var _this = this;


/*
               
                *Authors
                1. Gilbert N. Adding Join Communty related logic/methods
                *Main Purpose:This file is to hold all use cases logic directly from the routes 
*/

/*
              Required files/libraries
              1. schemas.js:Containing collection/tables definition for for all use cases
              2. user.js:
              3. body-paser:
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
                            Method name:registerNewUser
                            Purpose:
                            Parameters:
                            Return:
*/

exports.registerNewUser = async function registerNewUser(newUserDataSet, callback) {
    
    var timeStamp = moment().format();
    var newUser = new userModel(newUserDataSet.username, newUserDataSet.password, timeStamp, timeStamp, "OK", "ACTIVE", "NO", "Y", "");
    var datetime = new Date()
    crumbData = {
        username: newUserDataSet.username,
        statusCode: "GREEN",
        createdAt: datetime
    };

    newUser.registerNewUser(function(err, result) {

        if (err) {
            console.log("Fail to insert new user:");
            callback(err, result);
        } else {
            _this.addScrumb(crumbData, function(err, feedback) {
                console.log(err);
            });
            console.log("Inserting new user:" + result);
            callback(err, result);

        }

    });
}


/*
                            Method name:getUserList
                            Purpose:
                            Parameters:
                            Return:
				
 */


exports.getUserList = async function getUserList(callback) {
    console.log("Join Controller: Get list of users");
    var userObject = new userModel();
    userObject.getUserList(function(err, result) {
        console.log("**Join controller: Getting userlist:");
        callback(err, result);

    });
}

/*
                           Method name:getUserList 
                           Purpose:
                           Parameters:
                           Return:
       */

exports.getUserList = async function getUserList(callback) {
    console.log("Join Controller: Get list of users");
    var userObject = new userModel();
    userObject.getUserList(function(err, result) {
        console.log("**Join controller: Getting userlist:");
        callback(err, result);
    });
}


/*
                            Method name:isUserRegistered 
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


/**
                            Method name:userLogin
                            Purpose:
                            Parameters:
                            Return:
 */
exports.userLogin = async function userLogin(username, password, choice, callback) {
    var user = new userModel();

    user.userLogin(username, password, function(logs) {

        if (logs.exist) {
            logs.exist = true;
            logs.username = username;
            console.log();
            logs.message = "The user exists";
            console.log(logs.message);
            _this.updateOnlineStatusForLogin(username, function(err, numAffected) {
                console.log("User going online:" + numAffected);
                callback(logs);
            });

        } else {
            if (choice == "confirm") {
                var user = {};
                user.username = username;
                user.password = password;
                console.log("Select username:" + username + "  Password:" + password);
                _this.registerNewUser(user, function(err, result) {
                    if (err) {
                        logs.err = err;
                        logs.code = 401;
                        logs.message = "The User failed to be added";
                        console.log(logs.message);
                        callback(logs);
                    } else {
                        logs.created = true;
                        logs.code = 201;
                        logs.username = username;
                        logs.message = "The user created succesfully";
                        console.log(logs.message);
                        _this.updateOnlineStatusForLogin(username, function(err, numAffected) {
                            console.log("User going online:" + numAffected);
                            callback(logs);
                        });

                    }
                });

            } else {
                logs.cancel = true;
                logs.message = "The user cancelling the registration";
                callback(logs);
            }

        }


    });
}


/*
                            Method name:getUserSortedList
                            Purpose:
                            Parameters:
                            Return:
 
 */
exports.getUserSortedList = async function getUserSortedList(callback) {
    var user = new userModel();
    user.getUserSortedList(function(err, docs) {
        callback(err, docs);

    });
}

/*
                            Method name:updateOnlineStatusForLogin
                            Purpose:
                            Parameters:
                            Return:
  
 */
exports.updateOnlineStatusForLogin = async function updateOnlineStatusForLogin(username, callback) {
    var user = new userModel();
    user.updateOnlineStatusForLogin(username, function(err, numAffected) {
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