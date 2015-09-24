/* 
* @Author: justinwebb
* @Date:   2015-09-20 14:37:46
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-23 20:07:42
* @Purpose: Demonstrate the following:
* -- The ability to access to a public API and successfully retrieve 
* data from it;
* -- The ability to display that data on a page using only native 
* JavaScript (no libraries); and
* -- The ability to update the UI of a page without refreshing the page.
*/


(function (JWLB) {
  'use strict';

  var sendQuery = function (event) {
    JWLB.Model.FlickrService.get(event.query, _vm.flickrOps);
  };

  var displayResults = function (photos) {
    console.log('Main: ', photos);
  };

  var _vm = {
    search: null,
    flickrOps: {
      count: 50
    }
  };

  // Event Handling
  JWLB.Model.FlickrService.setHandlers(displayResults);
  document.addEventListener('search', sendQuery);

  // Initialize Demo
  _vm.search = new JWLB.View.SearchForm('.search');
  
})(window.JWLB);