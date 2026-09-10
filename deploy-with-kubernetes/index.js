const express = require('express')
const app = express()
const os = require('os') 

const PORT = 3010

const host =  os.hostname()

app.get('/',(req,res)=>{res.json({message:"Welcome : "+host+" to app-1 "})})

app.listen(PORT, ()=>{ console.log('Welcome to app-1') })