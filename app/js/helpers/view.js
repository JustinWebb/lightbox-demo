(function (window) {

  window.JWLB = window.JWLB || {};

  //--------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------
  var View = function (domId) {
    var msg = '';
    this.selector = domId || 'body';
    this.ui = {};
    this.name = this.name || 'View';

    // Initialize overriden UI build method
    try {
      if (!this.initUI(this.selector)) {
        msg = 'DOM is malformed. Refer to '+ this.name
        +' \'initUI\' method.';
        console.log(new ReferenceError(msg).stack);
      } else {
        if (Object.keys(this.ui).length === 0) {
          msg = this.name +' \'initUI\' method failed to create '
          +'elements on the View.ui property.'
          console.log(new TypeError(msg));
        }
        this.addUIListeners();
      }
    } catch (e) {
      console.log(this.name, e);
    }
  };

  //--------------------------------------------------------------------
  // Inheritance (Base Class)
  //--------------------------------------------------------------------
  View.prototype = Object.create(View.prototype);
  View.prototype.constructor = View;

  //--------------------------------------------------------------------
  // Abstract methods
  //--------------------------------------------------------------------
  View.prototype.initUI = function () {
    var msg = 'View is abstract and cannot be instantiated. Override'+
    '\'initUI\' method in View subclass.';
    throw new ReferenceError(msg);
  };

  View.prototype.addUIListeners = function () {
    var msg = 'View is abstract and cannot be instantiated. Override'+
    '\'addUIListeners\' method in View subclass.';
    throw new ReferenceError(msg);
  };

  View.prototype.sendEvent = function (type, data) {
    var se = null;
    var detail = null;

    // Set detail object for given custom event
    if (type === 'search') {detail = {query: data};}
    if (type === 'gallery') {detail = {portrait: data};}

    // Dispatch custom event from component element
    if (window.CustomEvent) {
      try {
        se = new window.CustomEvent(type, {
          bubbles: true,
          cancelable: true,
          detail: detail
        });
      } catch (e) {
        se = document.createEvent('CustomEvent');
        se.initCustomEvent(type, true, true, detail);
      }
    } else {
      se = document.createEvent(type, true, true, detail);
    }
    this.element().dispatchEvent(se);
  };

  View.prototype.addClass = function (element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  };

  View.prototype.removeClass = function (element, className) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className.replace(className, '').replace(/\s\s/, /\s/);
    }
  };

  View.prototype.element = function () {
    return document.querySelector(this.selector);
  };

  //--------------------------------------------------------------------
  // Export base class
  //--------------------------------------------------------------------
  window.JWLB.View = View;
})(window)
