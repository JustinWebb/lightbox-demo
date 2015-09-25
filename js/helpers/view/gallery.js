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

  var initUI = function () {
    var isUIValid = false;
    var comp = document.querySelector(_vm.selector);

    _vm.ui.frame = comp;

    if (_vm.ui.frame) {
      isUIValid = true;
    }

    return isUIValid;
  };

  var addThumb = function (data) {
    console.log('Thumb', data);
    var thumb = data.size.filter(function (elem) {
      return (elem.label === 'Square');
    })[0];
    var img = document.createElement('img');
    img.setAttribute('src', thumb.source);
    img.setAttribute('width', thumb.width);
    img.setAttribute('height', thumb.height);
    _vm.ui.frame.appendChild(img);
  };

  var _vm = {
    selector: null,
    ui: {
      frame: null
    }
  };

  var Gallery = function (domId) {
    _vm.selector = domId;

    this.addThumb = addThumb;

    try {
      if (!initUI()) {
        var msg = 'DOM is malformed. Refer to Gallery \'initUI\' method.';
        console.log(new ReferenceError(msg).stack);
      } else {
        _vm.ui.frame.addEventListener('click', function (event) {
          console.log('Gallery: ', event.target);
        });
      }

    } catch (e) {
      console.log('Gallery: ', e);
    }
  };

  window.JWLB.View.Gallery = Gallery;
})(window);