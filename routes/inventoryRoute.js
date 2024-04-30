// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const validateInv = require('../utilities/classification-validation')
const validate = require("../utilities/classification-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to the inventory detail page
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))
// Route to the inventory management page
router.get('/', utilities.handleErrors(invController.createInvManagement))
// Route to add vehicle page
router.get('/addvehicle', utilities.handleErrors(invController.createAddVehicle))
//  Route to add classification page
router.get('/addclassification', utilities.handleErrors(invController.addClassificationView))
// Post request to the add classification page
router.post('/addclassification',
  validateInv.classificationRules(),
  utilities.handleErrors(validateInv.checkClassificationData),
  utilities.handleErrors(invController.insertIntoClassTable),
)
// Post request to add vehicle to a classification page
router.post('/addvehicle',
  validateInv.inventoryRules(),
  utilities.handleErrors(validateInv.checkInventoryData),
  utilities.handleErrors(invController.insertIntoInvTable)
)






module.exports = router;