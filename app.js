const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

const PORT = process.env.PORT || 3000
const urlDB = process.env.DB_URI || 'mongodb://localhost:27017/test'

const routerTasks = require('./routes/tasks')
const routerTask = require('./routes/task')

mongoose.connect(urlDB)
mongoose.Promise = global.Promise

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'pug')

//* **** Authorization part *********
const authRouter = require('./routes/auth')

app.use(authRouter)

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) return next()
  console.log(req.isAuthenticated())
  res.redirect('/')
}
//* **********************************

app.use('/tasks', isLoggedIn, routerTasks)
app.use('/task', isLoggedIn, routerTask)

app.get('/', (req, res) => {
  const section = 'Home'
  res.render('home', {section})
})

app.listen(PORT, () =>
  console.log(`💼 Tasks Server running at PORT ${PORT}...`))
