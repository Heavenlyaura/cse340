const express = require('express')
const router = new express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')


/* Get the Login in view for the Application */
router.get('/login', utilities.handleErrors(accountController.buildLogin))

/* Gets the Registration view for the Application */
router.get('/register', utilities.handleErrors(accountController.buildRegister))

/* Procesess the registration process */
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router