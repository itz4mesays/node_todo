const router = require('express').Router()

router.get('/', (req, res) => {
    res.status(200).json({message: 'Backend APIs for TODO List'})
})

module.exports = router