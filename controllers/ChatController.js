"use strict"

var Message = require('../models/Message.js');
var User = require('../models/User.js');
var StatusCrumb = require('../models/StatusCrumb.js')
const dateformat = require("node.date-time");
const SocketController = require('../controllers/SocketController');
const thisApp = require('../app.js');
var theSocketController

/**
 * Variables to be used throughout the execution of this function
 */
var messagesDataJSON

var theMessage

module.exports.postMessage = async function postMessage(author, target, content, callback) {
    var messageType

    if (target === "public") {
        messageType = "WALL"
    } else {
        messageType = "CHAT"
    }

    var datetime = new Date()
    var theMessage = new Message(author, target, content, messageType, datetime)

    theMessage.save().then(async function(feedback) {

            /**
             * Send the message i.e. broadcasted or sent to a particular user
             */
            var sentStatus = await sendMessage(theMessage)

            callback(false, feedback)
        })
        .catch((err) => {
            callback(err, "")
        })
}

/**
 * Send a Message object to its target
 * @param {*} theMessage 
 * @param {*} callback 
 */
async function sendMessage(msg) {

    /**
     * Send the message along with the health status of the sender and the target (if not public)
     * Get the status of the sender by querying the status code of the sender and the target (if not public)
     * Provide the name of the sender and the target (if not public) and the datetime this message was posted
     */

    appendStatusCodeToMessage(msg).then(function(messageDataJSON) {

        if (msg.getTarget() == "public") // broadcast this message
        {

            theSocketController = new SocketController(thisApp.socketio);

            theSocketController.Broadcast("NewPublicMessage", messageDataJSON);

        } else {


        }
    }).catch((err) => {
        console.log(err)

    })
}


module.exports.getLatestMessagesAndStatusCode = async function getLatestMessagesAndStatusCode(author, target, callback) {

    messagesDataJSON = { messageAndStatusCode: [] }
        /**
         * Get the recent messages
         */
    await Message.getLatestMessages(author, target).then(async function(theMessagesData) {


        for (var messageData of theMessagesData) {
            theMessage = new Message(messageData.author, messageData.target, messageData.content,
                messageData.messageType, messageData.postedAt)

            await appendStatusCodeToMessage(theMessage).then(function(messageDataJSON) {

                messagesDataJSON.messageAndStatusCode.push(messageDataJSON)

            }).catch((err) => {
                console.log(err)
                callback(true, err)
            })
        }


        callback(false, messagesDataJSON)

    }).catch((err) => {

        callback(true, err)
    })

}



/**
 * Append the status code of the both message author and target into a json object
 * @param {*} messageData 
 * @returns messageDataJSON containing the messageData and the status code of both the author and the target (if not pulic)
 */
async function appendStatusCodeToMessage(msg) {

    var processedMessagesData
    var status = {};

    var author_status_code = await StatusCrumb.getLatestStatusCode(msg.getAuthor(), msg.getPostTime());
    if (msg.getTarget() == "public") {
        processedMessagesData = {
            "MessageObject": msg,
            "AuthorStatusCode": author_status_code
        }

    } else {
        var target_status_code = await StatusCrumb.getLatestStatusCode(msg.getTarget(), msg.getPostTime())
        processedMessagesData = {
            "MessageObject": msg,
            "AuthorStatusCode": author_status_code,
            "TargetStatusCode": target_status_code
        }
    }

    return processedMessagesData
}




/**
 * Get the list of public messages where the specified keyword appear
 * @param {*} keyword 
 * @param {*} callback
 * @returns the list of messages in JSON  
 */
module.exports.getSearchesInPublicMessages = async function getSearchesInPublicMessages(keyword, callback) {

    messagesDataJSON = { messageAndStatusCode: [] }

    await Message.searchInPublicMessages(keyword).then(async function(publicMessageSearchResults) {

        for (var publicMessageResult of publicMessageSearchResults) {
            theMessage = new Message(publicMessageResult.author, publicMessageResult.target,
                publicMessageResult.content, publicMessageResult.messageType, publicMessageResult.postedAt)

            await appendStatusCodeToMessage(theMessage).then(function(messageDataJSON) {

                messagesDataJSON.messageAndStatusCode.push(messageDataJSON)

            }).catch((err) => {

                console.log(err)
                callback(true, err)

            })

        }

        callback(false, messagesDataJSON)

    }).catch((err) => {
        console.log(err)
        callback(true, err)
    })
}




/**
 * Get the list of messages in which the specified keyword(s) appear into and
 * where the specified username is either the author or theTarget of the message
 * @param {*} keyword 
 * @param {*} username 
 * @param {*} callback
 * @returns the list of messages in JSON 
 */
module.exports.getSearchesInPrivateMessages = async function getSearchesInPrivateMessages(keyword, username, callback) {

    messagesDataJSON = { messageAndStatusCode: [] }
    console.log("searching private messages ..................................");

    await Message.searchInPrivateMessages(keyword, username).then(async function(privateMessageSearchResults) {

        for (var privateMessageResult of privateMessageSearchResults) {
            theMessage = new Message(privateMessageResult.author, privateMessageResult.target,
                privateMessageResult.content, privateMessageResult.messageType, privateMessageResult.postedAt)

            await appendStatusCodeToMessage(theMessage).then(function(messageDataJSON) {

                messagesDataJSON.messageAndStatusCode.push(messageDataJSON)
                
            }).catch((err) => {

                console.log(err)
                callback(true, err)

            })
        }
        callback(false, messagesDataJSON)

    }).catch((err) => {

        console.log(err)
        callback(true, err)
    })
}