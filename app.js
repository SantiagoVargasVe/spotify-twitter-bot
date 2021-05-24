var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
require('dotenv').config()
const spotifyRouter = require('./routes/spotify')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
if (typeof localStorage === 'undefined' || localStorage === null) {
  let LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage('./playground')
}
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/spotify', spotifyRouter)

module.exports = app
