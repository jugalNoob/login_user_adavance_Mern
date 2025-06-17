const express = require('express');
const signup=require("../controller/SignUp")
const Login=require("../controller/login_user")
const forget_User=require("../controller/Forget_User")
const user_auth=require("../controller/AuthUser.js")
const authenticate =require('../middleware/authenticate.js')


const router = express.Router();

router.post('/v1/signup', signup.signUP)

router.post('/v1/login', Login.loginUser)

router.patch('/v1/forget', forget_User.forgetUser)

router.get('/GetUser', authenticate,  user_auth.auth);

// router.post('/v1/South', SouthData.SouthData)

module.exports = router;
