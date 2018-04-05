"use strict"

var Code = require('../models/Code.js');
const dateformat = require("node.date-time");
const thisApp = require('../app.js');
var theSocketController



module.exports.saveCode = async function saveCode(code , productId, callback) {
    console.log("in controller")
var code  =  new Code (code, productId);
    code.saveCode(function (error , result ){
        callback(error, result);
    }); 
}


module.exports.proofCode = async function proofCode(thecode, callback) {
    console.log("prooving in controller")
    var code  =  new Code (thecode);
    code.proofCode( thecode, function (error , result ){
        callback(error, result);
    }); 
}
