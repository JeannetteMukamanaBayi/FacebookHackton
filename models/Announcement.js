

"use strict"

var mongoSchemas = require("../middleware/schemas.js");
var Promise = require('es6-promise').Promise
var announcementSchema = mongoSchemas.Announcement;


class Announcement {

    constructor(author, title, content, postedAt) {
        this.author = author
        this.title = title
        this.content = content
        this.postedAt = postedAt;
    }



    getAuthor() {
        return this.author;
    }

    getTitle() {
        return this.title;
    }

    getContent() {
        return this.content;
    }

    getPostedAt() {
        return this.postedAt;
    }


    toString() {
        return `${this.author}, ${this.title}, ${this.content}, ${this.postedAt}`;
    }


    /**
     * Saves the current announcement object in the db
     * @returns -2, if something wrong happened when trying to read or access from the db 
     */

    save() {
        var announcement = this
        return new Promise(function(resolve, reject) {
            var theAnnouncementSchema = new announcementSchema(announcement)
            theAnnouncementSchema.save(function(err, announcementDetails) {
                if (err) reject(err)
                resolve(announcementDetails)
            });
        });
    }
}


module.exports = Announcement;


/**
 * Get the 10 latest  announcements from the db
 * @param {*} callback 
 * @returns a JSON containing the the 10 latests announcements otherwise,
 * @returns error occured during the operation
 */
module.exports.getLatestAnnouncements = async function getLatestAnnouncements() {
    return new Promise(function(resolve, reject) {
        announcementSchema.find().sort({ postedAt: -1 }).limit(10).exec(function(err, announcementsDetails) {
            if (err) reject(err)
            resolve(announcementsDetails)
        })
    });
}


/**
 * Get the announcements containing the specified keyword
 * @param {*} keyword
 * @returns list of announcements in JSON 
 */
module.exports.searchInAnnouncements = async function searchInAnnouncements(keyword) {
    return new Promise(function(resolve, reject) {

        announcementSchema.find({ "content": { $regex: ".*" + keyword + ".*" } }).sort({ postedAt: -1 }).exec(function(err, result) {
            if (err) {
                
                reject(err)

            } else {
                
                resolve(result)

            }


        })
    })
}

