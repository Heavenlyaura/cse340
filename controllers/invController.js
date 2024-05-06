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
  let classificationList = await utilities.buildClassificationList()
  let inventory = await invModel.getInventory()
  res.render('./inventory/management', {
    title: 'Inventory Management',
    nav,
    inventory: inventory,
    classificationList,
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
  if (insert.rowCount > 0) { // This checks if the insert was sucessful by checking the rowcount, if its 1 then the query was sucessful but if there is no rowCount then the query did not run.
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
      title: "Add Classification",
      errors: null
    })
  }
}



/* ***************************
  Add Vehicle View
 * ************************** */
invCont.createAddVehicle = async (req, res, next) => {
  let nav = await utilities.getNav()
  let inventory = await utilities.buildClassificationList()
  res.render('./inventory/add-inventory', {
    nav,
    title: 'Add Vehicles',
    errors: null,
    inventory
  })
}

invCont.insertIntoInvTable = async (req, res, next) => {
  const { classification_id, inv_make, inv_model,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color } = req.body // extracts all needed information from the request body
    
  const insert = await invModel.insertIntoInvTable(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color)

  if (insert.rowCount = 1) { // checks if the query was sucessful by checking for the row count in the returend query 
    req.flash("notice", `${inv_make} ${inv_model} has been sucessfully added!`)
    res.redirect('/inv')
  } else {
    req.flash("notice", 'Something went wrong') // if the query was not sucessful, flash a message to the user
    res.render('./inventory/add-inventory', {
      nav,
      title: 'Add Vehicles',
      errors: null,
      classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles
    })
  }
}

/* ***************************
  Delete Inventory
 * ************************** */
invCont.DeleteInvView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let inv_id = req.params.invId
  let invDetailsReq = await invModel.getInventoryDetailsById(inv_id)
  let invDetails = invDetailsReq[0]

  res.render('./inventory/delete-inventory', {
    nav,
    title: 'Delete Inventory',
    errors: null,
    invDetails,
  })
}

invCont.deleteInvItem = async function (req, res, next) {
  const { inv_make, inv_model, inv_id } = req.body
  let deleteInv = await invModel.deleteInvItem(inv_id)
  let inventory = await invModel.getInventory()
  let classificationList = await utilities.buildClassificationList()
  let nav = await utilities.getNav()

  if (deleteInv.rowCount > 0) {
    req.flash('notice', `${inv_make} ${inv_model} was sucessfully deleted`)
    res.render('./inventory/management', {
      nav,
      title: 'Inventory Management',
      errors: null,
      classificationList,
      inventory,
    })
  } else {
    res.render('./inventory/management', {
      nav,
      title: 'Inventory Management',
      errors: null,
      classificationList,
      inventory
    })
  }
}

module.exports = invCont