/* 
* @Author: justinwebb
* @Date:   2015-09-20 14:52:39
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-20 15:33:20
*/



// Avoid `console` errors in browsers that lack a console.
(function() {
    'use strict';
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());;(function (window) {

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
      se = new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: detail
      });
    } else {
      se = document.createEvent(type, true, true, detail);
    }
    this.comp().dispatchEvent(se);
  };

  View.prototype.comp = function () {
    return document.querySelector(this.selector);
  };

  //--------------------------------------------------------------------
  // Export base class
  //--------------------------------------------------------------------
  window.JWLB.View = View;
})(window)
;/*
* @Author: justinwebb
* @Date:   2015-09-20 15:24:21
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-24 19:00:05
*/

(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.Model = window.JWLB.Model || {};

  var _api = 'https://api.flickr.com/services/rest/?';
  var _method = {
    search: 'method=flickr.photos.search',
    getSizes: 'method=flickr.photos.getSizes',
    getInfo: 'method=flickr.photos.getInfo'
  };
  var _key = 'api_key=8fcaf784e87fdd001583cf05597a0945';
  var _format = 'format=json';

  /**
   * Output error object to console
   * @param  {Error} object appearing in console
   */
  var reportError = function (err) {
    console.log('FlickrService:', err);
  };

  /**
   * Create a request url for Flickr API
   * @param  {String} queryType name of Flickr API method
   * @param  {Object} options   Flickr API parameters
   * @return {String}           URL with querystring params
   */
  var generateArgs = function (queryType, options) {
    var args = [_key, _format];
    if (queryType === 'search') {
      args.push(_method.search);
      args.push('text='+ (options.text || 'chocolate'));
      args.push('per_page='+ (options.perPage || 50));
    }

    if (queryType === 'getSizes') {
      args.push(_method.getSizes);
      args.push('photo_id='+ options.id);
    }

    if (queryType === 'getInfo') {
      args.push(_method.getInfo);
      args.push('photo_id='+ options.id);
      args.push('secret='+ options.secret);
    }

    return _api.concat(args.join('&'));
  };

  /**
   * Send AJAX request to Flickr API and parse response
   * to JSON.
   * @param  {String} url     URL with querystring params
   * @param  {Object} handler callbacks for success and failure
   */
  var makeRequest = function (url, handler, id) {
      var onFailure = handler.onFailure || reportError;
      var onSuccess = handler.onSuccess || null;
      var request = new XMLHttpRequest();
      request.onload = function () {
        var rt = null;
        if (request.status >= 200 && request.status < 400) {
          rt = request.responseText;
          rt = rt.substr(0, rt.length - 1).replace('jsonFlickrApi(','');
          rt = JSON.parse(rt);
          onSuccess(rt, id);
        }
      };
      request.onerror = onFailure || reportError;
      request.open('GET', url, true);
      request.send();
  };


  var FlickrService = {

    getSizes: function (options, handler) {
      var url = generateArgs('getSizes', options);
      makeRequest(url, handler, options.id);
    },

    getInfo: function (options, handler) {
      var url = generateArgs('getInfo', options);
      makeRequest(url, handler);
    },

    search: function (options, handler) {
      var url = generateArgs('search', options);
      if (handler.onSuccess === null) {
        console.log('FlickrService:', url);
      } else {
        makeRequest(url, handler);
      }
    }
  };

  window.JWLB.Model.FlickrService = FlickrService;

})(window);
;/*
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
    this.ui.wall.appendChild(node);
  };


  window.JWLB.View.Gallery = Gallery;
})(window);
;(function (window) {
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
;/*
* @Author: justinwebb
* @Date:   2015-09-20 22:09:35
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-24 13:59:51
*/
(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  //--------------------------------------------------------------------
  // Event handling
  //--------------------------------------------------------------------
  var inputOnInput = function (event) {
    // User enters data in search box
    this.ui.button.disabled = (this.ui.input.value === '') ? true : false;
  };

  var inputOnKeypress = function (event) {
    // User hits Enter while focused on input element
    var e = event || window.event;
    var code = e.which || e.keycode;
    if (code === 13) {
      event.preventDefault();
      var query = this.validateInput();
      if (query) {
        this.sendEvent('search', query);
      } else {
        // TODO: provide user feedback for bad query
        console.log('SearchForm: input is bad!');
      }
    }
  };

  var formOnSubmit = function (event) {
    // User sends query
    event.preventDefault();
    var query = this.validateInput();
    if (query) {
      this.sendEvent('search', query);
    } else {
      // TODO: provide user feedback for bad query
      console.log('SearchForm: input is bad!');
    }
  };

  //--------------------------------------------------------------------
  // View overrides
  //--------------------------------------------------------------------
  var addUIListeners = function () {
    this.ui.input.addEventListener('input', inputOnInput.bind(this));
    this.ui.input.addEventListener('keypress', inputOnKeypress.bind(this));
    this.ui.form.addEventListener('submit', formOnSubmit.bind(this));
  };

  var initUI = function () {
    var isUIValid = false;
    var comp = document.querySelector(this.selector);

    this.ui.form = comp.querySelector('form');
    this.ui.input = comp.querySelector('form input[type=search]');
    this.ui.button = comp.querySelector('form button[type=submit]');

    if (this.ui.form && this.ui.input && this.ui.button) {
      isUIValid = true;

      // set state for form elements
      this.ui.input.value = '';
      // this.ui.input.setAttribute('required', true);
      // this.ui.input.setAttribute('pattern', /^[a-z\d\-_\s]+$/i);
      this.ui.button.disabled = true;
    }
    return isUIValid;
  };

  //--------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------
  var SearchForm = function (domId) {
    // Overriden View class methods
    this.initUI = initUI;
    this.addUIListeners = addUIListeners;
    this.name = 'SearchForm';

    // Initialize View
    JWLB.View.call(this, domId);
  };

  //--------------------------------------------------------------------
  // Inheritance
  //--------------------------------------------------------------------
  SearchForm.prototype = Object.create(JWLB.View.prototype);
  SearchForm.prototype.constructor = SearchForm;

  //--------------------------------------------------------------------
  // Instance methods
  //--------------------------------------------------------------------
  SearchForm.prototype.validateInput = function () {
    // var data = null;
    // if (this.ui.input.validity.patternMismatch) {
    //   data = this.ui.input.value;
    // }
    // return data;
    return this.ui.input.value;
  };

  window.JWLB.View.SearchForm = SearchForm;
})(window);