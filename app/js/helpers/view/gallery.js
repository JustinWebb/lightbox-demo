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
  // Event handling
  //--------------------------------------------------------------------
  var wallOnClick = function (event) {

    if (event.target.tagName.toLowerCase() === 'img') {
      var id = event.target.parentNode.dataset.id;
      var selectedPhoto = this.photos.filter(function (photo) {
        if (photo.id === id) {
          photo.portrait.id = id;
          return photo;
        }
      })[0];
      this.sendEvent('gallery', selectedPhoto.portrait);
    }
  };

  //--------------------------------------------------------------------
  // View overrides
  //--------------------------------------------------------------------
  var addUIListeners = function () {
    this.ui.wall.addEventListener('click', wallOnClick.bind(this));
  };

  var initUI = function () {
    var isUIValid = false;
    var comp = document.querySelector(this.selector);

    this.ui.wall = comp;

    if (this.ui.wall) {
      this.reset();
      isUIValid = true;
    }

    return isUIValid;
  };

  //--------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------
  var Gallery = function (domId) {
    // Overriden View class methods
    this.initUI = initUI;
    this.addUIListeners = addUIListeners;
    this.name = 'Gallery';

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
    // Store image data for future reference
    var photo = {
      id: id,
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
    this.ui.wall.querySelector('article[name=foobar]').appendChild(node);
  };

  Gallery.prototype.reset = function () {
    if (this.ui.wall.children.length > 0) {
      var article = this.ui.wall.children.item(0)
      article.parentElement.removeChild(article);
    }
    var article = document.createElement('article');
    article.setAttribute('name', 'foobar');
    this.ui.wall.appendChild(article);
  };

  window.JWLB.View.Gallery = Gallery;
})(window);
