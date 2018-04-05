var mongoSchemas = require("../middleware/schemas.js");
var Promise = require('es6-promise').Promise
const dateformat = require("node.date-time");
var codeSchema = mongoSchemas.Code;

module.exports.saveCode = async function saveCode(code, callback) {
    console.log("code",code);
    
    var codeModel = new codeSchema(code);
    
    codeModel.save(function (err, result) {
        if (err) {
            console.log('Fail to insert new code....!' + err); 
            callback(err, result);
        } else {
            console.log('DB controller initiate the schemas to insert a new code....');
            callback(err, result);
        }
    });
    
}

module.exports.proofCode = async function proofCode(code, callback) {
    console.log("code in db itself",code);
      codeSchema.model('Code').findOne({code:code},function(err, code) {
            if (err) {
                callback(err, code);
            } else if (code) {
                callback(err, code);
            } else {
                callback(err, code);
            }
        });
}

