require('dotenv').config()
const db = require('../models')
const User = db.rest.models.user
const Todo = db.rest.models.todo_list
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize"); //using operator
const jsonData = require('../../data/data.json')


module.exports = {
    create: async (req, res) => {
        let userId = await res.locals.dToken

        // Find if the array contains an object by comparing the property value
        let filterD = jsonData.todo_status.some(s => s.status === req.body.todo_status)
        let filterT = jsonData.todo_type.some(t => t.type === req.body.todo_type)
 
        if (filterD == false || filterT == false) return res.status(422).json({ error: true, code: 422, message: 'The status or type you provided does not exist' })

        Todo.create({
            user_id: userId,
            todo_title: req.body.todo_title,
            todo_description: req.body.todo_description,
            todo_type: req.body.todo_type,
            todo_status: req.body.todo_status,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        })
        .then(result => {
            return res.status(201).json({
                error: false,
                code: 201,
                message: 'New Todo list has been created'
            })
        }).catch(err => {
            let errors = err.errors
            const extractedErrors = []
            errors.forEach(element => {
                let stripTableName = element.message.split('.')[1]
                extractedErrors.push(stripTableName)
            });

            res.status(500).json({ error: true, code: 500, message: extractedErrors })
        })
        
    },
    getSingle: async (req, res) => {
        let userId = await res.locals.dToken
        let todoId = req.params.id

        if(!todoId) return res.status(422).json({ error: true, code: 422, message: 'Missing id parameter'})

        Todo.findOne({
            [Op.and]: [
                { user_id: userId },
                { id: todoId }]
        })
        .then(result => {
            if (!result) return res.status(404).json({ error: true, code: 404, message: 'There are no such record or this todo does not belong to this user' })

            let todoObj = {
                id: result.id,
                todo_title: result.todo_title,
                todo_description: result.todo_description,
                todo_type: result.todo_type,
                todo_status: result.todo_status,
                start_date: result.start_date,
                end_date: result.end_date
            }

            return res.status(200).json({ message: { error: false, code: 200, message: todoObj } })


        })        
        .catch(err => {
            return res.status(500).json({ error: true, code: 500, message: 'We are unable to complete this request at the moment. Please try again' })
        })
    },
    getAll: async (req, res) => {
        //Get All Todo List belong to a specific user
        let userId = await res.locals.dToken
        Todo.findAll({ 
            where: { user_id: userId },
            order: [['id', 'DESC']]
        })
        .then(result => {
            if (result.length < 1) return res.status(404).json({ error: true, code: 404, message: 'There are no posts at the moment. Go ahead and create new post' })

            const todoArray = []
            result.map(obj => {
                todoArray.push({
                    id: obj.id,
                    todo_title: obj.todo_title,
                    todo_description: obj.todo_description,
                    todo_type: obj.todo_type,
                    todo_status: obj.todo_status,
                    start_date: obj.start_date,
                    end_date: obj.end_date
                })
            })

            return res.status(200).json({ message: {error: false, code: 200, message: todoArray } })

        }).catch(err => {
            return res.status(500).json({ error: true, code: 500, message: 'We are unable to complete this request at the moment. Please try again' })
        })
    },
    update: async (req, res) => {
        let userId = await res.locals.dToken
        let todoId = req.params.id

        if (!todoId) return res.status(422).json({ error: true, code: 422, message: 'Missing id parameter' })

        let updateTodo = {
            todo_title: req.body.todo_title,
            todo_description: req.body.todo_description,
            todo_type: req.body.todo_type,
            todo_status: req.body.todo_status,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        }

        Todo.update(updateTodo, {
            where: {
                [Op.and] : [
                    {id: todoId},
                    {user_id: userId}
                ]
            }
        })
        .then(result => {
            if(result == false) return res.status(400).json({error: true, code: 404, message: 'This record was not found and cannot be updated'})

            return res.status(200).json({ message: { error: false, code: 200, message: 'Todo updated successfully', data: req.body } })

        })
        .catch(err => {
            return res.status(500).json({ error: true, code: 500, message: 'We are unable to complete this request at the moment. Please try again' })
        })
    },
    delete: async (req, res) => {
        let userId = await res.locals.dToken
        let todoId = req.params.id

        if (!todoId) return res.status(422).json({ error: true, code: 422, message: 'Missing id parameter' })

        Todo.destroy({
            where: {
                [Op.and]: [
                    { id: todoId },
                    { user_id: userId }
                ]
            }
        }).then(result => {
            if (result == false) return res.status(400).json({ error: true, code: 404, message: 'This record was not found and cannot be deleted' })

            return res.status(200).json({ message: { error: false, code: 200, message: 'Todo updated successfully' } })

        }).catch(err => {
            return res.status(500).json({ error: true, code: 500, message: 'We are unable to complete this request at the moment. Please try again' })
        })
    },
    fetchAll: async (req, res) => {

        Todo.findAll({
            order: [['id', 'DESC']]
        })
            .then(result => {
                if (result.length < 1) return res.status(404).json({ error: true, code: 404, message: 'There are no posts at the moment. Go ahead and create new post' })

                const todoArray = []
                result.map(obj => {
                    todoArray.push({
                        id: obj.id,
                        todo_title: obj.todo_title,
                        todo_description: obj.todo_description,
                        todo_type: obj.todo_type,
                        todo_status: obj.todo_status,
                        start_date: obj.start_date,
                        end_date: obj.end_date
                    })
                })

                return res.status(200).json({ message: { error: false, code: 200, message: todoArray } })

            }).catch(err => {
                return res.status(500).json({ error: true, code: 500, message: 'We are unable to complete this request at the moment. Please try again' })
            })
    }
        
}