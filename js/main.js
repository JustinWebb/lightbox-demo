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
  //--------------------------------------------------------------------
  // Event handling
  //--------------------------------------------------------------------
  var displayPortrait = function (event) {
    var portrait = event.detail.portrait;

    // Retrive display info for target image
    var notes = _vm.searchResults.photo.filter(function(p) {
      if (p.id === portrait.id) {return p}
    })[0];
    portrait.title = notes.title;
    _vm.portraitFrame.show(portrait);
  };

  var sendQuery = function (event) {
    _vm.flickrOps.text = event.detail.query;
    JWLB.Model.FlickrService.search(_vm.flickrOps, {
      onSuccess: processSearchResults
    });
  };

  //--------------------------------------------------------------------
  // Utility
  //--------------------------------------------------------------------
  var processSearchResults = function (result) {
    _vm.searchResults = result.photos;
    console.log('_vm.searchResults: ', _vm.searchResults);
    var displaySet = _vm.searchResults.photo.slice(
      _vm.viewIndex,
      _vm.viewCount
    );
    displaySet.forEach(function (photo) {
      _vm.flickrOps.id = photo.id;
      JWLB.Model.FlickrService.getSizes(_vm.flickrOps, {
        onSuccess: displayThumbnail
      });
    });
    _vm.viewIndex += _vm.viewCount;
  };

  var displayThumbnail = function (data, id) {
    if (data) {
      _vm.gallery.addThumb(data.sizes, id);
    } else {
      console.log('Main: displayThumbnail ERROR: ', 'ID: '+id);
    }
  };

  var _vm = {
    searchForm: null,
    gallery: null,
    searchResults: null,
    viewCount: 50,
    viewIndex: 0,
    flickrOps: {
      perPage: 50,
      text: null,
      id: null,
      secret: null,
    }
  };

  // Event Handling
  document.addEventListener('search', sendQuery);
  document.addEventListener('gallery', displayPortrait);

  // Initialize UI
  _vm.searchForm = new JWLB.View.SearchForm('.search');
  _vm.gallery = new JWLB.View.Gallery('.gallery');
  _vm.portraitFrame = new JWLB.View.Portrait('body');

})(window.JWLB);
