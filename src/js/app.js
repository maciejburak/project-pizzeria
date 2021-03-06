
import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js ';
import Cart from './components/Cart.js ';
import Booking from './components/Booking.js ';
import Home from './components/Home.js ';

const app = {
  initPages: function () {
    const thisApp = this;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    //console.log(thisApp.pages)
    const idFromHash = window.location.hash.replace('#/', '');
    //console.log(idFromHash);
    let pageMatchingHash = thisApp.pages[0].id;
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage: function (pageId) {
    
    const thisApp = this;
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#/' + pageId
      );
    }
  },
  initBooking: function () {
    const bookingElem = document.querySelector(select.containerOf.booking);
    new Booking(bookingElem);
  },
  initHome: function () {
    const homeElem = document.querySelector(select.containerOf.home);
    new Home(homeElem);
  },
  initMenu: function () {
    //const testProduct = new Product();
    //console.log('testProduct: ', testProduct);
    const thisApp = this;
    //console.log(thisApp);
    for (let productData in thisApp.data.products) {
      //console.log(thisApp.data.products[productData]); ------ data
      //console.log(productData)// ----- id
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }

  },
  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        //console.log('parsedResponse', parsedResponse);
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
    //console.log('thisApp.data', JSON.stringify(thisApp.data));

  },
  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },
  init: function () {
    const thisApp = this;/*
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);*/
    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initHome();
  },

};

app.init();


