//connect the socket
var host = location.origin.replace(/^http/, 'ws');
var socket = io.connect(host)
var currentDate = new Date().toLocaleString();

$(document).ready(function () {

    $("#postMessage").click(function () {
        sendPublicMessage();

    });

    $('#postPrivatetMessage').click(function () {
        sendPrivateMessage();
    });

    // adding broadcast messages when an annoucement is posted.
    $("#postAnnouncement").click(function () {
        sendAnnouncements();
    });


    //Listen to the emit data - public message
    socket.on('NewPublicMessage', function (publicMessage) {

        var data = publicMessage['MessageObject'];
        var status = publicMessage['AuthorStatusCode'];
        var resultsdiv = document.getElementById("NewPublicMessages");
        resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + message['author'] + '">Author:   ' + message['author'] + " " + message['postedAt'] + " "+ '">Status: ' + status + '</span></strong><br/><span class="label label-primary"> Message :' + message['content'] + ' </span></p>';
    });

    //Listen to the emit data - private message
    socket.on('NewPrivateMessage', function (data) {
        alert("You have a new private meesage from:" + data.author);
        var status = data['AuthorStatusCode'];
        latestPrivateMessages.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + data.author + '">Author:   ' + data.author + " " + data.postedAt + " " + '">Status: ' + status + '</span></strong><br/><span class="label label-primary"> Message :' + data.content + ' </span></p>';
    });

    //Listen to the emit data - Announcement
    socket.on('NewAnnouncement', function (Announcement) {
        var resultsdiv = document.getElementById("loadAnnouncements");
        var status = Announcement['AuthorStatusCode'];
        resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + theAnnouncement['author'] + '">Author:   ' + theAnnouncement['author'] + " " + theAnnouncement['postedAt'] + " " + '">Status: ' + status + '</span></strong><br/><span class="label label-success"> Subject  :  ' + theAnnouncement['title'] + '</span><br/><span class="label label-primary"> Message :' + theAnnouncement['content'] + ' </span></p>';
    });
});


function sendPublicMessage() {
    var message = document.getElementById('messageArea');
    var username = document.getElementById('username');
    var messageType = 'public';

    var data = {};
    data.content = message.value;
    data.author = localStorage.username;
    data.target = 'public';

    data.postedAt = currentDate;
    data.messageType = messageType;

    //make sure the message field is empty
    message.value = " ";

    $.post('/messages/', data, function (response) {

    }, 'JSON');

    // append message on the client side - public message
    var resultsdiv = document.getElementById("NewPublicMessages");
    resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + data.author + '">Author:   ' + data.author + " " + data.postedAt + '</span></strong><br/><span class="label label-primary"> Message :' + data.content + ' </span></p>';

}

function sendPrivateMessage() {
    let author = localStorage.username;
    let target = localStorage.target;
    let content = $('#messagePrivateArea').val();
    let messageType = "private";

    let data = {
        content: content,
        author: author,
        target: target,
        target: target,
        postedAt: currentDate,
        messageType: messageType
    };

    $.post('/messages/', data, function (response) {

    }, 'JSON');

    socket.emit('NewPrivateMessage', data);

    // append message on the client side - private message
    var resultsdiv = document.getElementById("latestPrivateMessages");
    latestPrivateMessages.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + data.author + '">Author:   ' + data.author + " " + data.postedAt + '</span></strong><br/><span class="label label-primary"> Message :' + data.content + ' </span></p>';
}

function sendAnnouncements() {

    var announcement = document.getElementById('announcementArea');
    var coordinator = document.getElementById('coordinator');
    var AnnouncementTitle = document.getElementById('AnnouncementTitle');
    var messageType = 'announcement';
    var postedAt = currentDate;

    //push the form elements into a data array to be passed on to the url
    var data = {};
    data.content = announcement.value;
    data.author = localStorage.username;
    data.title = AnnouncementTitle.value;
    data.messageType = messageType;

    if (announcement.value == " ") {
        alert("Please Enter Announcement")
    } else {
        //make sure the message field is empty after pressing send message
        announcement.value = " ";
        AnnouncementTitle.value = " ";

        $.post('/announcements', data, function (response) {

        }, 'JSON');

        // Append the public announcement messages 
        var resultsdiv = document.getElementById("loadAnnouncements");
        resultsdiv.innerHTML += '<p class="media-bodyannouncement pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span id="' + data.author + '">Author:   ' + data.author + " " + data.postedAt + '</span></strong><br/><span class="label label-success"> Subject  :  ' + data.title + '</span><br/><span class="label label-primary"> Message :' + data.content + ' </span></p>';

    }
}


$(".allUser").click(function () {
    var users = document.getElementsByClassName("allUser")
    for (var i = 0; i < users.length; i++) {
        users[i].addEventListener("click", function () {
            $(this).slideToggle();
        })
    }
});
