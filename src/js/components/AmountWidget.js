import { settings, select } from '../settings.js';
import BaseWidget from '../components/BaseWidget.js';
class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    //console.log(thisWidget);
    thisWidget.getElements(element);
    //console.log(element)
    thisWidget.initActions();
  }
  
  getElements() {
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    //console.log(thisWidget.dom.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    //console.log(thisWidget.dom.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    //console.log(thisWidget.dom.linkIncrease); 
    //thisWidget.value = thisWidget.dom.input.value;//settings.amountWidget.defaultValue;
    //thisWidget.value = settings.amountWidget.defaultValue
  }
  
  isValid(value) {
    return !isNaN(value) 
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }

  renderValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function () {
      //thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;