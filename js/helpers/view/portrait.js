(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  //--------------------------------------------------------------------
  // Event handling
  //--------------------------------------------------------------------
  var doSomething = function (event) {
    console.log(this.constructor, event);
    event.stopImmediatePropagation();

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
  // Private methods
  //--------------------------------------------------------------------
  var imgCenterCanvasOnScreen = function (event) {
    var canvas = event.target.parentNode;
    canvas.style.marginLeft = (canvas.offsetWidth / 2 * -1) +'px';
    canvas.style.marginTop = (canvas.offsetHeight / 2 * -1) +'px';
    console.log(canvas);
  };
  //--------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------
  var _vm = {
    canvasSelector: 'section.portrait > .canvas'
  };
  var Portrait = function (domId) {

    this.initUI = initUI;
    this.addUIListeners = addUIListeners;

    this.viewedPics = [];

    JWLB.View.call(this, domId);
  }

  Portrait.prototype = Object.create(JWLB.View.prototype);
  Portrait.prototype.constructor = Portrait;

  Portrait.prototype.show = function (pic) {

    // Create UI and add pic to DOM
    var img = document.createElement('img');
    img.setAttribute('src', pic.source);
    img.setAttribute('title', pic.title);
    img.onload = imgCenterCanvasOnScreen;
    var canvas = document.createElement('div');
    canvas.setAttribute('class', 'canvas');
    canvas.appendChild(img);
    this.ui.frame.appendChild(canvas);
    document.querySelector(this.selector).appendChild(this.ui.frame);
  };

  Portrait.prototype.hide = function () {
    var img = this.ui.frame.querySelector('img').remove();
    this.viewedPics.push(img);
    document.querySelector(this.selector).removeChild(this.ui.frame);
  };

  window.JWLB.View.Portrait = Portrait;

})(window);
