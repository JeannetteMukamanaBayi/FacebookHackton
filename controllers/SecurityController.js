"use strict"

var Code = require('../models/Code.js');
const dateformat = require("node.date-time");
const thisApp = require('../app.js');
var theSocketController

/**
 * Variables to be used throughout the execution of this function
 */

module.exports.saveCode = async function saveCode(code , productId, callback) {
    console.log("in controller")
var code  =  new Code (code, productId);
    code.saveCode(function (error , result ){
        callback(error, result);

    })

    ;
   
}


