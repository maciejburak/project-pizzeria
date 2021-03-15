import { templates, select} from '../settings.js';
import AmountWidget from '../components/AmountWidget.js ';

class Booking{
    constructor(element){
        const thisBooking = this;
        console.log(element);
        thisBooking.rander(element);
        thisBooking.initWidgets();
    }
    
    rander(element){
        const thisBooking = this;
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = templates.bookingWidget();
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        console.log(thisBooking.dom.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        console.log(thisBooking.dom.hoursAmount);
    }
    initWidgets(){
        const thisBooking = this;
        thisBooking.countPeopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.countHoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    }
}
export default Booking;