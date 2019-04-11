const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req, res) => { 
        const { username, password, isAdmin } = req.body
        const db = req.app.get('db')
        const result = await db.get_user(username);
        const existingUser = result[0]
        if (existingUser) {
            res.status(409).send('Username is taken')
        } else { 
            
            const salt = bcrypt.genSaltSync(12)
            const hash = bcrypt.hashSync(password, salt)
            const registeredUser = await db.register_user([isAdmin, username, hash]);
            console.log(registeredUser)
            const user = registeredUser[0]

            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id, 
                username: user.username
            }
            return res.status(201).send(req.session.user)
          
        }
    },
    login: async (req, res) => { 
        const { username, password } = req.body;
        const db = req.app.get('db');
        const foundUser = await db.get_user(username);
        const user = foundUser[0];

        if (!user) {
            res.status(401).send('Oops! Looks like you gotta make an account bruh!')
        } else { 
            const isAuthenticated = bcrypt.compareSync(password, user.hash)   
            if (!isAuthenticated) {
                res.status(401).send('Wrong password. Try again.')
            } else { 
                req.session.user = {
                         isAdmin: user.is_admin,
                         id: user.id,
                         username: user.username
                }
                res.status(200).send(req.session.user)
            }
        }

    },
    logout: (req, res) => { 
        req.session.destroy()
        res.sendStatus(200)
    }
}