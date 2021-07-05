require('dotenv').config()
const db = require('../models')
const User = db.rest.models.user
const AccessToken = db.rest.models.accesstoken
const bcrypt = require('bcrypt')
const jsonData = require('../../data/data.json')
const jwt = require('jsonwebtoken')
const { decodedToken }= require('../../helpers/utils')
let role = jsonData.roles


module.exports = {
    create: async (req, res) => {

        //Get Role
        role = role.filter( (result) => {
            return result.slug == "user"
        })

        const salt = await bcrypt.genSalt()
        const password = await bcrypt.hash(req.body.password, salt)

        User.create({
            username: req.body.username,
            password: password,
            email: req.body.email,
            role: role[0].slug
        })
        .then(user=> {
            return res.status(201).json({
                error: false,
                code: 201,
                message: 'Your account has been created and verified. Please proceed to log in'
            })
        })
        .catch(err => {
            let errors = err.errors
            const extractedErrors = []
            errors.forEach(element => {
                let stripTableName = element.message.split('.')[1]
                extractedErrors.push(stripTableName)
            });

            res.status(500).json({ error: true, code: 500, message: extractedErrors })
        })
    },
    login: async (req, res) => {
        User.findOne({ where: { username: req.body.username }, attributes: ['id','password', 'email']})
        .then(result => {
            if(!result) return res.status(401).json({error: true, code: 401, message: "We are unable to verify your identity"})

            bcrypt.compare(req.body.password, result.password, (err, response) => {
                if (err || response === false) return res.status(401).json({ error: true, code: 401, message: "You have provided an incorrect username or password" })
                
                const token = jwt.sign({ user: result.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
                const refreshToken = jwt.sign({ user: result.id }, process.env.ACCESS_REFRESH_TOKEN)
                
                let data = {}
                data.user_id = result.id
                data.access_token = token
                data.refresh_token = refreshToken

                AccessToken.findOne({ where: { user_id: result.id } })
                    .then(d => {
                        if (d) {
                            let updateValues = { access_token: token, refresh_token: refreshToken }

                            AccessToken.update(updateValues, {
                                where: { user_id: result.id }
                            }).then(upd => {
                                return res.status(200).header('authorization-token', token).json({ error: false, code: 200, message: { accessToken: token, refreshToken: refreshToken } })
                            }).catch(er => {
                                return res.status(400).json({ error: true, code: 400, message: 'We could not process this request. Please try again' })
                            })
                        } else {

                            //Insert into AccessToken table
                            const tokenData = {
                                user_id: result.id,
                                access_token: token,
                                refresh_token: refreshToken
                            }

                            AccessToken.create(tokenData).then(result => {
                                return res.status(200).header('authorization-token', token).json({ error: false, code: 200, message: { accessToken: token, refreshToken: refreshToken } })
                            }).catch(err => {
                                // console.log(err)
                                return res.status(400).json({
                                    error: true,
                                    code: 400,
                                    message: 'We are unable to complete this request at the moment. Please try again'
                                })
                            })
                        }
                    }).catch(err => {
                        return res.status(400).json({
                            error: true,
                            code: 400,
                            message: 'We are unable to complete this request at the moment. Please try again'
                        })
                    })

            })
        })
        .catch(error => {
            res.status(500).json({ error: true, code: 500, message: error });
        })
    },
    change_password: async (req, res) => {
        let userId = {}
        jwt.verify(req.header('authorization-token'), process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) return res.status(400).json({ error: true, code: 400, message: 'Invalid or no authorization token provided.' })
            userId = decoded.user
        });

        if (req.body.current_password == req.body.new_password || req.body.current_password == req.body.confirm_password){
            return res.status(400).json({ error: true, code: 400, message: 'You cannot update with same password. Try a new password' })
        }

        //Update New Password
        const salt = await bcrypt.genSalt()
        const newPassword = await bcrypt.hash(req.body.new_password, salt)

        User.findOne({ where: {id: userId }, attributes: ['id', 'password']})
            .then(r => {
                
                let updateValues = { password: newPassword }

                User.update(updateValues, {
                    where: { id: r.id }
                }).then(upd => {
                    return res.status(200).json({ error: false, code: 200, message: 'Password has been updated successfully' })
                }).catch(er => {
                    return res.status(400).json({ error: true, code: 400, message: 'We could not process this request. Please try again' })
                })
            })
            .catch(err => {
                return res.status(500).json({
                    error: true,
                    code: 500,
                    message: 'We are unable to complete this request at the moment. Please try again'
                })
            })
    }
        
}