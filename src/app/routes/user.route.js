require('dotenv').config()

const UserController = require('../controllers/UserController')
const router = require('express').Router()
const { createUserValidation, loginValidation, changePasswordValidation, validate } = require('../../helpers/formValidator')

router.post('/user/create', createUserValidation(), validate, UserController.create)
router.post('/user/login', loginValidation(), validate, UserController.login)
router.post('/user/change-password', changePasswordValidation(), validate,  UserController.change_password)

module.exports = router