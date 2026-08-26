require('dotenv').config()
const app=require('./app')
const PORT=process.env.PORT_NUMBER || 5000
app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);
})