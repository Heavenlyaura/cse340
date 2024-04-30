const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***********************
 * Get all inventory Details
* *************************** */
async function getInventoryDetailsById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory
      WHERE inv_id = $1`, [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error(`getinventorydetailsbyid ${error}`)
  }
}

/*  **********************************
  *  Check if classification name exist
  * ********************************* */
async function checkExistingName(classification_name) {
  try {
    const sql = `SELECT * FROM classification WHERE classification_name = $1`
    const name = await pool.query(sql, [classification_name])
    return name.rowCount
  } catch (error) {
    return error.message
  }
}

/*  **********************************
  *  Insert classifications
  * ********************************* */
async function insertClassification(classification_name) {
  try {
    const sql = `INSERT INTO classification (classification_name) VALUES ($1)`;
    const insert = await pool.query(sql, [classification_name])
    return insert
  } catch (error) {
    return error.message
  }
}


async function insertIntoInvTable(classification_id, inv_make, inv_model,
  inv_description, inv_image, inv_thumbnail, inv_price,
  inv_year, inv_miles, inv_color) {
  try {
    const sql = `INSERT INTO inventory (classification_id, inv_make, inv_model,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

    const values = [parseInt(classification_id), inv_make, inv_model, inv_description, inv_image, inv_thumbnail, parseFloat(inv_price), inv_year, parseInt(inv_miles), inv_color]
    console.log('kkkkkkkkkkkkkkk')
    let result = await pool.query(sql, values)
    console.log('jjjjjjjjjjjjjjjj')
    return result;
  } catch (error) {
    return error.message;
  }
}


module.exports = { getClassifications, getInventoryByClassificationId, getInventoryDetailsById, checkExistingName, insertClassification, insertIntoInvTable }