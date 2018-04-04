/**
 * Author D.Bernard
 */

"use strict"
var mongoSchemas = require("../middleware/schemas.js");
var Promise = require('es6-promise').Promise
var statusCrumbSchema = mongoSchemas.StatusCrumb

class StatusCrumb {
    constructor(username, statusCode, createdAt) {
        this.username = username
        this.statusCode = statusCode
        this.createdAt = createdAt
    }


    getUsername() {
        return this.username
    }

    getStatusCode() {
        return this.statusCode
    }

    getCreatedAt() {
        return this.createdAt
    }

    /**
     * return the object attributes in a string format
     */
    toString() {
        return `${this.username}, ${this.statusCode}, ${this.createdAt}`;
    }


    /**
     * Save the current statusCrumb in the db
     * @returns statusCrumbID
     * @returns -2, if something wrong happens when trying to read or access the db
     */

    save() {
        var statusCrumb = this
        return new Promise(function(resolve, reject) {
            var theStatusCrumbSchema = new statusCrumbSchema(statusCrumb);
            theStatusCrumbSchema.save(function(err, statuCodeCrumb) {
                if (err) reject(err)
                resolve(statuCodeCrumb)
            });

        })
    }

}

module.exports = StatusCrumb

/**
 * Get the user's latest status code closer to the specified datetime
 * @param {*} username 
 * @param {*} datetime 
 * @returns statusCode
 * @returns error otherwise
 */

module.exports.getLatestStatusCode = async function getLatestStatusCode(theUsername, theDatetime) {
    return new Promise(function(resolve, reject) {
        statusCrumbSchema.find({ "username": theUsername, "createdAt": { $lt: theDatetime } }, { statusCode: 1, _id: 0 })
            .limit(1).exec(function(err, result) {
                if (err) reject(err)
                resolve(result)
            })
    })
}