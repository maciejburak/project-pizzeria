import { templates, select, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from '../components/AmountWidget.js ';

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
    //console.log(thisProduct);
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
    thisProduct.accordionTrigger.addEventListener('click', function (event) {
      //console.log(event);
      event.preventDefault();
      const activeProduct = document.querySelector('.product.active');
      //console.log(activeProduct);
      /*const proba = document.querySelectorAll('.product')
      for (let i of proba){
        if(i.classList.contains('active')){
          i.classList.remove('active');
        }
      }
      thisProduct.element.classList.toggle('active')*/
      //console.log(thisProduct.element);

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
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem, thisProduct.cartButton);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }
  addToCart() {
    const thisProduct = this;
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });
    thisProduct.element.dispatchEvent(event);
    //app.cart.add(thisProduct.prepareCartProduct());
  }
  prepareCartProductParams() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      //console.log(param);
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

export default Product;