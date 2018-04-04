
var Hashes = require('jshashes')
var code = '';
var productId = $("#productId").val();



/* generate random strin */

var randomString = function(length) {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < length; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

        return new Hashes.SHA1().b64(code);
   
}



  /**
 *return latest announcements from API 
 */
function storeCode() {
    var data = {};
    data.code =  randomString(4);
    data.productId = productId;

    $.ajax({
        data: CharacterData,
        type: 'POST',
        contentType: 'application/json',
        url: '/code',
        success: function (results) {
         alert(randomString)
         
        },
        error: function (error) { }
    });
}
/*This function is to be called on page load
Handling more than one funct
*/

 


