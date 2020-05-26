var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt")


var userSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /@/
    },
    password: { 
        type: String, 
        required: true,
    },
    bio: {
        type: String, 
    },
    image: {
        type: String, 
    },
    following: {
        type: [String],
    },
    follower: {
        type: [String],
    }
}, {timestamps:true});

userSchema.pre("save", async function(next) {
    try {
        if(this.password &&  this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error)
    }
});

userSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

var User = mongoose.model("User", userSchema);

module.exports = User;