/* 
* @Author: justinwebb
* @Date:   2015-09-20 22:09:35
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-23 16:52:00
*/
(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  var _vm = {};
  var SearchForm = function (domId) {

    // Ensure SearchForm HTML is properly constructed
    try {
      _vm.ui = document.querySelector(domId);
      if (!document.contains(_vm.ui)) {
        var msg = 'Element '+ domId +' not present on DOM';
        console.log(new ReferenceError(msg).stack);
      }
    } catch (e) {
      console.log('SearchForm: ', e);
    }
  };

  window.JWLB.View.SearchForm = SearchForm;
})(window);