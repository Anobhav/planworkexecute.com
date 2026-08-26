const cookieParser = require('cookie-parser')
const userRoutes = require("./routes/user.routes")
const express=require('express')
const app=express()
const errorMiddleware=require('./Middleware/errorMiddleware')
//routes
app.use(express.json())
app.use(cookieParser())
app.use("/api/users", userRoutes)
app.use(errorMiddleware)

module.exports=app