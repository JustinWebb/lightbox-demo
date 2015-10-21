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
    canvas.setAttribute('data', 'canvas');
    canvas.setAttribute('class', 'canvas');
    comp.appendChild(canvas);
    this.ui.portrait = comp;

    if (this.ui.portrait) {
      _vm.canvasSelector = 'section.portrait > div[data=canvas]';
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

  var cleanUpImage = function () {
    var canvas = document.querySelector(_vm.canvasSelector);
    var img = canvas.querySelector('img');
    img.onload = null;
    img.parentNode.removeChild(img);
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

    // Create UI and prepare pic for display
    var img = document.createElement('img');
    img.setAttribute('src', pic.source);
    img.setAttribute('title', pic.title);
    img.onload = imgCenterCanvasOnScreen;

    // Remove any previous images and display
    var canvas = this.ui.portrait.querySelector('div[data=canvas]');
    if (canvas.children.length > 0) {
      cleanUpImage();
    }
    canvas.appendChild(img);
    document.querySelector(this.selector).appendChild(this.ui.portrait);
  };

  Portrait.prototype.hide = function () {
    cleanUpImage();
    document.querySelector(this.selector).removeChild(this.ui.portrait);
  };

  window.JWLB.View.Portrait = Portrait;

})(window);
