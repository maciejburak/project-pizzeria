import { templates, select } from '../settings.js';
import AmountWidget from '../components/AmountWidget.js ';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';


class Booking {
  constructor(element) {
    const thisBooking = this;
    //console.log(element);
    thisBooking.rander(element);
    thisBooking.initWidgets();
  }

  rander(element) {
    const thisBooking = this;
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = templates.bookingWidget();
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.dataPicker =  thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    //console.log(thisBooking.dom.hourPicker)
  }
  initWidgets() {
    const thisBooking = this;
    thisBooking.countPeopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.countHoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.pickDate = new DatePicker(thisBooking.dom.dataPicker);
    thisBooking.pickHour = new HourPicker(thisBooking.dom.hourPicker);
  }
}
export default Booking;