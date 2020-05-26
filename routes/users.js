var express = require('express');
var router = express.Router();
var User = require("../models/user");
var auth = require("../middlewares/auth");

/* GET users listing. */
// Register user
router.post("/", async (req, res, next)=>{
  try {
    var user = await User.create(req.body.user);
    var token = await auth.generateJWT(user);
    res.status(201).json({
      email: user.email,
      username: user.email,
      token,
      bio: user.bio,
    })
    console.log(user, token);
  } catch (error) {
    next(error);
  }
});


// Login User
router.post('/login', async function(req, res, next) {
  var { email,password } = req.body.user;
  if(!email || !password) 
    return res.status(400).json(
      {
        sucess: false,
        error: "email/password required",
      }
    )
  try {
      var user = await User.findOne({email})
      if(!user) 
        return res.status(400).json({sucess:false, error: "Email invalid"})
      if(!user.verifyPassword(password))
        return res.status(400).json({sucess:false, error: "Password invalid"})

      var token = await auth.generateJWT(user);
      res.status(200).json({
        email: user.email,
        username: user.username,
        token,
        bio: user.bio,
      })
    }
  catch (error) {
    next(error)
  }
});


module.exports = router;
