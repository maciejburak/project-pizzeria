import { settings, select } from '../settings.js';

class AmountWidget {
  constructor(element, button) {
    const thisWidget = this;
    //console.log(thisWidget);
    //console.log('construktor argument: ', element);
    thisWidget.cartButtonFromProduct = button;
    thisWidget.getElements(element);
    //console.log(element)
    thisWidget.initActions();
    thisWidget.setValue(thisWidget.input.value);

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
    thisWidget.value = thisWidget.input.value;//settings.amountWidget.defaultValue;
  }
  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);
    //thisWidget.value = newValue;
    //console.log('new Value: ', newValue);
    //console.log('thiswidget value ', thisWidget.value);
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

      /*thisWidget.cartButtonFromProduct.addEventListener('click', function () {
        thisWidget.input.value = 1;
        thisWidget.value = 1;
      });*/
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function () {

      /*thisWidget.cartButtonFromProduct.addEventListener('click', function () {
        thisWidget.input.value = 1;
        thisWidget.value = 1;
      });*/
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  announce() {
    const thisWidget = this;
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}
export default AmountWidget;