var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Tag = require("../models/tag");
var auth = require("../middlewares/auth");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// user info-> authorization header needs to be added in postman to get the token, in which userid is available in payload section 

router.get("/api/user", auth.verifyToken, async (req, res, next)=>{
  try {
    var user = await User.findById(req.user.userId);
    res.json({ user: {
      email: user.email,
      token: req.user.token,
      username: user.username,
      bio: user.bio,
      image: user.image,
    }
    })
  } catch (error) {
    next(error);
  }
})

// update user

router.put("/api/user", auth.verifyToken, async (req, res, next)=>{
  try {
    var updatedUser = req.body.user;
    console.log(updatedUser, req.user);    
    var user = await User.findByIdAndUpdate(req.user.userId,  updatedUser , { new: true, useFindAndModify: false});
    console.log(user);
    res.status(201).json({
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
      token: req.user.token,
    })
  } catch (error) {
    next(error);
  }
});

// User profile display - without authentication, so no verifyToken middleware

router.get("/api/profiles/:username", async (req, res, next)=> {
  var user = await User.findOne({username: req.params.username});
  console.log(user);
  res.json({
    profile: {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: false,
    }
  })
  
  // res.json(user)
})

// Follow User

router.post("/api/profiles/:username/follow", auth.verifyToken , async (req, res,next)=>{
try {
  var userToFollow = await User.findOne({username: req.params.username});
  var user = await User.findById(req.user.userId)
  if(userToFollow.id === user.id) {
    res.json({
      sucess: false,
      error: "you cannot follow yourself",
    })
  } else {
    if(!user.following.includes(userToFollow._id)){
      var user = await User.findByIdAndUpdate(req.user.userId,  {$push:{following: userToFollow.id}} , { new: true, useFindAndModify: false});
      var userToFollow = await User.findOneAndUpdate({username: req.params.username},  {$push:{follower: user.id}} , { new: true, useFindAndModify: false});
      res.json({
        profile: {
          username: user.username,
          bio: user.bio,
          image: user.image,
          following: true,
        }
      })
    } else {
      res.json({
        sucess: false,
        error: "already following",
      })
    }
   
  } 
} catch (error) {
  next(error)
}
});

// Unfollow

router.delete("/api/profiles/:username/follow", auth.verifyToken , async (req, res,next)=>{
  try {
    var userToFollow = await User.findOne({username: req.params.username});
    var user = await User.findById(req.user.userId)
    if(userToFollow.id === user.id) {
      res.json({
        sucess: false,
        error: "you cannot unfollow yourself",
      })
    } else {
      if(user.following.includes(userToFollow._id)){
        var user = await User.findByIdAndUpdate(req.user.userId,  {$pull:{following: userToFollow.id}} , { new: true, useFindAndModify: false});
        var userToFollow = await User.findOneAndUpdate({username: req.params.username},  {$pull:{follower: user.id}} , { new: true, useFindAndModify: false});
        res.json({
          profile: {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: true,
          }
        })
      } else {
        res.json({
          sucess: false,
          error: "you need to follow to unfollow",
        })
      }
     
    } 
  } catch (error) {
    next(error)
  }
});

////////////////// Tag ////////////////////

// Get list of atgs
router.get("/api/tags", async (req, res,next)=>{
  console.log(req._parsedUrl);
  
  var tags = await Tag.find({},{ tagName: 1 });
  res.status(200).json({
    tags
  })
})


module.exports = router;
