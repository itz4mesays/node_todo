const { body, validationResult } = require('express-validator')
const bcrypt= require('bcrypt')
const db = require('../app/models')
const User = db.rest.models.user
const jwt = require('jsonwebtoken')

module.exports = {
    createUserValidation: () => {
        return [
            body('username')
                .not().isEmpty().trim().withMessage('Username field is required')
                .custom((value, {req}) => {
                    return User.findOne({ where: {username: req.body.username} })
                        .then(user => {
                            if(user) return Promise.reject('Username has already been taken. Try a different one')
                        })
                }),
            body('password')
                .not().isEmpty().trim().withMessage('Password Field is required')
                .isStrongPassword({
                    minLength: 6,
                    minSymbols: 1,
                    minUppercase: 1
                }).withMessage('Password is too weak. It must contain minimum of 6characters, a symbol and an uppercase letter'),
            body('email')
                .not().isEmpty().trim().withMessage('Email field is required')
                .isEmail().withMessage('Email address is not a valid one')
                .custom((value, { req }) => {
                    return User.findOne({ where: { email: req.body.email } }).then(user => {
                        if(user) return Promise.reject('Email address has already been taken. Try another one')
                    })
                })
        ]  
    },
    loginValidation: () => {
        return [
            body('username')
                .not().isEmpty().trim().withMessage('Username field must be provided'),
            body('password')
                .not().isEmpty().trim().withMessage('Password field must be provided')
        ]
    },
    changePasswordValidation: () => {
        return [
            body('current_password')
                .not().isEmpty().trim().withMessage('Current Password field must be provided'),
            body('new_password')
                .not().isEmpty().trim().withMessage('New Password field must be provided')
                .isStrongPassword({
                    minLength: 6,
                    minSymbols: 1,
                    minUppercase: 1
                }).withMessage('Password is too weak. It must contain minimum of 6characters, a symbol and an uppercase letter'),
            body('confirm_password')
                .not().isEmpty().trim().withMessage('Confirm Password field must be provided')
                .custom( (value, { req}) => {
                    if (value !== req.body.new_password) throw new Error('Password confirmation does not match password')
                    return true                  
                })
        ]
    },
    createPostValidation: () => {
        return [
            body('todo_title')
                .not().isEmpty().trim().withMessage('Todo Title field is required'),
            body('todo_description')
                .not().isEmpty().trim().withMessage('Todo Description field is required'),
            body('todo_type')
                .not().isEmpty().trim().withMessage('Todo Type field is required'),
            body('todo_status')
                .not().isEmpty().trim().withMessage('Todo Status field is required'),
            body('start_date')
                .not().isEmpty().trim().withMessage('Start Date field is required')
                .isDate().withMessage('Start Date must be a valid date e.g YYYY-MM-DD'),
            body('end_date')
                .not().isEmpty().trim().withMessage('End Date field is required')
                .isDate().withMessage('End Date must be a valid date e.g YYYY-MM-DD'),
        ]
    },
    validate: (req, res, next) => {
        const errors = validationResult(req)
        // console.log(errors)
        if(errors.isEmpty()) return next()

        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({msg: err.msg}))
        res.status(400).json({
            error: true,
            code: 400,
            errors: extractedErrors
        })
    }
}