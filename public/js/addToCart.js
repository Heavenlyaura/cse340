document.addEventListener('DOMContentLoaded', () => {
  const addCartInput = document.querySelectorAll('.addCart')
  const badge = document.querySelector('.badge')
  const cartLink = document.querySelector('.cartLink')
  const cartItems = document.querySelector('.cartItems')
  let cartArr = []

  const storedCartItems = JSON.parse(localStorage.getItem('cart'))
  if (storedCartItems && storedCartItems.length > 0) {
    cartArr = storedCartItems
    badge.innerHTML = cartArr.length
  } else {
    // badge.innerHTML = 0;
    cartItems.innerHTML = '<p>No items in cart</p>'
  }

  addCartInput.forEach(card => {
    const inventory_id = card.getAttribute('inv_id')
    if (!inventory_id) {
      console.error('Missing inv_id attribute')
      return
    }
    card.addEventListener('click', () => {
      let classIdURL = "/inv/cart/" + inventory_id
      fetch(classIdURL)
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error("Network response was not OK")
        })
        .then(data => {
          cartArr.push(data)
          console.log(cartArr)
          badge.innerHTML = cartArr.length
          localStorage.setItem('cart', JSON.stringify(cartArr))
        })
        .catch(error => {
          console.error('Fetch error:', error)
        })
    })
  })
  console.log(cartArr)

  cartLink.addEventListener('click', () => {
    if (cartArr.length > 0) {
      fetch('/inv/sendcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({array: cartArr})
      })
      .then(response => response.text())
      .then(result => {
        console.log(result)
      })
      .catch(error => {
        console.error('Error:', error)
      })
    }
  })
})



