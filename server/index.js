require('dotenv').config()
const express = require('express');
const app = express()
const massive = require('massive')
const session = require('express-session')
const { PORT, CONNECTION_STRING, SESSION_SECRET } = process.env
const authController = require('./controllers/authController')
const treasureController = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware')

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
app.get('/api/treasure/dragon', treasureController.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureController.getUserTreasure)

app.listen(PORT || 4000, () => { 
    console.log(`Server has strted on port ${PORT}`)
})

