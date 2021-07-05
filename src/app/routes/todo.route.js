require('dotenv').config()

const TodoController = require('../controllers/TodoController')
const router = require('express').Router()
const { verifyToken, decodedToken }= require('../../helpers/utils')

router.post('/todo/create', verifyToken, TodoController.create)
router.get('/todo/get-single/:id', verifyToken, decodedToken, TodoController.getSingle)
router.get('/todo/get-all', verifyToken, decodedToken, TodoController.getAll)
router.put('/todo/update/:id', verifyToken, TodoController.update)
router.delete('/todo/delete/:id', verifyToken, TodoController.delete)

module.exports = router