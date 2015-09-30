(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  //--------------------------------------------------------------------
  // Event handling
  //--------------------------------------------------------------------
  var doSomething = function (event) {
    event.stopImmediatePropagation();
    if (event.target === this.ui.portrait) {
      this.hide();
    } else {
      console.log(this.name, event.target);
    }
  };

  //--------------------------------------------------------------------
  // View Overrides
  //--------------------------------------------------------------------
  var addUIListeners = function () {
    this.ui.portrait.addEventListener('click', doSomething.bind(this));
  }

  var initUI = function () {
    var isUIValid = false;
    var comp = document.createElement('section');
    comp.setAttribute('class', 'portrait');
    var canvas = document.createElement('div');
    canvas.setAttribute('class', 'canvas');
    comp.appendChild(canvas);
    this.ui.portrait = comp;

    if (this.ui.portrait) {
      _vm.canvasSelector = 'section.portrait > .canvas';
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
    canvasSelector: null
  };
  var Portrait = function (domId) {

    this.initUI = initUI;
    this.addUIListeners = addUIListeners;
    this.name = 'Portrait';

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
    this.ui.portrait.querySelector('.canvas').appendChild(img);
    document.querySelector(this.selector).appendChild(this.ui.portrait);
  };

  Portrait.prototype.hide = function () {
    var img = this.ui.portrait.querySelector('img');
    img.onload = null;
    img.remove();
    document.querySelector(this.selector).removeChild(this.ui.portrait);
  };

  window.JWLB.View.Portrait = Portrait;

})(window);
