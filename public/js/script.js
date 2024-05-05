const classificationList = document.querySelector('#classificationList')
const inventory = document.querySelector('#inventory')
const inventoryJson = inventory.value
const invList = document.querySelector('.inv-list')
const inventoryArray = JSON.parse(inventoryJson)

console.log(inventoryArray)
classificationList.addEventListener('change', () => {
  invList.innerHTML = ''
  inventoryArray.forEach(items => {
    if (classificationList.value == items.classification_id) {
      console.log(classificationList.value)
      let p = document.createElement('p')
      let aDelete = document.createElement('a')
      let aModify = document.createElement('a')
      let span = document.createElement('span')

      aDelete.setAttribute('href', `/inv/delete/${items.inv_id}`)
      aModify.setAttribute('href', 'Modify')
      aDelete.textContent = 'Delete'
      aModify.textContent = 'Modify'
      p.textContent = `${items.inv_make} ${items.inv_model}`

      span.appendChild(aDelete)
      span.appendChild(aModify)
      p.appendChild(span)
      invList.appendChild(p)
    }
  });
})
