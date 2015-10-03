/*
* @Author: justinwebb
* @Date:   2015-09-20 22:09:35
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-24 13:59:51
*/
(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  //--------------------------------------------------------------------
  // Event handling
  //--------------------------------------------------------------------
  var inputOnInput = function (event) {
    // User enters data in search box
    this.ui.searchBtn.disabled = (this.ui.input.value === '') ? true : false;
  };

  var inputOnKeypress = function (event) {
    // User hits Enter while focused on input element
    var e = event || window.event;
    var code = e.which || e.keycode;
    if (code === 13) {
      event.preventDefault();
      var query = this.validateInput();
      if (query) {
        this.sendEvent('search', query);
      } else {
        // TODO: provide user feedback for bad query
        console.log(this.name +' input is bad!');
      }
    }
  };

  var formOnSubmit = function (event) {
    // User sends query
    event.preventDefault();
    var query = this.validateInput();
    if (query) {
      this.sendEvent('search', query);
    } else {
      // TODO: provide user feedback for bad query
      console.log('SearchForm: input is bad!');
    }
  };

  var buttonOnClick = function (event) {
    console.log(this.name, event.target);
  };

  //--------------------------------------------------------------------
  // View overrides
  //--------------------------------------------------------------------
  var addUIListeners = function () {
    this.ui.input.addEventListener('input', inputOnInput.bind(this));
    this.ui.input.addEventListener('keypress', inputOnKeypress.bind(this));
    this.ui.form.addEventListener('submit', formOnSubmit.bind(this));
    this.ui.closeBtn.addEventListener('click', buttonOnClick.bind(this));
  };

  var initUI = function () {
    var isUIValid = false;
    var comp = document.querySelector(this.selector);

    this.ui.form = comp.querySelector('form');
    this.ui.input = comp.querySelector('form input[type=search]');
    this.ui.searchBtn = comp.querySelector('button[name=search]');
    this.ui.closeBtn = comp.querySelector('button[name=close]');

    if (this.ui.form
      && this.ui.input
      && this.ui.searchBtn
      && this.ui.closeBtn) {
      isUIValid = true;

      // set state for form elements
      this.ui.input.value = '';
      // this.ui.input.setAttribute('required', true);
      // this.ui.input.setAttribute('pattern', /^[a-z\d\-_\s]+$/i);
      this.ui.searchBtn.disabled = true;
    }
    return isUIValid;
  };

  //--------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------
  var SearchForm = function (domId) {
    // Overriden View class methods
    this.initUI = initUI;
    this.addUIListeners = addUIListeners;
    this.name = 'SearchForm';

    // Initialize View
    JWLB.View.call(this, domId);
  };

  //--------------------------------------------------------------------
  // Inheritance
  //--------------------------------------------------------------------
  SearchForm.prototype = Object.create(JWLB.View.prototype);
  SearchForm.prototype.constructor = SearchForm;

  //--------------------------------------------------------------------
  // Instance methods
  //--------------------------------------------------------------------
  SearchForm.prototype.validateInput = function () {
    // var data = null;
    // if (this.ui.input.validity.patternMismatch) {
    //   data = this.ui.input.value;
    // }
    // return data;
    return this.ui.input.value;
  };

  window.JWLB.View.SearchForm = SearchForm;
})(window);
