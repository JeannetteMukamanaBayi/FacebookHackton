/**
 * Author D.Bernard
 */

"use strict"
var mongoSchemas = require("../middleware/schemas.js");
var Promise = require('es6-promise').Promise
var messageSchema = mongoSchemas.Message

class Message {
    constructor(author, target, content, messageType, postedAt) {
        this.content = content;
        this.author = author;
        this.messageType = messageType;
        this.target = target;
        this.postedAt = postedAt;
    }

    getAuthor() {
        return this.author;
    }

    getTarget() {
        return this.target;
    }

    getContent() {
        return this.content;
    }

    getMessageType() {
        return this.messageType;
    }

    getPostTime() {
        return this.postedAt;
    }

    toString() {
        return `${this.author}, ${this.target}, ${this.content}, ${this.messageType}, ${this.postedAt}`;
    }


    /**
     * 
     * @param {*} callback 
     */
    save() {

        var message = this

        return new Promise(function(resolve, reject) {

            var theMessageSchema = new messageSchema(message)

            theMessageSchema.save(function(err, result) {
                if (err) reject(err)
                resolve(result)
            });
        })
    }
}

module.exports = Message


/**
 * Get the 10 recent messages
 * @param {*} theAuthor
 * @param {*} theTarget
 * @returns JSON containing the details of each of the 10 recent messages
 * @return error otherwise
 */

module.exports.getLatestMessages = async function getLatestMessages(theAuthor, theTarget) {

    return new Promise(function(resolve, reject) {
        if (theTarget == 'public') {
            messageSchema.find({ "target": "public" }).sort({ postedAt: -1, postedAt:1}).limit(10).exec(function(err, result) {
                if (err) reject(err)
                resolve(result)
            })
        } else {
            messageSchema.find({ $or: [{ "target": theTarget, "author": theAuthor }, { "target": theAuthor, "author": theTarget }] })
                .sort({ postedAt: -1, postedAt}).limit(10).exec(function(err, result) {
                    if (err) reject(err)
                    resolve(result)
                })
        }
    })

}

module.exports.searchInPublicMessages = async function searchInPublicMessages(keyword) {
    return new Promise(function(resolve, reject) {
        messageSchema.find({ target: "public", "content": { $regex: ".*" + keyword + ".*" } }).sort({ postedAt: -1 }).exec(function(err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
}

module.exports.searchInPrivateMessages = async function searchInPrivateMessages(keyword, username) {
    return new Promise(function(resolve, reject) {
        messageSchema.find({ $or: [{ "author": username }, { "target": username }], "content": { $regex: ".*" + keyword + ".*" } }).sort({ postedAt: -1 }).exec(function(err, result) {
            if (err) reject(err)

            console.log("Private search:" + result);
            resolve(result)
        })
    })
}