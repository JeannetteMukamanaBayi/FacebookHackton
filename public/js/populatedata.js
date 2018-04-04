
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


var hash = function (code){
    return new Hashes.SHA1().b64(code);

}
/**
*return latest announcements from API 
*/
function storeCode() {
    alert(randomString(5))
    var data = {};
    data.code = randomString(4);
    data.productId = productId;

    //

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





