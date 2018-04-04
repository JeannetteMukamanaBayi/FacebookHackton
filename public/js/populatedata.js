$(document).ready(function () {


    /* To trigger both public and private messages*/

    $("#chatprivately").click(function () {
        window.location.href = "/chatprivately";
    });


    $("#chatpublicly").click(function () {
        window.location.href = "/chatpublicly";
    });

});





function init() {
    $('#usernameSpan').html(localStorage.username);
    $('#coordinator').html(localStorage.username);

}

function populatedata(username) {
    window.localStorage.clear();
    localStorage.username = username;
}

function populateuserdata(userList) {
    localStorage.setItem("users", JSON.stringify(userList));
}

/*This function loads reloads the chat privately page
and helps load the private messages on the UI
*/


function getChatPrivate(j) {
    var listUsers = JSON.parse(localStorage.getItem('users'));
    for (var i = 0; i < listUsers.length; i++) {
        if (i == j) {
            localStorage.target = listUsers[i].username;
            localStorage.status = listUsers[i].onlineStatus;
            $('#authorPrivate').html(localStorage.username);
            $('#targetPrivate').html(localStorage.target);
            populatemessages();
        }
    }
}



/**
 *return latest announcements from API and load them into interface
 */
function loadAnnouncements() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: '/announcements',
        success: function (announcementsObjectJSON) {
            var resultsdiv = document.getElementById("loadAnnouncements");
            
            if (announcementsObjectJSON != null) {
                var status = announcementsObjectJSON['AuthorStatusCode'];
                announcementsObjectJSON['announcementData'].forEach(element => {
                    var theAnnouncement = element['AnnouncementObject']
                    resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + theAnnouncement['author'] + '">Author:   ' + theAnnouncement['author'] + " " + theAnnouncement['postedAt'] + " " +  '</span></strong><br/><span class="label label-success"> Subject  :  ' + theAnnouncement['title'] + '</span><br/><span class="label label-primary"> Message :' + theAnnouncement['content'] + ' </span></p>';
                });
            }
        },
        error: function (error) { }
    });
}



/**
 *return latest messages for 
 */

function populatemessages() {
    var context = localStorage.context;
    var data = {};
    data.author = localStorage.username;
    data.context = localStorage.context;
    data.target = localStorage.target;
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        data: data,
        url: '/messages/',
        success: function (results) {
            console.log("Feedback for private chat:" + JSON.stringify(results));

            if (results != null) {
                results['messageAndStatusCode'].forEach(element => {
                    var status = results['AuthorStatusCode'];
                    var message = element['MessageObject'];
                    latestPrivateMessages.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + message['author'] + '">Author:   ' + message['author'] + " " + message['postedAt'] + " " + '</span></strong><br/><span class="label label-primary"> Message :' + message['content'] + ' </span></p>';

s                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/**
 *return latest messages for 
 */

function populatePublicMessages() {
    var context = localStorage.context;
    var data = {};
    data.author = 'any';
    data.context = 'public';
    data.target = 'public';

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        data: data,
        url: '/messages/',
        success: function (results) {
            var index = 0;
            console.log("Feedback:" + results);
            var resultsdiv = document.getElementById("NewPublicMessages");
            if (results != null) {
                results['messageAndStatusCode'].forEach(element => {
                    var message = element['MessageObject'];
                    resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + message['author'] + '">Author:   ' + message['author'] + " " + message['postedAt'] + " " + element.AuthorStatusCode[index].statusCode + '</span></strong><br/><span class="label label-primary"> Message :' + message['content'] + ' </span></p>';
                    console.log("message", message.author, message.content, message.postedAt);
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/*Display search information
/*returns search paramenters
/* based on passed keyword*/

function Onsearch() {

    var data = {};
    $('#results').show();
    $('.container').hide();
    $('.jumbotron').hide();

    var status = document.getElementById('status');
    var username = document.getElementById('username')
    var searchTerm = $('#searchTerm').val();
    var public_messages = document.getElementById('public_messages');
    var private_messages = document.getElementById('private_messages');
    var announcements = document.getElementById('announcements');
    var resultsdiv = document.getElementById('results');


    if (username.checked == true || status.checked == true || private_messages.checked == true || public_messages.checked == true || announcements.checked == true) {
        data.keyWordType = $("input[type='radio'][name='check']:checked").val();
        data.target = localStorage.username;
        data.username = localStorage.username;
        data.keyWord = searchTerm;

        if (data.keyWordType == 'public') {
            data.context = 'messages';

        } else if (data.keyWordType == 'private') {
            data.context = 'messages';
            data.target = localStorage.username;
        } else if (data.keyWordType == 'announcements') {
            data.context = 'announcement';
        } else {
            if (data.keyWordType == 'status') { data.keyWord = searchTerm.toUpperCase(); }
            data.context = 'citizens';

        }

        localStorage.searchContext = data.context;
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            data: data,
            url: '/information/',
            success: function (MessageObject) {
                var index = 0;
                var resultsdiv = document.getElementById("results");

                if (MessageObject == '') {

                    alert("There is result matching your search for " + data.context + " about " + data.keyWord)
                    resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span>No result found</span><br/></p>';

                } else {

                    if (MessageObject['messageAndStatusCode'] == '') {
                        alert("There is result matching your search for " + data.context + " about " + data.keyWord)

                    } else {

                        if (localStorage.searchContext == 'messages') {
                            resultsdiv.innerHTML == "";
                            MessageObject['messageAndStatusCode'].forEach(element => {
                                console.log(element.AuthorStatusCode[index].statusCode)
                                console.log(element.MessageObject.content)
                                resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + ['author'] + '">Author:   ' + element.MessageObject.author + " " + element.AuthorStatusCode[index].statusCode + '</span></strong><br/><span class="label label-success"> Messages :  ' + element.MessageObject.content + '</span><br/></p>';
                            });
                        } else if (localStorage.searchContext == 'announcement') {
                            resultsdiv.innerHTML == "";
                            MessageObject['announcementData'].forEach(element => {
                                resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + ['author'] + '">Author:   ' + element.AnnouncementObject.author + "<br/> Title:" + element.AnnouncementObject.title + '</span></strong><br/><span class="label label-success"> Messages :  ' + element.AnnouncementObject.content + ' ' + element.AnnouncementObject.postedAt + '</span><br/></p>';
                            });

                        } else {

                            resultsdiv.innerHTML == "";
                            for (var i = 0; i < MessageObject.length; i++) {

                                resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + ['author'] + '">Author:   ' + MessageObject[i].username + " " + MessageObject[i].lastStatusCode + '</span></strong><br/><span class="label label-success"> Messages :  ' + MessageObject[i].onlineStatus + '</span><br/></p>';
                            }
                        }
                    }

                }
            },
            error: function (error) {
                alert("error:" + error)
            }
        });
    } else {
        alert("Please select what section you want to search")
    }
}

/*function to update the status of emergency keyword */

function updateEmergencyKeyWord() {
    
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/escalatehitwords',
        success: function (results) {
            alert('route hit')
           
        },
        error: function (error) { }
    });
}

/*This function is to be called on page load
Handling more than one funct
*/

function initData() {
}