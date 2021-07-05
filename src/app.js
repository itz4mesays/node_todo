require('dotenv').config()

const express = require('express')

const app= express()
const server= require('http').createServer(app)
const bodyParser= require('body-parser')
const jwt = require('jsonwebtoken')
const helmet = require('helmet')

app.use(helmet());

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const webRoute = require('./app/routes/web')
const userRoute = require('./app/routes/user.route')
const todoRoute = require('./app/routes/todo.route')

app.use('/v1/',webRoute)
app.use('/v1/', userRoute)
app.use('/v1/', todoRoute)

app.get('*', (req, res) => {
    res.status(404).json({ message: 'We are unable to handle your request at the moment.' });
})

server.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`Todo API server is running on ${process.env.PORT || 5000}`)
})