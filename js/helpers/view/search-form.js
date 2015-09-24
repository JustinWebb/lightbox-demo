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

  var _vm = {
    selector: null,
    ui: {
      form: null,
      input: null,
      button: null
    }
  };

  var initUI = function () {
    var isUIValid = false;
    var comp = document.querySelector(_vm.selector);

    _vm.ui.form = comp.querySelector('form');
    _vm.ui.input = comp.querySelector('form input[type=search]');
    _vm.ui.button = comp.querySelector('form button[type=submit]');

    if (_vm.ui.form && _vm.ui.input && _vm.ui.button) {
      isUIValid = true;

      // set state for form elements
      _vm.ui.input.value = '';
      // _vm.ui.input.setAttribute('required', true);
      // _vm.ui.input.setAttribute('pattern', /^[a-z\d\-_\s]+$/i);
      _vm.ui.button.disabled = true;
    }
    return isUIValid;
  };

  var validateInput = function () {
    // var data = null;
    // if (_vm.ui.input.validity.patternMismatch) {
    //   data = _vm.ui.input.value;
    // }
    // return data;
    return _vm.ui.input.value;
  };

  var dispatchSearchEvent = function (query) {
    var se = null;
    if (window.CustomEvent) {
      se = new CustomEvent('search', {
        bubbles: true,
        cancelable: true,
        detail: {query: query}
      });
    } else {
      se = document.createEvent('search', true, true, {query: query});
    }
    _vm.ui.form.dispatchEvent(se);
  };

  var SearchForm = function (domId) {
    _vm.selector = domId;
    try {
      if (!initUI()) {
        var msg = 'DOM is malformed. Refer to SearchForm \'initUI\' method.';
        console.log(new ReferenceError(msg).stack);
      } else {
        // User enters data in search box
        // var inputEvents = 'propertychange change click keyup input paste';
        _vm.ui.input.addEventListener('input', function (event) {
          _vm.ui.button.disabled = (_vm.ui.input.value === '') ? true : false;
        });

        _vm.ui.input.addEventListener('keypress', function (event) {
          var e = event || window.event;
          var code = e.which || e.keycode;
          if (code === 13) {
            event.preventDefault();
            var query = validateInput();
            if (query) {
              dispatchSearchEvent(query);
            } else {
              // TODO: provide user feedback for bad query
              console.log('SearchForm: input is bad!');
          }          }
        });

        // User sends query
        _vm.ui.form.addEventListener('submit', function (event) {
          event.preventDefault();
          var query = validateInput();
          if (query) {
            dispatchSearchEvent(query);
          } else {
            // TODO: provide user feedback for bad query
            console.log('SearchForm: input is bad!');
          }
        });
      }
    } catch (e) {
      console.log('SearchForm: ', e);
    }
  };

  window.JWLB.checkForm = function (e) {
    console.log('Check: ', e);
    return false;
  };

  window.JWLB.View.SearchForm = SearchForm;
})(window);