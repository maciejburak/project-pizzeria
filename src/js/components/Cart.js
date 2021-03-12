import { templates, select, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import CartProduct from '../components/CartProduct.js ';

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    //console.log('new Cart', thisCart);
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = document.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = document.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
    thisCart.dom.totalPrice2 = thisCart.dom.wrapper.querySelector(select.cart.totalPrice2);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  }
  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      //thisCart.phonenumber(thisCart.dom.phone);
      thisCart.sendOrder();
      //thisCart.removeIfOrder();
    });
  }
  add(menuProduct) {
    const thisCart = this;
    //console.log('adding product', menuProduct);
    const generatedDOM = templates.cartProduct(menuProduct);
    //console.log(generatedDOM);
    thisCart.element = utils.createDOMFromHTML(generatedDOM);
    thisCart.dom.productList.appendChild(thisCart.element);
    thisCart.products.push(new CartProduct(menuProduct, thisCart.element));
    //console.log('thisCart.products', thisCart.products);
    thisCart.update();

  }
  /*removeIfOrder() {
    const thisCart = this;
    for (let product of thisCart.products) {
      product.amount = 0;
      product.price = 0;
      thisCart.products.splice(0, 0, [product]);
      product.dom.wrapper.remove();
    }
    thisCart.update();
  }*/

  update() {
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    //console.log(thisCart.deliveryFee);
    thisCart.totalNumber = 0;
    thisCart.subTotalPrice = 0;
    for (let product of thisCart.products) {
      const productPrice = parseInt(product.price);
      thisCart.totalNumber += product.amount;
      thisCart.subTotalPrice += productPrice;
    }
    //console.log(thisCart.totalNumber);
    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
    thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;
    //console.log(thisCart.dom.totalPrice);
    if (thisCart.subTotalPrice === 0 && thisCart.deliveryFee === 20) {
      thisCart.dom.totalPrice.innerHTML = '0';
      thisCart.dom.totalPrice2.innerHTML = '0';
    } else {
      thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
      thisCart.dom.totalPrice2.innerHTML = thisCart.totalPrice;
    }


    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
  }

  remove(cartProduct) {

    const thisCart = this;
    //console.log(cartProduct)
    const elementIndex = thisCart.products.indexOf(cartProduct);
    //console.log(elementIndex)
    thisCart.products.splice(elementIndex, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
  /*phonenumber(phone) {
    const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
    if (phone.value.match(phoneno)) {
      return true;
    }
    else {
      alert('phone number is incorrect');
      return false;
    }
  }*/
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.dom.totalPrice.innerHTML,
      subTotalPrice: thisCart.dom.subTotalPrice.innerHTML,
      totalNumber: thisCart.dom.totalNumber.innerHTML,
      deliveryFee: thisCart.dom.deliveryFee.innerHTML,
      products: [],
    };
    //console.log(thisCart.payload);
    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    console.log('payload: ', payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }

}
export default Cart;