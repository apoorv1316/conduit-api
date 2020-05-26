var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    tagName: {
        type: String,
        required: true,
        unique: true,
    },
    article: {
        type: [Schema.Types.ObjectId],
        ref:"Article",
        required: true,
    },

}, {timestamps:true});


var Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;