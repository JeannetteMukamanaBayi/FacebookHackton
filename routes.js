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
var sha1 = require('sha1');



/*this is the default */
router.get('/', function(req,res){

    res.render('pages/index')

});

router.post('/code/', jsonParser, function(req, res) {
    var code = sha1(req.body.code)

    console.log("req.body", req.body.code);
    console.log(code)

    SecurityController.saveCode(req.body.code, req.body.productId,  (err, result) => {
        console.log("Hitting the route", result);
        if (err) {
            console.log("error:" + err);
            res.status(400).json(2);

        } else {
            res.status(200).json(1);
        }
    });
    
});


/*get the url API to receive the token id  and check the code*/


router.post( '/proof/:code', urlencoded, function(req,res){
    var code = req.params.code 
    var code =  '5ac54e813322d327d86452ff'

});

module.exports = router;