require('dotenv').config()
const db = require('../models')
const User = db.rest.models.user
const Todo = db.rest.models.todo_list
const jwt = require('jsonwebtoken')
const { decodedToken } = require('../../helpers/utils')
const { Op } = require("sequelize"); //using operator


module.exports = {
    create: async (req, res) => {
   
    },
    getSingle: async (req, res) => {
        let userId = await res.locals.dToken
        let postId = req.params.id

        if(!postId) return res.status(422).json({ error: true, code: 422, message: 'Missing id parameter'})

        Todo.findOne({
            [Op.and]: [
                { user_id: userId },
                { id: postId }]
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
   
    },
    delete: async (req, res) => {
   
    },
        
}