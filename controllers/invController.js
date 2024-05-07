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
  if (insert.rowCount > 0) { // checks if the query was sucessful by checking for the row count in the returend query 
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
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
  Delete Inventory
 * ************************** */
invCont.DeleteInvView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let inv_id = req.params.invId
  let invDetailsReq = await invModel.getInventoryDetailsById(inv_id)
  let invDetails = invDetailsReq

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
  if (deleteInv.rowCount > 0) {
    req.flash('notice', `${inv_make} ${inv_model} was sucessfully deleted`)
    res.redirect('/inv')
  } else {
    req.flash('notice', 'Error in deletion, please try again')
    res.redirect('/inv/delete/inv_id')
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryDetailsById(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.updateInventoryData = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body

  const updateData = await invModel.updateInventoryTable(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id)

  if (updateData.rowCount > 0) {
    req.flash('notice', `${inv_make} ${inv_model} has been updated!`)
    res.redirect('/inv')
  } else {
    let nav = utilities.getNav()
    req.flash('notice', 'Error in update, please try again')
    res.render('./inventory/edit-inventory', {
      nav,
      title: `Edit ${inv_make} ${inv_model}`,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id,
      errors: null,
    })
  }
}

module.exports = invCont