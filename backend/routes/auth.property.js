const express=require('express');
const router=express.Router()
const propertyController=require('../controllers/property.controller')

// Upload Property
router.post('/uploadProperty',propertyController.uplodProperty)

// Get All properties
router.get('/getProperties',propertyController.getAllProperties)
module.exports=router