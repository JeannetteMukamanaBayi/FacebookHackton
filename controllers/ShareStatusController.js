/**
 * Author D.Bernard
 */

"use strict"

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var StatusCrumb = require("../models/StatusCrumb");
var User = require("../models/User.js")
const dateformat = require("node.date-time");
const SocketController = require('../controllers/SocketController');
const thisApp = require('../app.js');
var theSocketController



/**
 * Update the statusCode of the user whose username is provided
 * @param {*} username 
 * @param {*} statusCode 
 * @param {*} callback
 * @returns 0, if the username does exist in the database
 * @returns -2, if inserting the status crumb in the db fails
 * @returns the inserted status crumb in the JSON object
 */
module.exports.updateUserStatusCode = async function updateUserStatusCode(theUsername, theStatusCode, callback) {

    /**
     * Update the status code of the given users
     * if everything went well, the number of rows affected should be 1
     * if the username does not exist in the database, the mumber of affected rows should be 0
     */

    User.updateUserStatusCode(theUsername, theStatusCode).then(function(NumAffected) {

        /**
         * Record this update in the history
         */
        var datetime = new Date()
        var theStatusCrumb = new StatusCrumb(theUsername, theStatusCode, datetime)
        var statusData = {};
        statusData.username = theUsername;
        statusData.status = theStatusCode;
        theStatusCrumb.save().then(function(feedback) {


            /**
             * Broadcast the current status code of every user in the base
             * Call the function which retrives all users in the db, sort them alphabetically
             * and according to their online presence status
             */

            
            var theSocketController = new SocketController(thisApp.socketio);
            theSocketController.Broadcast('status', statusData);
            callback(false, feedback)

        }).catch(err => {

            console.log("ERROR WHILE SAVING STATUS CODE FOR : " + theUsername)
            callback(true, err)
        })


        callback(false, NumAffected)

    }).catch(err => {
        console.log("ERROR WHILE UPDATING STATUS CODE FOR : " + theUsername)
        callback(true, err)
    })

}