import express from "express"
const dotenv = require("dotenv")
const mysql = require("mysql")

//connect to .env file
dotenv.config()

//connect to db
const DBconnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "mysql"
})
DBconnection.connect()

//declare express app (with express types for ts)
const app : express.Application = express();
//app port
const PORT = process.env.DB_PORT || 4000

// initial endpoint
app.get("/", (req:express.Request, res:express.Response)=>{
   console.log(req)
    res.send("hi")
})

app.listen(PORT, ()=>{
    console.log("console action")
})