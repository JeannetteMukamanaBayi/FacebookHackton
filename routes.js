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
var data = {};



/**
 * This is the default route of the app
 *
 */
router.get('/', function(req, res) {
        res.render('pages/index');
    });

/**
 * This is the join commmunity route
 *
 */
router.get('/join', function(req, res) {
    res.render('pages/join');
});

/**
 * This is the join confirmation route
 */
//define the confirmation route
router.get('/confirmation', function(req, res) {
    res.render('pages/confirmation');
});

/**
 * This is the home route
 */
//define the confirmation route
router.get('/home', function(req, res) {
    res.render('pages/home');
});


/*
 * posting a message, either public or private
 * @param {*} author
 *  @param {*} target
 * @param {*} content
 * @returns JSON  with 200 code status in case data have been successfully saved
 * @return JSON with 400 code if there has been a problem in accessing or reading from the db
 */
router.post('/messages/', jsonParser, function(req, res) {
    ChatController.postMessage(req.body.author, req.body.target, req.body.content, (err, result) => {
        if (err) {
            console.log("error:" + err);
            res.status(400).json(2);

        } else {
            res.status(200).json(1);
        }
    });
});

/**
 * This is the get route for sharing status
 *
 */
//define the confirmation route
router.get('/sharestatus', function(req, res) {
    res.render('pages/sharestatus');
});


/**
 * This is the get route for searchin information
 * This is API end point
 */
//define the confirmation route

router.get('/information/', function(req, res) {
    user = req.session;
    var searchParams = {};
    // searchParams.username = user.username;
    searchParams.username = req.query.username;
    searchParams.context = req.query.context;
    searchParams.keyWordType = req.query.keyWordType;
    searchParams.keyWord = req.query.keyWord;
    searchParams.target = req.query.target;
    console.log("searchParams", searchParams);

    InforSearchingController.searInformation(searchParams, function(err, result) {

        console.log("message here:");

        if (err) {
            console.log('Failure to search for:' + searchParams.context)
            res.status(404).json(0);
        } else {
            console.log('Forwarded to controller', result)
            res.json(result)

        }

    })

});


/**
 * This is the get route users
 * This is an API end point
 */

router.get('/users', function(req, res) {
    JoinCommunityController.getUserSortedList(function(err, docs) {
        if (err) {
            console.log("Error: retrieving List of users:" + err);

        } else {
            res.json(docs);
        }
    });

});

/**
 * This is the post  route users
 * This is an API end point
 */

router.post('/users', jsonParser, function(req, res) {
    user = req.session;

    if (req.body.choice == "join") {
        user.username = req.body.username;
        user.password = req.body.password;
        console.log("Username:" + user.username + "  password:" + user.password);
    }

    JoinCommunityController.userLogin(user.username, user.password, req.body.choice, function(logs) {
        user.username = req.body.username;
        user.password = req.body.password;
        console.log("Log in user:" + user.username);
        res.json(logs);
    });

});

/**
 * users/username/statuscode
 * This is the post  route user share status
 * This is an API end point
 */

router.post('/users/username/statuscode', jsonParser, function(req, res) {
    user = req.session;


    ShareStatus.updateUserStatusCode(req.body.username, req.body.status, function(err, feedback) {

        if (err) {

            console.log('Fail to update the status:' + err);
            res.status(400);

        } else {

            console.log('Last status updated successfully:' + feedback);
            res.status(200);
        }
    });

});

/**
 * This is the post  route users
 * This is an API end point
 */

router.get('/users/username/logout', jsonParser, function(req, res) {
    user = req.session;

    console.log("Hitting the server here:" + user.username);

    JoinCommunityController.updateOnlineStatusForLogout(user.username, function(err, numAffected) {
        if (err) {
            res.json("Error:" + numAffected.ok);

        } else {

            console.log("Log out user:" + user.username);
            req.session.destroy(function(err) {
                console.log("Killing session");
            });
            res.json(data);
        }

    });


});

/***
 * JSON page rendering with the data from the database
 */

router.get('/userdirectory', function(req, res) {
    res.render('pages/users');
});

/***
 * JSON page rendering with the data from the database
 */
router.get('/searchinfopage', function(req, res) {
    res.render('pages/searchinfo');
});


/***
 * JSON page rendering with the data from the database
 */
router.get('/chatprivately', function(req, res) {
    res.render('pages/chatprivately');
});

/***
 * JSON page rendering the chat publicly.
 */
router.get('/chatpublicly/', function(req, res) {
    res.render('pages/chatpublicly');
});


/******************************************************
 * 
 * MESSAGES API AND CONTROLLER CALLS
 * 
 ******************************************************/
/**
 * Getting latest Messages, either public or private   
 * @param {*} author 
 * * @param {*} target
 * @returns JSON  with 200 code status, and messages  in case request has been successfully processed
 * @return JSON with 400 code if there has been a problem in accessing or reading from the db
 */

router.get('/messages/', function(req, res, err) {
    /*getting messages */
    ChatController.getLatestMessagesAndStatusCode(req.query.author, req.query.target, function(err, messages) {
        if (err) {
            console.log("\n private messages not found" + err);
            res.status(400).json(err);
        } else {
            res.status(200).json(messages)



        }

    });
});

/******************************************************
 * 
 * ANNOUNCEMENT API AND CONTROLLER CALLS
 * 
 ******************************************************/

/***
 * JSON page rendering with the data from the database
 */
router.get('/announcementspage', function(req, res) {

    res.render('pages/announcements');
});


/**
 * Save and Broadcast the announcement
 */
router.post('/announcements', jsonParser, function(req, res) {

    var author = req.body.author;
    var title = req.body.title;
    var content = req.body.content;

    AnnouncementController.postAnnouncement(author, title, content, function(err, annoucementJSON) {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json('OK');
        }


    })

    // broadcast the announcement
    var data = JSON.stringify(req.body);

});


/**
 * Get the 10 latest  announcements from the db
 * @param {*} callback 
 * @returns a JSON containing the the 10 latests announcements otherwise,
 * @returns error occured during the operation
 */

router.get('/announcements', function(req, res) {

    AnnouncementController.getLatestAnnouncements(function(err, announcementsJSON) {
        if (err) {
            console.log("Error in get latest announcements")
            res.status(404)
        } else {
            announcementsJSON['announcementData'].forEach(element => {});
            res.json(announcementsJSON)
            console.log(announcementsJSON);
        }
    })
});



/***
 * JSON API call for sharestatus
 * The route updates the user status and broadcasts the message to every user
 * online
 */
router.post('/users/status/statuscode', function(req, res) {
    var data = JSON.stringify(req.body);
    res.json(req.body); //tell the server socket connection

});

/* Escalate keywords page  rendering*/

router.get('/escalate_hitwords', function(req, res) {
    res.render('pages/escalate_hitwords');
});

/*API for escalating keywords */
router.post('/escalatehitwords', function(req, res) {
    emergencyController.updateOnlineStatusForEmergency(function(err, announcements) {
        if (err) {
            console.log("Error  could not escalate message update status")
            res.status(404)
        } 
    })
});

/* Show list of messages*/

router.get('/escalated_emergencies', function(req, res) {
    res.render('pages/escalated_emergencies');
});


/* Show list statitics*/

router.get('/statistics', function(req, res) {
    res.render('pages/statistics');
});

/* render investigated message*/

router.get('/investigate_further', function(req, res) {
    res.render('pages/investigate_further');
});



module.exports = router;