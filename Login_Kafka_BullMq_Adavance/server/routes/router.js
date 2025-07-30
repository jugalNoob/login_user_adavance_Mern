const express = require('express');
const signup=require("../controller/SignUp")
const Login=require("../controller/login_user")
const forget_User=require("../controller/Forget_User")
const user_auth=require("../controller/AuthUser.js")
const authenticate =require('../middleware/authenticate.js')

const { validateSignup }=require("../middleware/validateSignup.js")

const githubController = require('../controller/githubAuthController.js');


const router = express.Router();

router.post('/v1/signup',  validateSignup, signup.signUP)

router.post('/v1/login', Login.loginUser)

router.patch('/v1/forget/:id/:email', forget_User.forgetUser)

router.get('/GetUser', authenticate,  user_auth.auth);

// router.post('/v1/South', SouthData.SouthData)




// GitHub OAuth Routes ------------------------------------------------>>>>

router.get('/auth/github', githubController.authWithGitHub);
router.get('/auth/github/callback', githubController.authGitHubCallback);

// Auth Status
router.get('/login/success', githubController.loginSuccess);
router.get('/login/failed', githubController.loginFailed);

// Logout
router.get('/logout', githubController.logoutUser);

module.exports = router;
