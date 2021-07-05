require('dotenv').config()

const TodoController = require('../controllers/TodoController')
const router = require('express').Router()
const { verifyToken, decodedToken, isAdmin }= require('../../helpers/utils')
const { createPostValidation, validate } = require('../../helpers/formValidator')


router.post('/todo/create', createPostValidation(), validate, verifyToken, decodedToken, TodoController.create)
router.get('/todo/get-single/:id', verifyToken, decodedToken, TodoController.getSingle)
router.get('/todo/get-all', verifyToken, decodedToken, TodoController.getAll)
router.put('/todo/update/:id', verifyToken, createPostValidation(), validate, decodedToken, TodoController.update)
router.delete('/todo/delete/:id', verifyToken, decodedToken, TodoController.delete)
router.get('/todo/fetch-todos', verifyToken, decodedToken, isAdmin, TodoController.fetchAll)

module.exports = router