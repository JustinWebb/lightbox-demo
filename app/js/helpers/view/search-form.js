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
    var ui = this.ui;
    if (ui.input.value === '') {
      ui.searchBtn.disabled = true;
      this.addClass(ui.closeBtn, 'hidden');
    } else {
      ui.searchBtn.disabled = false;
      this.removeClass(ui.closeBtn, 'hidden');
    }
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
    resetSearch(this);
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
    var elem = document.querySelector(this.selector);
    var ui = this.ui;

    ui.form = elem.querySelector('form');
    ui.input = elem.querySelector('form input[type=search]');
    ui.searchBtn = elem.querySelector('button[name=search]');
    ui.closeBtn = elem.querySelector('button[name=close]');

    if (ui.form && ui.input && ui.searchBtn && ui.closeBtn) {
      isUIValid = true;

      // set state for form elements
      ui.input.value = '';
      // TODO: Improve validation
      // ui.input.setAttribute('required', true);
      // ui.input.setAttribute('pattern', /^[a-z\d\-_\s]+$/i);
      ui.searchBtn.disabled = true;
      this.addClass(ui.closeBtn, 'hidden');
    }
    return isUIValid;
  };

  //--------------------------------------------------------------------
  // Helper methods
  //--------------------------------------------------------------------
  var resetSearch = function (searchForm) {
    searchForm.ui.input.value = '';
    searchForm.addClass(searchForm.ui.closeBtn, 'hidden');
    searchForm.ui.input.focus();
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

  SearchForm.prototype.displayResults = function (results) {
    var sf = this.element();
    var pageStats = results.page +'/'+ results.pages;
    sf.querySelector('input[name=pages]').value = pageStats;
    sf.querySelector('input[name=viewing]').value = results.perpage;
    sf.querySelector('input[name=total]').value = results.total;
  };

  window.JWLB.View.SearchForm = SearchForm;
})(window);
