
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://fseteamrw:fseproject@ds111059.mlab.com:11059/fse');




var codeSchema = new Schema({
    code: { type: String, required: true },
    productId: { type: String, required: true },
});


var codes = mongoose.model('Code', codeSchema);
var my_schemas = { 'Code': codes };
module.exports = my_schemas;