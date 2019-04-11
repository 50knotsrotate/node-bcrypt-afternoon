require('dotenv').config()
const express = require('express');
const app = express()
const massive = require('massive')
const session = require('express-session')
const { PORT, CONNECTION_STRING, SESSION_SECRET } = process.env
const authController = require('./controllers/authController')

app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

massive(CONNECTION_STRING)
    .then(db => { 
        app.set('db', db)
        console.log('db connected')
    })

app.post('/auth/register', authController.register)
app.post('/auth/login', authController.login)
app.get('/auth/logout', authController.logout)

app.listen(PORT || 4000, () => { 
    console.log(`Server has strted on port ${PORT}`)
})

