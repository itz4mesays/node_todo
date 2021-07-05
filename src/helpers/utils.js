require('dotenv').config()
const jwt = require('jsonwebtoken')
const db = require('../app/models')
const AccessToken = db.rest.models.accesstoken

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
    }
}