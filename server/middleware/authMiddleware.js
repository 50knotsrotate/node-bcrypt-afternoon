module.exports = {
    usersOnly: (req, res, next) => { 
        req.session.user ? next() : res.status(401).send('Please log in to do that')
    },
    adminOnly: (req, res, next) => { 
        req.session.user.isAdmin ? next() : res.status(401).send('You must be an admin to do that')
    }
}