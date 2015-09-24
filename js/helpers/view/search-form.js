/* 
* @Author: justinwebb
* @Date:   2015-09-20 22:09:35
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-23 19:40:41
*/
(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  var _vm = {
    comp: null,
    submit: null,
  };
  var SearchForm = function (domId, formAction) {
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
          var se = null;
          event.preventDefault();
          if (window.CustomEvent) {
            se = new CustomEvent('search', {
              bubbles: true,
              cancelable: true,
              detail: {query: 'chocolate'}
            });
          } else {
            se = document.createEvent('search', true, true, {query: 'foo'});
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