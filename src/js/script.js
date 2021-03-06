/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong',
      totalPrice2: '.cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };
  class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }
    renderInMenu() {
      const thisProduct = this;
      //console.log(thisProduct) //- pokazuje na obiekt
      const generatedHTML = templates.menuProduct(thisProduct.data);
      //console.log(generatedHTML);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      //console.log(thisProduct.element);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }
    getElements() {
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      //console.log(thisProduct.accordionTrigger);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      //console.log(thisProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      //console.log(thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      //console.log(thisProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      //console.log(thisProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      //console.log(thisProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      //console.log(thisProduct.amountWidgetElem);
    }
    initAccordion() {
      const thisProduct = this;
      //console.log(thisProduct.element);
      thisProduct.accordionTrigger.addEventListener('click', function (event) {
        event.preventDefault();
        const activeProduct = document.querySelector('.product.active');
        // console.log(activeProduct);
        //console.log(thisProduct);
        if (activeProduct !== null && activeProduct != thisProduct.element) {

          activeProduct.classList.remove('active');

        }
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      });
    }
    initOrderForm() {
      const thisProduct = this;
      //console.log(thisProduct.initOrderForm);
      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }
    processOrder() {
      const thisProduct = this;
      //console.log(thisProduct.processOrder);
      const formData = utils.serializeFormToObject(thisProduct.form);//poodznaczne parametry w danym produkcie
      //console.log('formData', formData);
      let price = thisProduct.data.price;//ceny produktow
      //console.log(price);
      for (let paramId in thisProduct.data.params) {
        //console.log(paramId)//nazwy danej kategorii we wszystkich produktach
        const param = thisProduct.data.params[paramId];//wlasciwosci kazdej z kategorii
        //console.log(formData[paramId])
        for (let optionId in param.options) {
          const option = param.options[optionId];
          //console.log(option)
          //console.log(optionId)
          //console.log(optionId, option);
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          //console.log(optionImage);
          if (optionImage != null) {
            optionImage.classList.remove('active');
          }
          if (formData[paramId].includes(optionId)) {
            if (!option.default) {
              price = price + option.price;
            }
            if (optionImage != null) {
              optionImage.classList.add('active');
            }
            else if (optionImage != null) {
              optionImage.classList.add('active');
            }
          } else {
            if (option.default) {
              price = price - option.price;
            }
          }
        }
      }
      thisProduct.priceSingle = price;
      price *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
    }
    addToCart() {
      const thisProduct = this;
      app.cart.add(thisProduct.prepareCartProduct());
    }
    prepareCartProductParams() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = {};

      for (let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        params[paramId] = {
          label: param.label,
          options: {}
        };
        for (let optionId in param.options) {
          const option = param.options[optionId];
          if (formData[paramId].includes(optionId)) {
            params[paramId].options[optionId] = option.label;
          }
        }
      }
      return params;
    }
    prepareCartProduct() {
      const thisProduct = this;
      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        priceSingle: thisProduct.priceSingle,
        price: thisProduct.priceElem.innerHTML,
        params: thisProduct.prepareCartProductParams(),
      };
      return productSummary;
    }
  }
  class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      //console.log(thisWidget);
      //console.log('construktor argument: ', element);
      thisWidget.getElements(element);
      //console.log(element)
      thisWidget.initActions();
      thisWidget.setValue(settings.amountWidget.defaultValue);

    }
    getElements(element) {
      const thisWidget = this;
      thisWidget.element = element;
      //console.log(thisWidget.element);
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      //console.log(thisWidget.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      //console.log(thisWidget.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      //console.log(thisWidget.linkIncrease);
      thisWidget.value = settings.amountWidget.defaultValue;
    }
    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);
      //thisWidget.value = newValue;
      //console.log(newValue);
      if (thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
      }
      thisWidget.input.value = thisWidget.value;
      thisWidget.announce();
    }
    initActions() {
      const thisWidget = this;
      thisWidget.input.addEventListener('change', function () {
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function () {
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function () {
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
    announce() {
      const thisWidget = this;
      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
      //console.log('elo')
    }
  }
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
  }
  class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      //console.log('thisCartProduct.amount ', thisCartProduct.amount);
      thisCartProduct.params = menuProduct.params;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.getElements(element);
      //console.log(element);
      //console.log(thisCartProduct);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
    }
    getElements(element) {
      const thisCartProduct = this;
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
      //console.log('thisCartProduct.dom.amountWidget ', thisCartProduct.dom.amountWidget);
      thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
    }
    initAmountWidget() {
      const thisCartProduct = this;
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      //console.log(thisCartProduct.dom.amountWidgetElem);
      thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        //thisCartProduct.dom.amountWidget.value =  thisCartProduct.amount
        //thisCartProduct.amountWidget.value = thisCartProduct.amount;
        //thisCartProduct.dom.amountWidget.value = thisCartProduct.amountWidget.value;
        //thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;

      });
    }
    remove() {
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct
        }
      });

      thisCartProduct.dom.wrapper.dispatchEvent(event);

    }
    initActions() {
      const thisCartProduct = this;
      thisCartProduct.dom.edit.addEventListener('click', function () { });
      thisCartProduct.dom.remove.addEventListener('click', function () {
        thisCartProduct.remove();
      });
    }
  }
  const app = {
    initMenu: function () {
      //const testProduct = new Product();
      //console.log('testProduct: ', testProduct);
      const thisApp = this;
      //console.log(thisApp);
      for (let productData in thisApp.data.products) {
        //console.log(thisApp.data.products[productData]); ------ data
        //console.log(productData) ----- id
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },
    initCart: function () {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },
    init: function () {
      const thisApp = this;/*
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);*/
      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },

  };

  app.init();


}