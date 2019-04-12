module.exports = {
    usersOnly: (req, res, next) => { 
        req.session.user ? next() : res.status(401).send('Please log in to do that')
    }
}