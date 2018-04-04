
var data = {};

$(document).ready(function() {

    $('#btnUpdatestatus').click(function(e) {
        var status_okey = document.getElementById('statusOkey').checked;
        var status_help = document.getElementById('statusHelp').checked;
        var status_Danger = document.getElementById('statusDanger').checked;

        if (status_okey == false && status_Danger == false && status_help == false) {

            alert("Please you have to choose to select on option");
            return false;

        } else {

            data.status = $("input[type='radio'][name='group100']:checked").val();
            data.username = localStorage.username;
            alert("Selected value:" + data.status + "  username:" + data.username + "   status:" + data.status);
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/users/username/statuscode',
            success: function(data) {
                console.log('success');
            },
            error: function(error) {
                console.log(error);
            }
        });

    });



});