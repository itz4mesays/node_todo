require('dotenv').config()
const jwt = require('jsonwebtoken')
const db = require('../app/models')
const AccessToken = db.rest.models.accesstoken
const User = db.rest.models.user

module.exports = {
    verifyToken: (req, res, next) => {
        const auth_token = req.header('authorization-token')

        if (!auth_token) return res.status(401).send('You do not have the right privilege to this endpoint')

        AccessToken.findOne({ where: { access_token: auth_token } }).then(output => {
            if (output) {
                const available = jwt.verify(auth_token, process.env.ACCESS_TOKEN_SECRET)
                req.user = available
                next()
            } else {
                return res.status(400).json({ error: true, code: 400, message: 'No access token found or has expired.' })
            }

        }).catch(err => {
            return res.status(400).json({ error: true, code: 400, message: 'Invalid or no authorization token provided.' })
        })
    },
    decodedToken: (req, res, next) => {
        jwt.verify(req.header('authorization-token'), process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) return res.status(400).json({ error: true, code: 400, message: 'Invalid or no authorization token provided.' })
            
            res.locals.dToken = decoded.user
            next()
        });
    },
    isAdmin: (req, res, next) => {
        User.findOne({ where: 
            { id: res.locals.dToken }
        })
        .then(result => {
            if (result && result.role != 'user') {
                return next()
            } else {
                return res.status(400).json({ error: true, code: 400, message: 'You do not have the privilege to perform this action ' })
            }
        }).catch(err => {
            return res.status(400).json({ error: true, code: 400, message: err })
        })
    }
}