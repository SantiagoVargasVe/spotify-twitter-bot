const express = require('express')
const router = express.Router('router')
const {initProgram} = require('../controllers/twitter')

router.get('/', async (req, res) => {
  initProgram()
  res.status(200).send('You are being observed')
})

module.exports = router
