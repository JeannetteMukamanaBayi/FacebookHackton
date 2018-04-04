var option;
var jsondata = {};
var username;
var socket;

/* 
  When a document loads

*/

$(document).ready(function() {

    /*
     Method to handle log out events
    */

    init();
    username = localStorage.username;
    login_logout_Status_observer();

    $('#logout').click(function(e) {
        jsondata.username = username;
        jsondata.password = "";
        
        $.ajax({
            type: 'GET',
            data: JSON.stringify(jsondata),
            contentType: 'application/json',
            url: '/users/username/logout',
            success: function(response) {
                // For example, filter the response
                console.log('success');
                login_logout_Status_observer();
                localStorage.removeItem('username');
                window.location.href = "/join";
            }
        });
    });


    /*
    Method to handle listing directory 
    */
    $('#userdirectory').click(function(e) {
        userDirectoryList_Handler();
    }); //END OF DOCUMENT

    /*
    Method to handle listing directory 
    */

    $('#btnDirectory').click(function(e) {
        userDirectoryList_Handler();
    }); //END OF DOCUMENT

});



/*
 **Method to be called when listing user directory
 ** this call also updates the local copy on local storage
 */
function userDirectoryList_Handler() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: '/users',
        success: function(response) {
            var listUsers = response;
            populateuserdata(response);
            var results = document.getElementById("userlist");
            var lastStatusCode = "";
            if (results != null) {
                for (var i = 0; i < listUsers.length; i++) {

                    results.innerHTML += '<p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray"> <strong class="d-block text-gray-dark class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray" ><img src="../images/user-holder.png" class="mr-2 rounded"><span onclick="javascript:getChatPrivate(' + i + ');" id="' + listUsers[i].username + '"> ' + listUsers[i].username + '</span> <span class="label label-success" style="color:#blue">' + listUsers[i].onlineStatus + ' </span><span class="label label-primary">' + listUsers[i].lastStatusCode + ' </span></strong></p>';
                }
            }
        }
    });
}
/*
log out event handler
*/

function login_logout_Status_observer() {

    var listUsers = JSON.parse(localStorage.getItem('users'));
    if (listUsers != null) {
        socket.on('logout', function(response) {

            for (var i = 0; i < listUsers.length; i++) {
                console.log("user from ls" + listUsers[i].username + " user from response:" + response);
                if (listUsers[i].username == response) {
                    console.log(listUsers[i].username);
                    listUsers[i].onlineStatus = "N";
                    console.log("Notification of out going users:updated status:" + listUsers[i].onlineStatus);
                    populateuserdata(listUsers);
                }
            }

        });

        socket.on('login', function(response) {

            console.log(response);
            for (var i = 0; i < listUsers.length; i++) {
                if (listUsers[i].username == response) {
                    listUsers[i].onlineStatus = "Y";
                    console.log("Notification of incoming users: updated user:" + listUsers[i].onlineStatus);
                    populateuserdata(listUsers);

                }
            }
        });

        socket.on('status', function(response) {
            console.log("Notification of health status change");
            alert("Notification:" + response.username + " has jsut changed his health status to" + response.status + " at" + new Date());
            for (var i = 0; i < listUsers.length; i++) {
                if (listUsers[i].username == response.username) {
                    listUsers[i].lastStatusCode = response.status;
                    populateuserdata(listUsers);
                    userDirectoryList_Handler();
                }
            }
        });


    }


}

/*
Populate users
*/

function updateUserList() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: '/users',
        success: function(response) {
            var listUsers = response;
            var docs = listUsers;
            console.log("Size:" + response.length);
            console.log("docx:" + docs.length);
            console.log("");
            populateuserdata(response);
            window.location.href = "/chatprivately";
        }
    });

}