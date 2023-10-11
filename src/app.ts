import express from "express"
const dotenv = require("dotenv")
const mysql = require("mysql")

//connect to .env file
dotenv.config()

//declare express app (with express types for ts)
const app : express.Application = express();

// initial endpoint
app.get("/", (req:express.Request)=>{
   console.log(req)
})

app.listen(4000, ()=>{
    console.log("console action")
})
