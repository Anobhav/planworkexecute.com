require('dotenv').config()
const express=require('express')

const app=express()
const PORT=process.env.PORT_NUMBER || 5000
app.listen(PORT,()=>{
    console.log(`app active at http://localhost:${PORT}`);
})

