const express = require('express')
const app = express()

const mongoose = require('mongoose')
const route = require('./route/router')
const port = process.env.PORT || 3000
const dbUrl = 'mongodb+srv://pattamu:bqPvauaKLfc6SIBP@cluster0.eqx53.mongodb.net/reunion-db'

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect(dbUrl, {useNewUrlParser: true})
.then(() => console.log('mongoose is connected'))
.catch(err => console.log(err.message))

app.use('/api',route)

app.listen(port, () =>{
    console.log(`Express app ruuning on PORT: ${port}`)
})