var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var Announcement = require("../models/Announcement.js");
const dateformat = require("node.date-time");
const SocketController = require('../controllers/SocketController');
const thisApp = require('../app.js');
var theSocketController = new SocketController(thisApp.socketio);


var announcementDataJSON
var theAnnouncement

/**
 * Creates and saves the Announcement Object in the database
 * @param {*} theAuthor 
 * @param {*} theTitle 
 * @param {*} theContent
 * @returns the JSON containing the saved announcement details otherwise
 * @returns error
 */
module.exports.postAnnouncement = async function postAnnouncement(theAuthor, theTitle, theContent, callback) {

    var timeStamp = new Date()
    theAnnouncement = new Announcement(theAuthor, theTitle, theContent, timeStamp);
    theAnnouncement.save().then(function(announcementDetails) {
        broadcastAnnouncement(theAnnouncement)
        callback(false, announcementDetails)
    }).catch((err) => {
        console.log("SAVING ANNOUNCEMENT ERROR : \n" + err)
        callback(true, err)
    });
}



/**
 * Get the 10 latest  announcements from the db
 * @param {*} callback 
 * @returns a JSON containing the the 10 latests announcements otherwise,
 * @returns error occured during the operation
 */
module.exports.getLatestAnnouncements = async function getLatestAnnouncements(callback) {

    announcementDataJSON = { announcementData: [] }

    Announcement.getLatestAnnouncements().then(function(announcements) {

        for (var announcement of announcements) {
            theAnnouncement = new Announcement(announcement.author, announcement.title,
                announcement.content, announcement.postedAt)

            announcementDataJSON.announcementData.push({
                "AnnouncementObject": theAnnouncement
            })
        }

        callback(false, announcementDataJSON)

    }).catch((err) => {

        console.log("ANNOUNCEMENTS RETRIEVAL ERROR : \n" + err)
        callback(true, err)
    })

}


/**
 * Get the announcements containing the specified keyword
 * @param {*} keyword
 * @returns list of announcements in JSON 
 * @returns error occured during the operation
 */

module.exports.getSearchesInAnnouncements = async function getSearchesInAnnouncements(keyword, callback) {

    announcementDataJSON = { announcementData: [] }

    await Announcement.searchInAnnouncements(keyword).then(function(announcementSearchResults) {

        for (var announcementResult of announcementSearchResults) {
            theAnnouncement = new Announcement(announcementResult.author, announcementResult.title,
                announcementResult.content, announcementResult.postedAt)

            announcementDataJSON.announcementData.push({
                "AnnouncementObject": theAnnouncement
            })
        }
        callback(false, announcementDataJSON)

    }).catch((err) => {

        callback(true, err)
    })
}

async function broadcastAnnouncement(theAnnouncement) {
    theSocketController = new SocketController(thisApp.socketio);

    theSocketController.Broadcast('NewAnnouncement', theAnnouncement);
}