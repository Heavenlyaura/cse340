const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require('../models/inventory-model')
const validate = {}

/*  **********************************
  *  Classisfication Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .matches(/^[a-zA-Z0-9]+$/, 'i')
      .withMessage('Classification name is required and should meet expression requirements')
      .custom(async (classification_name) => {
        const nameExists = await invModel.checkExistingName(classification_name)
        if (nameExists) {
          throw new Error('Classification name already exists')
        }
      })
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render('./inventory/add-classification', {
      errors,
      title: 'Add Classification',
      classification_name,
      nav,
    })
    return
  }
  next()
}

module.exports = validate