(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  //--------------------------------------------------------------------
  // Event handling
  //--------------------------------------------------------------------
  var doSomething = function (event) {
    console.log(this.constructor, event);
  }

  //--------------------------------------------------------------------
  // View Overrides
  //--------------------------------------------------------------------
  var addUIListeners = function () {
    this.ui.frame.addEventListener('click', doSomething.bind(this));
  }

  var initUI = function () {
    var isUIValid = false;
    var comp = document.createElement('section');
    comp.setAttribute('class', 'portrait');
    this.ui.frame = comp;

    if (this.ui.frame) {
      isUIValid = true;
    }

    return isUIValid;
  };
  //--------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------
  var Portrait = function (domId) {

    this.initUI = initUI;
    this.addUIListeners = addUIListeners;

    JWLB.View.call(this, domId);
  }

  Portrait.prototype = Object.create(JWLB.View.prototype);
  Portrait.prototype.constructor = Portrait;

  Portrait.prototype.show = function (pic) {
    var img = document.createElement('img');
    img.setAttribute('src', pic.source);
    img.setAttribute('title', pic.title);
    this.ui.frame.appendChild(img);
    document.querySelector(this.selector).appendChild(this.ui.frame);
  };

  Portrait.prototype.hide = function () {
    document.querySelector(this.selector).removeChild(this.ui.frame);
  };

  window.JWLB.View.Portrait = Portrait;

})(window);
