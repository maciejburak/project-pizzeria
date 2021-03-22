
import { templates, select, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from '../components/AmountWidget.js ';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.randerAndGetElements(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initActions();
    thisBooking.selectedTable();
  }
  randerAndGetElements(element) {
    const thisBooking = this;
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = templates.bookingWidget();
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.dataPicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    //document.querySelector('.date-picker input').value = utils.dateToStr(new Date());
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.minDate = new Date();
    thisBooking.maxDate = utils.addDays(thisBooking.minDate, settings.datePicker.maxDaysInFuture);
    thisBooking.dom.tableContainer = document.querySelector('.floor-plan');
    thisBooking.dom.checkbox = document.querySelectorAll('.checkbox input');
    thisBooking.dom.phoneAndAdress = document.querySelectorAll('.order-confirmation input');
    thisBooking.dom.button = document.querySelector('.order-confirmation button');
    thisBooking.tables = document.querySelectorAll('.table');
  }
  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,

      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };
    //console.log(params)

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])

      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = thisBooking.minDate; loopDate <= thisBooking.maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDOM() {
    const thisBooking = this;
    //thisBooking.hour = document.querySelector('.range-slider input').value
    thisBooking.date = thisBooking.pickDate.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.pickHour.value);
    //thisBooking.date = document.querySelector('.date-picker input').value;

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);

      let parsedTableId;
      if (!isNaN(tableId)) {
        parsedTableId = parseInt(tableId);
      }

      if (
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(parsedTableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }

    }
  }
  initWidgets() {
    const thisBooking = this;
    thisBooking.countPeopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.countHoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.pickDate = new DatePicker(thisBooking.dom.dataPicker);
    thisBooking.pickHour = new HourPicker(thisBooking.dom.hourPicker);
  }
  initActions(){
    const thisBooking = this;
    thisBooking.dom.wrapper.addEventListener('change', function () {
      thisBooking.prepareReservation();
    });
    thisBooking.dom.wrapper.addEventListener('updated', function () {
      console.log(document.querySelector('.date-picker input').value);
      thisBooking.prepareReservation();
    });
    thisBooking.dom.tableContainer.addEventListener('click', function () {
      thisBooking.prepareReservation();
    });
    thisBooking.dom.button.addEventListener('click', function (){
      if(document.querySelector('.date-picker input').value.length > 0){
        thisBooking.sendOrder();
      }else{
        alert('Pizzeria is closed today');
      }
    });
    
  }
  selectedTable() {
    const thisBooking = this;
    //console.log(thisBooking.tables)
    thisBooking.checked = [];
    document.querySelector('.floor-plan').dataset.value = 'null';
    for (let table of thisBooking.tables) {
      table.addEventListener('click', function () {
        for (let table of thisBooking.tables) {
          table.classList.remove('selected');
        }
        let tableId = table.getAttribute('data-table');
        if (thisBooking.checked.includes(tableId)) {
          table.classList.remove('selected');
          thisBooking.checked.splice(thisBooking.checked.indexOf(tableId), 1);
        } else {
          thisBooking.checked.splice(0, thisBooking.checked.length);
          table.classList.add('selected');
          thisBooking.checked.push(tableId);
        }
        if (table.classList.contains('booked')) {
          table.classList.remove('selected');
          alert('Stolik niedostępny');
          document.querySelector('.floor-plan').dataset.value = 'null';
        } else {
          document.querySelector('.floor-plan').dataset.value = thisBooking.checked[0];
        }
      });
    }
  }
  prepareReservation() {
    const thisBooking = this;
    thisBooking.updateDOM();
    
    thisBooking.payload = {
      date: thisBooking.date,
      hour: utils.numberToHour(thisBooking.hour),
      table: document.querySelector('.floor-plan').getAttribute('data-value'),
      duration: parseInt(document.querySelector('.hours-amount input').value),
      ppl: parseInt(document.querySelector('.people-amount input').value),
      starters: [],
      phone: thisBooking.dom.phoneAndAdress[0].value,
      address: thisBooking.dom.phoneAndAdress[1].value,
    };
    for (let check of thisBooking.dom.checkbox) {
      if (check.checked) {
        thisBooking.payload.starters.push(check.value);
      }
    }

    return thisBooking.payload;

  }
  sendOrder(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thisBooking.prepareReservation()),
    };

    fetch(url, options);
  
  }
}

export default Booking;