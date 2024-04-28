const express = require('express')
const router = new express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')

/* Get the Login in view for the Application */
router.get('/login', utilities.handleErrors(accountController.buildLogin))

/* Gets the Registration view for the Application */
router.get('/register', utilities.handleErrors(accountController.buildRegister))

/* Procesess the registration process */
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router