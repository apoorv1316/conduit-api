var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require("slug");

var articleSchema = new Schema({
    slug: {
        type:String,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: { 
        type: String, 
        required: true,
    },
    body: {
        type: String,
        required: true, 
    },
    tagList: {
        type: [String],

    },
    favorited: {
        type: [Schema.Types.ObjectId],
        ref:"User",
    },
    favoritesCount: {
        type: Number,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
    }
}, {timestamps:true});

articleSchema.pre("save",  function(next){
    if(this.title && this.isModified("title")){
        this.slug = slug(this.title,{lower:true})
        next()
    }
    next()
})

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;