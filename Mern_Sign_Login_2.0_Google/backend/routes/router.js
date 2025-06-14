const express = require("express");
const router = new express.Router();
const controllers=require("../controollers/userControllers")
const authenticate =require('../middleware/authenticate.js')
const signupSchema =require("../validator/auth-valid.js")
const Validate = require("../validator/auth-middleware.js")

router.get("/home/jugal", controllers.first);
// router.post("/signin", Validate(signupSchema), controllers.form);
router.post("/signin", controllers.form);
router.post("/signup",controllers.login )
router.get('/Count', authenticate, controllers.auth);
router.patch("/forget",controllers.update )
router.get("/logout",controllers.logout)
 router.get("/Admin" , controllers.admin)
module.exports = router;