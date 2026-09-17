const express = require("express")
const router=express.Router()
const authMiddleware=require("../Middleware/authMiddleware")
const getProfile=require("../Controllers/user.controller")
router.get("/profile",authMiddleware,getProfile)
module.exports = router