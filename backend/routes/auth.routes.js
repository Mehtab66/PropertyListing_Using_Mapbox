const express=require('express')
var router = express.Router();
const AuthController=require('../controllers/auth.controller')
//SignUp
router.post('/signup',AuthController.SignUp)

//Login
router.post('/login',AuthController.Login)
module.exports=router