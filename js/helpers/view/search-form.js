/* 
* @Author: justinwebb
* @Date:   2015-09-20 22:09:35
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-23 20:59:00
*/
(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  var _vm = {
    comp: null,
    submit: null,
  };

  var SearchForm = function (domId) {
    this.form = null;
    this.results = null;
    // Ensure SearchForm HTML is properly constructed
    try {
      _vm.comp = document.querySelector(domId);
      if (!document.contains(_vm.comp)) {
        var msg = 'Element '+ domId +' not present on DOM';
        console.log(new ReferenceError(msg).stack);
      } else {
        this.form = _vm.comp.querySelector('form');
        this.form.addEventListener('submit', function (event) {
          var se, query = null;
          event.preventDefault();
          
          // Get input data
          query = this.querySelector('input[type=text]').value;

          // Dispatch custom search event with input attached
          if (window.CustomEvent) {
            se = new CustomEvent('search', {
              bubbles: true,
              cancelable: true,
              detail: {query: query}
            });
          } else {
            se = document.createEvent('search', true, true, {query: query});
          }
          this.dispatchEvent(se);
        });
      }
    } catch (e) {
      console.log('SearchForm: ', e);
    }
  };

  window.JWLB.View.SearchForm = SearchForm;
})(window);