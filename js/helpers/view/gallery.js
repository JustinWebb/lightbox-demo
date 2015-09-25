/* 
* @Author: justinwebb
* @Date:   2015-09-24 21:08:23
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-24 21:59:10
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

  var _vm = {
    selector: null,
    ui: {
      frame: null
    }
  };

  var Gallery = function (domId) {
    _vm.selector = domId;

    this.addThumb = function (data) {
      console.log('Thumb', data);
    };

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