/*
* @Author: justinwebb
* @Date:   2015-09-24 21:08:23
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-24 22:19:45
*/
(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  //--------------------------------------------------------------------
  // View overrides
  //--------------------------------------------------------------------
  var initUI = function () {
    var isUIValid = false;
    var comp = document.querySelector(this.selector);

    this.ui.frame = comp;

    if (this.ui.frame) {
      isUIValid = true;
    }

    return isUIValid;
  };

  var addUIListeners = function () {

    this.ui.frame.addEventListener('click', function (event) {
      var id = event.target.parentNode.dataset.id;
      console.log('Gallery -- id: '+ id, event.target);
    });
  };

  //--------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------
  var Gallery = function (domId) {
    // Overriden View class methods
    this.initUI = initUI;
    this.addUIListeners = addUIListeners;

    // Instance properties
    this.photos = [];

    // Initialize View
    JWLB.View.call(this, domId);
  };

  //--------------------------------------------------------------------
  // Inheritance
  //--------------------------------------------------------------------
  Gallery.prototype = Object.create(JWLB.View.prototype);
  Gallery.prototype.constructor = Gallery;

  //--------------------------------------------------------------------
  // Instance methods
  //--------------------------------------------------------------------

  Gallery.prototype.addThumb = function (data, id) {
    console.log('Thumb -- id: ', id, 'data: ', data);
    // Store image data for future reference
    var photo = {
      thumb: null,
      portrait: data.size[0]
    };
    data.size.forEach(function (elem) {
      if (elem.label === 'Square') {
        photo.thumb = elem;
      }
      if (elem.height > photo.portrait.height) {
        photo.portrait = elem;
      }
    });
    this.photos.push(photo);

    // Build thumbnail UI
    var node = document.createElement('div');
    node.setAttribute('data-id', id);
    node.setAttribute('class', 'thumb');
    var img = document.createElement('img');
    img.setAttribute('src', photo.thumb.source);
    img.setAttribute('title', 'id: '+ id);
    node.appendChild(img);
    this.ui.frame.appendChild(node);
  };


  window.JWLB.View.Gallery = Gallery;
})(window);
