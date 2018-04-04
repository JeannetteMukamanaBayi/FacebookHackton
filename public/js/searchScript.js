var searchData = {};

function onSearch() {

    var status_ci = document.getElementById('citizens').checked;
    var status_pum = document.getElementById('public_messages').checked;
    var status_prim = document.getElementById('private_messages').checked;
    var status_anno = document.getElementById('announcements').checked;

    if (status_ci == false && status_pum == false && status_prim == false && status_prim == false) {

        alert("Please you have to choose to select on option please");
        return false;
    } else {

        searchParams.username = localStorage.username;
        searchParams.context = $("input[type='radio'][name='check']:checked").val();
        searchParams.keyWordType = eq.body.keyWordType;
        searchParams.keyWord = eq.body.KeyWord;
        data.status =

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
}