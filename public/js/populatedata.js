
var code = '';
var productId = $("#productId").val();


/* return hash string*/



/* generate random strin */

var randomString = function (length) {
    var possible = "0123456789";

    for (var i = 0; i < length; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }


    return code;

}


/**
*return latest announcements from API 
*/
function storeCode() {
   
    var code = randomString(5);
    var data = {};
    data.code = code;
    data.productId = productId;
    alert("Your verification is "+ code)


    $.ajax({
        data: JSON.stringify(data),
        type: 'POST',
        contentType: 'application/json',
        url: '/code/',
        success: function (results) {
        },
        error: function (error) { }
    });
}





