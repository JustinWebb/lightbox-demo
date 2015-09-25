/* 
* @Author: justinwebb
* @Date:   2015-09-20 14:37:46
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-24 18:30:39
* @Purpose: Demonstrate the following:
* -- The ability to access to a public API and successfully retrieve 
* data from it;
* -- The ability to display that data on a page using only native 
* JavaScript (no libraries); and
* -- The ability to update the UI of a page without refreshing the page.
*/


(function (JWLB) {
  'use strict';

  var displayPhoto = function (data) {
      console.log('Photo', data);
  };

  var sendQuery = function (event) {
    _vm.flickrOps.text = event.detail.query;
    JWLB.Model.FlickrService.search(_vm.flickrOps, {
      onSuccess: processSearchResults
    });
  };

  var processSearchResults = function (photos) {
    _vm.searchResult = photos;
    var displaySet = _vm.searchResult.photo.slice(_vm.displayIndex, _vm.displayCount);
    displaySet.forEach(function (photo) {
      _vm.flickrOps.id = photo.id;
      _vm.flickrOps.secret = photo.secret;
      JWLB.Model.FlickrService.getInfo(_vm.flickrOps, {
        onSuccess: displayPhoto
      });
    });
    _vm.displayIndex += _vm.displayCount;
  };

  var _vm = {
    searchForm: null,
    resultsPanel: null,
    searchResult: null,
    displayCount: 10,
    displayIndex: 0,
    flickrOps: {
      perPage: 50,
      text: null,
      id: null,
      secret: null,
    }
  };

  // Event Handling
  document.addEventListener('search', sendQuery);

  // Initialize Demo
  _vm.searchForm = new JWLB.View.SearchForm('.search');
  _vm.resultsPanel = document.querySelector('.results');
  
})(window.JWLB);