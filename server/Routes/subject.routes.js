const express=require('express')
const authMiddleware = require('../Middleware/authMiddleware')
const router=express.Router()
const {getsubjects,createsubject,updatesubject,deletesubject} = require("../Controllers/subject.controller")
router.use(authMiddleware)

router.get('/',getsubjects)
router.post('/',createsubject)
router.patch('/:id',updatesubject)
router.delete('/:id',deletesubject)

module.exports=router