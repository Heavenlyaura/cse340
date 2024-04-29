const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { body } = require("express-validator")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build by inventory id view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryDetailsById(inv_id)
  const display = await utilities.buildDetailDisplay(data)
  let nav = await utilities.getNav()
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: className,
    nav,
    display,
  })
}

/* ***************************
  Build Inventoey management view
 * ************************** */
invCont.createInvManagement = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render('./inventory/management', {
    title: 'Inventory Management',
    nav,
  })
}

/* ***************************
  Build Inventoey management view
 * ************************** */
invCont.addClassificationView = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render('./inventory/add-classification', {
    title: 'Add Classification',
    nav,
    errors: null,
  })
}

/* ***************************
  Insert new Classification into classification table
 * ************************** */
invCont.insertIntoClassTable = async (req, res, next) => {
  const { classification_name } = req.body
  const insert = await invModel.insertClassification(classification_name)
  let nav = await utilities.getNav()
  if (insert) {
    req.flash("notice", `New classification "${classification_name}" has been added`)
    res.status(201).render('./inventory/management', {
      title: 'Inventory Management',
      nav,
      errors: null
    })
  } else {
    req.flash("notice", `Sorry, Adding ${classification_name} was not sucesssful! Please try again`)
    res.status(501).render("./inventory/add-classification", {
      nav,
      title: "Add Classification"
    })
  }
}

invCont.createAddVehicle = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render('./inventory/add-vehicles', {
    nav,
    title: 'Add Vehicles'
  })
}

module.exports = invCont