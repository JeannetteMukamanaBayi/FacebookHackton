"use strict"
var _this = this;

var mongoSchemas = require("../middleware/schemas.js");
var DB_Controller = require("../controllers/DB_Controller.js");


var Promise = require('es6-promise').Promise
var userSchema = mongoSchemas.User;



class Code {

    /*
           Class constructor: to initialize all user attribute for each crated on object

    */
    constructor(code, productId) {
        this.code = code;
        this.productId = productId;
    }

    getCode() {
        return this.code
    }


    getproductId() {
        return this.productId
    }

   

    toString() {
        return `${this.code}, ${this.productId}`;
    }

    

    saveCode(callback) {
        console.log("hitting the model", this);
        
        DB_Controller.saveCode(this, function(err, result) {

            callback(err, result)
        });
    }


    proofCode(code, callback) {
        console.log("hitting the model", code);
        DB_Controller.proofCode(code, function(err, result) {
              callback(err, result)
        });
    }
}

module.exports = Code