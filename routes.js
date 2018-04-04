/***the main routes of the ens application***/
/*** the routes file uses express router ****/
/** routes.js - Wiki route module.***/
/**
 * Author : D.Bernard, Micheal, Gilbert, Jeannette, J.Ibare
 */

const thisApp = require('./app.js');
var express = require('express');
var app = express();
app.use(express.json());
app.set('view engine', 'ejs');
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var router = express.Router();
const http = require('http');
const session = require('express-session');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
const urlencoded = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
var SecurityController= require('./controllers/SecurityController.js');

router.post('/code/', jsonParser, function(req, res) {
    SecurityController.saveCode(req.body.code, req.body.productId,  (err, result) => {
        console.log("Hitting the route!!!!!!!!!!!!", result);
        if (err) {
            console.log("error:" + err);
            res.status(400).json(2);

        } else {


            res.status(200).json(1);
        }
    });
    
});





router.post('/users/username/statuscode', jsonParser, function(req, res) {
/*
    ShareStatus.updateUserStatusCode(req.body.username, req.body.status, function(err, feedback) {

        if (err) {

            console.log('Fail to update the status:' + err);
            res.status(400);

        } else {

            console.log('Last status updated successfully:' + feedback);
            res.status(200);
        }
    });
    */

});


module.exports = router;