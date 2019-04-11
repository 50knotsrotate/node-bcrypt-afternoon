const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req, res) => { 
        const { username, password, isAdmin } = req.body
        const db = req.app.get('db')
        const existingUser = await db.get_user()
        if (existingUser) {
            res.status(409).send('Username is taken')
        } else { 
            const salt = bcrypt.genSalt(12)
            const hash = bcrypt.hash(password, salt)
            
            const registeredUser = await db.register_user([isAdmin, username, hash])
            const user = registeredUser[0]

            req.session.user = {
                isAdmin: user.isAdmin,
                id: user.id, 
                username: user.username
            }
            return res.status(201).send(req.session.user)
          
        }
    }
}