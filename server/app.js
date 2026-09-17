const cookieParser = require('cookie-parser')
const userRouter = require("./routes/user.routes")
const subjectRouter=require("./Routes/subject.routes")
const productivityRouter=require("./Routes/productivity.routes")
const express=require('express')
const app=express()
const errorMiddleware=require('./Middleware/errorMiddleware')
//routes
app.use(express.json())
app.use(cookieParser())
app.use("/api/users",userRouter)
app.use("/api/subjects",subjectRouter)
app.use("/api/productivity",productivityRouter)
app.use(errorMiddleware)

module.exports=app