/*
 Filename:homeScript
purpose: processing home page events

*/

/* 
When a document loads
*/
var data1 = {};
data1.username = "";
data1.password = "";
data1.confirmation = "";
data1.choice = "";

$(document).ready(function () {
    /*
          Method to handle join community event
    */
    $('#join_submit').click(function (e) {
        var validBoolean = validateInputs();
        console.log(validBoolean);

        if (validBoolean) {
            console.log("submit listening")
            var $password = $('#password');
            var $username = $('#userName');
            var converPass = $password.val();
            encryUsingBecrypt(converPass, function (result) {
                converPass = result;
            });
            console.log("encrypted password" + converPass);
            data1.username = $username.val();
            data1.password = converPass;
            data1.confirmation = -1;
            data1.choice = "join";
            console.log("Pas:" + data1.password + " User:" + data1.username);

            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                datatype: 'json',
                data: JSON.stringify(data1),
                url: '/users',
                success: function (data) {
                    console.log("success");
                    console.log(data);
                    if (data.code == 200) {
                        populatedata(data.username)
                        window.location.href = "/home";

                    } else if (data.code == 400) {
                        alert("The username or password is not correct");
                        window.location.href = "/join";
                    } else {
                        console.log(data.message);
                        window.location.href = "/confirmation";
                        populateUsernameConfirmationPage(data1.username);
                    }
                },
                error: function (error) {
                    console.log('Fail on join form' + error);
                }
            });

        };

    });

    /*
            Method to handle confirmation event 

    */
    $('#confirm').click(function (e) {
        console.log('Listening to # confirm!');
        console.log('Confirm clicked');
        var $userid = $('#username1');
        var $userchoice = $('#userchoice1');
        data1.username = $userid.val();
        data1.confirmation = 1;
        data1.choice = $userchoice.val();
        console.log("Pas:" + data1.password + " User:" + data1.username);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data1),
            contentType: 'application/json',
            url: '/users',
            success: function (response) {
               console.log('success');

                if (response.code == 401) {
                    alert(response.message);
                    window.location.href = "/join";

                }
                if (response.code == 201) {
                    console.log("Tracking here:" + response.username);
                    populatedata(response.username)
                    window.location.href = "/home";

                }


            },
            error: function (error) {
                console.log(error);
            }
        });

    });

    /*
    Method to handle cancellation  event 

    */

    $('#cancel').click(function (e) {
        console.log('Cancel clicked');
        var $userid2 = $('#username2');
        var $userchoice2 = $('#userchoice2');

        data1.username = $userid2.val();
        data1.confirmation = 1;
        data1.choice = $userchoice2.val();

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data1),
            contentType: 'application/json',
            url: '/users',
            success: function (response) {
                alert(response.message);
                console.log('success');
                window.location.href = "/join";
            },
            error: function (error) {
                console.log(error);
            }
        });

    });

}); 