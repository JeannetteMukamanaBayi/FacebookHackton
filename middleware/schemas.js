/*
               

                *Authors
                1. Gilbert N. Creating mongodb schemas using mongoose interface

                *Main Purpose:This file is to contain the schema for all db documents/tables

*/
/*

      Defining required variables for mongo db connection:
    1. mongoose library is a dependancy that should be added via nmp
    2. Schema: will help to create schema

*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/*
        Database: MongoDb
        Query builder: Mongoose
        Setting up connection to mongodb 
        Local environment:download and install mongodb server from mongodb.com and assign (ip:localhost and port:20017):'mongodb://localhost:27017/fse'
        Remote environment:visit https://mlab.com and login using: username:gilbertn and password:5V1j20nnSu
        Setting up mongoose connection:mongoose.connect('mongodb://fseteamrw:fseproject@ds111059.mlab.com:11059/fse');
*/


/*             local set up mongoose: connection definition        

  */


mongoose.connect('mongodb://fseteamrw:fseproject@ds111059.mlab.com:11059/fse');


/*
                       Creating database schemas
                          1. message schemas
                          2. user
                          3.announcement
                          4. statuscrumb

*/

var userSchema = new Schema({

    username: { type: String, required: true },
    password: { type: String, required: true },
    lastStatusCode: String,
    accountStatus: String,
    approvalStatus: String,
    socketId: String,
    onlineStatus: String,
    lastLogin: Date,
    socketId: String,
    tLogin: Date,
    escalateEmergencyKeywordStatus: String
});


var messageSchema = new Schema({

    author: { type: String, required: true },
    target: { type: String, required: true },
    content: String,
    messageType: String,
    postedAt: Date

});


var announcementSchema = new Schema({

    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedAt: { type: Date, required: true }

});

var statuscrumbSchema = new Schema({

    username: { type: String, required: true },
    statusCode: { type: String, required: true },
    createdAt: Date
});

/*Table to store emergency keywords*/

var escalateEmergencyKeywords = new Schema({
    author: { type: String, required: true },
    hitword: { type: String, required: true },
    message: { type: String, required: true },
    postedAt: { type: Date, required: true }

});



/*Table to store responses*/

var investigateFurther = new Schema({
    author: { type: String, required: true },
    receiver: { type: String, required: true },
    details: { type: String, required: true },
    escalated_message: { type: String, required: true },
    content: { type: String, required: true },
    postedAt: { type: Date, required: true }
});



/*
       Defining and binding physical table to defined schema:

       1. User to userSchema 
       2. Message to messageSchema
       3. Announcement to announcementSchema
       4. Statuscrumb to statuscrumbSchema

       User,Message,Annoucncement, Statuscrumb 


*/



var users = mongoose.model('User', userSchema);
var messages = mongoose.model('Message', messageSchema);
var announcements = mongoose.model('Announcement', announcementSchema);
var statuscrumbs = mongoose.model('Statuscrumb', statuscrumbSchema);
var escalateEmergencyKeywords = mongoose.model('escalateEmergencyKeywords', escalateEmergencyKeywords);

/*
       Expose each created mongoose model based on defined schemas to be used when 
       this file"schemas" is imported

*/


/**
 * Defining the text indexes  and the weights on the columns
 */


var my_schemas = { 'User': users, 'Message': messages, 'Announcement': announcements, 'StatusCrumb': statuscrumbs, 'escalateEmergencyKeywords': escalateEmergencyKeywords };
module.exports = my_schemas;