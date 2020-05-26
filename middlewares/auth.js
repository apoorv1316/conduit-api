var jwt = require("jsonwebtoken");

exports.generateJWT = async (user)=> {
    try {
        var token = await jwt.sign({ userId: user.id }, "thisissecret");
        return token;
    } catch (error) {
        return error;
    }
};

exports.verifyToken = async (req, res, next) =>{
    var token = req.headers.authorization || "";
    try {
        if(token) {
            var payload = await jwt.verify(token, "thisissecret");
            var user = {
                userId: payload.userId,
                token: token,
            }
            req.user = user;
            next();
        }else{
            res.status(401).json({
                sucess: false,
                error: "Unauthenticated"
            })
        }
    } catch (error) {
        next(error);
    }
    
}