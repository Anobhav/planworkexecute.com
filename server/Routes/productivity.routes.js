const express=require('express')
const authMiddleware=require('../Middleware/authMiddleware')
const {addProductivity,editProductivity,deleteProductivity,getDailyProductivity,getSubjectProductivity,getProductivityHistory}=require('../Controllers/productivity.controller')
const router=express.Router()

router.use(authMiddleware)
router.post('/addProductivity',addProductivity)
router.patch('/editProductivity',editProductivity)
router.delete('/deleteProductivity',deleteProductivity)
router.get('/getDailyProductivity',getDailyProductivity)
router.get('/getSubjectProductivity',getSubjectProductivity)
router.get('/getProductivityHistory',getProductivityHistory)

module.exports=router