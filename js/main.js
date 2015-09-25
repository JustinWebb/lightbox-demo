/* 
* @Author: justinwebb
* @Date:   2015-09-20 14:37:46
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-24 22:05:50
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
    _vm.flickrOps.text = event.detail.query;
    JWLB.Model.FlickrService.search(_vm.flickrOps, {
      onSuccess: processSearchResults
    });
  };

  var processSearchResults = function (result) {
    _vm.searchResults = result.photos;
    var displaySet = _vm.searchResults.photo.slice(_vm.displayIndex, _vm.displayCount);
    displaySet.forEach(function (photo) {
      _vm.flickrOps.id = photo.id;
      JWLB.Model.FlickrService.getSizes(_vm.flickrOps, {
        onSuccess: displayThumbnail
      });
    });
    _vm.displayIndex += _vm.displayCount;
  };

  var displayThumbnail = function (data) {
    _vm.gallery.addThumb(data.sizes);
  };

  var _vm = {
    searchForm: null,
    gallery: null,
    searchResults: null,
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

  // Initialize UI
  _vm.searchForm = new JWLB.View.SearchForm('.search');
  _vm.gallery = new JWLB.View.Gallery('.gallery');
  
})(window.JWLB);