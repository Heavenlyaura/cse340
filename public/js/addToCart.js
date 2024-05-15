const addCartInput = document.querySelectorAll('#addCart')
const badge = document.querySelector('.badge')
let cartArr = []

document.addEventListener('DOMContentLoaded', () => {
  const storedCartItems = JSON.parse(localStorage.getItem('cart'));
  if (storedCartItems) {
      cartArr = storedCartItems;
      badge.innerHTML = cartArr.length;
  }
});

addCartInput.forEach(card => {
const inventory_id = card.getAttribute('inv_id')
  card.addEventListener('click', () => {
    if (card) { 
      // let inventory_id = addCart
      let classIdURL = "/inv/cart/" + inventory_id
      fetch(classIdURL)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
          throw Error("Network response was not OK");
        })
        .then(function (data) {
          cartArr.push(data)
          badge.innerHTML = cartArr.length
          localStorage.setItem('cart', JSON.stringify(cartArr))
          console.log(data)
        })
        .catch(function (error) {
        })
    }
  })
})
