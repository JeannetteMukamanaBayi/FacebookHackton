var mongoSchemas = require("../middleware/schemas.js");
var Promise = require('es6-promise').Promise
const dateformat = require("node.date-time");
var codeSchema = mongoSchemas.Code;

module.exports.saveCode = async function saveCode(code, callback) {
    console.log("code",code);
    
    var codeModel = new codeSchema(code);
    
    codeModel.save(function (err, result) {
        if (err) {
            console.log('Fail to insert new code....!' + err); //
            callback(err, result);
        } else {
            console.log('DB controller initiate the schemas to insert a new code....');

            callback(err, result);
        }
    });
    
}

