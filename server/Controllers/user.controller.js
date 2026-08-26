const getProfile=(req,res)=>{
    res.json({
        message:"Profile accessed",
        userId:req.user
    })
}

module.exports=getProfile