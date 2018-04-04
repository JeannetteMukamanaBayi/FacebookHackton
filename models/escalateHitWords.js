"use strict"
var _this = this;

var mongoSchemas = require("../middleware/schemas.js");

var Promise = require('es6-promise').Promise
var emergencyHitWordSchema = mongoSchemas.escalateEmergencyKeywords;


/*
               

                *Authors:
                1. Micheal N:

*/



const DB_Controller = require('../controllers/DB_Controller.js');


/*
           Class definition:
           1. Name: USer
           2. Attribute:
           3. Operations:



*/

class User {

    /*
           Class constructor: to initialize all user attribute for each crated on object

    */
    constructor(author, hitword, message, postedAt) {

       this.author = author;
       this.hitword = hitword;
       this.message = message;
       this.postedAt = postedAt;
    }


    /*
    
             Getters and setters  definition for each class attribute:
    
    
    
    */



    getAuthor(author) {
        return this.author
    }

    getHitword(hitword) {
        return this.hitword=hitword;
    }

    getMessage() {
        return this.message;
    }

    getPostedAt(postedAt) {
        return this.postedAt = postedAt;
    }

    setAuthor() {
        return this.author;
    }

    setHitword(hitword) {
        return this.hitword = hitword;
    }

    setMessage() {
        return this.message;
    }

    setPostedAt() {
        return this.postedAt = this.postedAt;
    }



    toString() {
        return `${this.author}, ${this.hitword}, ${this.postedAt}, ${this.hitword}, ${this.message}`
}



    /*
           Method:getUserSortedList
           Purpose: 
           Parameter:
           Return:
 
   */
    getUserSortedList(callback) {

        DB_Controller.getUserSortedList(function(err, docs) {
            callback(err, docs);

        });
    }


    /*
           Method: updateOnlineStatusForLogin
           Purpose: 
           Parameter:
           Return:
 
   */

    updateOnlineStatusForLogin(username, callback) {

        DB_Controller.updateOnlineStatusForLogin(username, function(err, numAffected) {
            callback(err, numAffected);

        });
    }

    /*
              Method:updateLastStatusCode
              Purpose: 
              Parameter:
              Return:
    
      */
    updateLastStatusCode(userId, code, callback) {

            DB_Controller.updateLastStatusCode(this, function(err, numAffected) {

                callback(err, numAffected);
            });
        }
        /*
                  Method:registerNewUser
                  Purpose: 
                  Parameter:
                  Return:
    
          */

    registerNewUser(callback) {

        DB_Controller.registerNewUser(this, function(err, result) {

            callback(err, result)
        });
    }

    /*
              Method:  verifyUserOnline
              Purpose: 
              Parameter:
              Return:
    
    */
    verifyUserOnline(username, callback) {
            DB_Controller.verifyUserOnline(username, function(err, result) {

                callback(err, result);
            });
        }
        /*
                  
                  Method: AssignUserSocketId
                  Purpose: 
                  Parameter:
                  Return:
    
          */
    AssignUserSocketId(username, socketId, callback) {

            DB_Controller.AssignUserSocketId(username, socketId, function(err, numAffected) {

                callback(err, numAffected);
            });
        }
        /*
                  Method:updateOnlineStatusForLogout
                  Purpose: 
                  Parameter:
                  Return:
        */

    updateOnlineStatusForLogout(username, callback) {
        DB_Controller.updateOnlineStatusForLogout(username, function(err, numAffected) {
            callback(err, numAffected);

        });
    }

    /*
              Method: updateOnlineStatusForLogoutbySocketID
              Purpose: 
              Parameter:
              Return:
    
    */
    updateOnlineStatusForLogoutbySocketID(socketid, callback) {
        DB_Controller.updateOnlineStatusForLogoutbySocketID(socketid, function(err, numAffected) {

            callback(err, numAffected);
        });
    }


        /*
                  Method:updateOnlineStatusForEmergency
                  Purpose: 
                  Parameter:
                  Return:
        */

       updateOnlineStatusForEmergency(username, callback) { DB_Controller.updateOnlineStatusForEmergency(username, function(err, numAffected) {
        callback(err, numAffected);

    });
}

    /*
              Method:
              Purpose: 
              Parameter:
              Return:
    
      */


    /** Get the the socket ID given the user name
     *  @param {} user * 
     * @returns the socket Id 
     * * @return callback with socket ID 
     * @return callback with error in case something went wrong
     */
    getUserSocketId(callback) {
        console.log("Getting the socket ID in model", this);
        DB_Controller.getUserSocketId(this, function(err, result) {
            callback(err, result);
        });

    }


}


module.exports = User
module.exports.updateUserStatusCode = async function updateUserStatusCode(theUsername, theStatusCode) {

    return new Promise(function(resolve, reject) {

        userSchema.updateOne({ "username": theUsername }, { $set: { "lastStatusCode": theStatusCode } }).exec(function(err, numAffected) {
            if (err) reject(err)
            resolve(numAffected)
        });
    })
}




/** Getting users by criteria
 *  @param  * 
 * @returns 
 * * @return 
 * 
 */
module.exports.getUsersByCriteria = async function getUsersByCriteria(theKeywordType, theKeyword) {
    console.log("Getting to search user or status:" + theKeywordType);
    if (theKeywordType == 'username') {

        return new Promise(function(resolve, reject) {

            userSchema.find({ "username": { $regex: ".*" + theKeyword + ".*" } }).sort({ onlineStatus: -1, username: 1 }).exec(function(err, result) {
                if (err) reject(err)
                resolve(result)
            })
        })

    } else if (theKeywordType == 'status') {
        return new Promise(function(resolve, reject) {

            userSchema.find({ "lastStatusCode": theKeyword }).sort({ onlineStatus: -1, username: 1 }).exec(function(err, result) {
                if (err) reject(err)
                console.log("From the model by status:" + result);
                resolve(result)
            })
        })
    } else {
        console.log('invalid key type word ');

    }

}


