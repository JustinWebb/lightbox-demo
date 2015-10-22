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
    var ui = this.ui;
    if (ui.input.value === '') {
      ui.searchBtn.disabled = true;
      this.addClass(ui.closeBtn, 'hidden');
    } else {
      ui.searchBtn.disabled = false;
      this.removeClass(ui.closeBtn, 'hidden');
    }
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
        console.log(this.name +' input is bad!');
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

  var closeButtonOnClick = function (event) {
    var sf = null;
    if (!this.isSearchMode) {
      toggleFieldsetVisibility(this);
    }
    resetSearch(this);
  };

  //--------------------------------------------------------------------
  // View overrides
  //--------------------------------------------------------------------
  var addUIListeners = function () {
    this.ui.input.addEventListener('input', inputOnInput.bind(this));
    this.ui.input.addEventListener('keypress', inputOnKeypress.bind(this));
    this.ui.form.addEventListener('submit', formOnSubmit.bind(this));
    this.ui.closeBtn.addEventListener('click', closeButtonOnClick.bind(this));
    this.ui.clearBtn.addEventListener('click', closeButtonOnClick.bind(this));
  };

  var initUI = function () {
    var isUIValid = false;
    var elem = document.querySelector(this.selector);
    var ui = this.ui;

    ui.form = elem.querySelector('form');
    ui.input = elem.querySelector('form input[type=search]');
    ui.searchBtn = elem.querySelector('button[name=search]');
    ui.closeBtn = elem.querySelector('button[name=close]');
    ui.clearBtn = elem.querySelector('button[name=clear]');

    if (ui.form && ui.input && ui.searchBtn && ui.closeBtn) {
      isUIValid = true;
      var results = this.element().querySelector('fieldset[name=results]');

      // set state for form elements
      ui.input.value = '';
      // TODO: Improve validation
      // ui.input.setAttribute('required', true);
      // ui.input.setAttribute('pattern', /^[a-z\d\-_\s]+$/i);
      ui.searchBtn.disabled = true;
      this.addClass(ui.closeBtn, 'hidden');
      this.addClass(results, 'hidden');
      this.isSearchMode = true;
    }
    return isUIValid;
  };

  //--------------------------------------------------------------------
  // Helper methods
  //--------------------------------------------------------------------
  var resetSearch = function (searchForm) {
    searchForm.ui.input.value = '';
    searchForm.addClass(searchForm.ui.closeBtn, 'hidden');
    searchForm.ui.input.focus();
  };

  var toggleFieldsetVisibility = function (searchForm) {
    var sf = searchForm;
    var vizName = (sf.isSearchMode) ? 'query' : 'results';
    var invizName = (vizName === 'query') ? 'results' : 'query';
    var el = sf.element();
    sf.addClass(el.querySelector('fieldset[name='+ vizName +']'), 'hidden');
    sf.removeClass(el.querySelector('fieldset[name='+ invizName +']'), 'hidden');
    sf.isSearchMode = !sf.isSearchMode;
  };

  //--------------------------------------------------------------------
  // Constructor
  //--------------------------------------------------------------------
  var SearchForm = function (domId) {
    // Overriden View class methods
    this.initUI = initUI;
    this.addUIListeners = addUIListeners;
    this.name = 'SearchForm';
    this.isSearchMode = null;

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

  SearchForm.prototype.displayResults = function (results) {
    var sf = this.element();
    var pageStats = (results.pages != 0) ? results.page +'/'+ results.pages : 0;
    var viewing = (results.total < results.perpage) ?
      results.total : results.perpage;
    sf.querySelector('input[name=pages]').value = pageStats;
    sf.querySelector('input[name=viewing]').value = viewing;
    sf.querySelector('input[name=total]').value = results.total;

    toggleFieldsetVisibility(this);

  };

  window.JWLB.View.SearchForm = SearchForm;
})(window);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnNvbGUuanMiLCJ2aWV3LmpzIiwibW9kZWwvZmxpY2tyLXNlcnZpY2UuanMiLCJ2aWV3L2dhbGxlcnkuanMiLCJ2aWV3L3BvcnRyYWl0LmpzIiwidmlldy9zZWFyY2gtZm9ybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1DL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJoZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4qIEBBdXRob3I6IGp1c3RpbndlYmJcbiogQERhdGU6ICAgMjAxNS0wOS0yMCAxNDo1MjozOVxuKiBATGFzdCBNb2RpZmllZCBieTogICBqdXN0aW53ZWJiXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTUtMDktMjAgMTU6MzM6MjBcbiovXG5cblxuXG4vLyBBdm9pZCBgY29uc29sZWAgZXJyb3JzIGluIGJyb3dzZXJzIHRoYXQgbGFjayBhIGNvbnNvbGUuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBtZXRob2Q7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB2YXIgbWV0aG9kcyA9IFtcbiAgICAgICAgJ2Fzc2VydCcsICdjbGVhcicsICdjb3VudCcsICdkZWJ1ZycsICdkaXInLCAnZGlyeG1sJywgJ2Vycm9yJyxcbiAgICAgICAgJ2V4Y2VwdGlvbicsICdncm91cCcsICdncm91cENvbGxhcHNlZCcsICdncm91cEVuZCcsICdpbmZvJywgJ2xvZycsXG4gICAgICAgICdtYXJrVGltZWxpbmUnLCAncHJvZmlsZScsICdwcm9maWxlRW5kJywgJ3RhYmxlJywgJ3RpbWUnLCAndGltZUVuZCcsXG4gICAgICAgICd0aW1lbGluZScsICd0aW1lbGluZUVuZCcsICd0aW1lU3RhbXAnLCAndHJhY2UnLCAnd2FybidcbiAgICBdO1xuICAgIHZhciBsZW5ndGggPSBtZXRob2RzLmxlbmd0aDtcbiAgICB2YXIgY29uc29sZSA9ICh3aW5kb3cuY29uc29sZSA9IHdpbmRvdy5jb25zb2xlIHx8IHt9KTtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBtZXRob2QgPSBtZXRob2RzW2xlbmd0aF07XG5cbiAgICAgICAgLy8gT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxuICAgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kXSkge1xuICAgICAgICAgICAgY29uc29sZVttZXRob2RdID0gbm9vcDtcbiAgICAgICAgfVxuICAgIH1cbn0oKSk7IiwiKGZ1bmN0aW9uICh3aW5kb3cpIHtcblxuICB3aW5kb3cuSldMQiA9IHdpbmRvdy5KV0xCIHx8IHt9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29uc3RydWN0b3JcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB2YXIgVmlldyA9IGZ1bmN0aW9uIChkb21JZCkge1xuICAgIHZhciBtc2cgPSAnJztcbiAgICB0aGlzLnNlbGVjdG9yID0gZG9tSWQgfHwgJ2JvZHknO1xuICAgIHRoaXMudWkgPSB7fTtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm5hbWUgfHwgJ1ZpZXcnO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBvdmVycmlkZW4gVUkgYnVpbGQgbWV0aG9kXG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5pbml0VUkodGhpcy5zZWxlY3RvcikpIHtcbiAgICAgICAgbXNnID0gJ0RPTSBpcyBtYWxmb3JtZWQuIFJlZmVyIHRvICcrIHRoaXMubmFtZVxuICAgICAgICArJyBcXCdpbml0VUlcXCcgbWV0aG9kLic7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ldyBSZWZlcmVuY2VFcnJvcihtc2cpLnN0YWNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnVpKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBtc2cgPSB0aGlzLm5hbWUgKycgXFwnaW5pdFVJXFwnIG1ldGhvZCBmYWlsZWQgdG8gY3JlYXRlICdcbiAgICAgICAgICArJ2VsZW1lbnRzIG9uIHRoZSBWaWV3LnVpIHByb3BlcnR5LidcbiAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgVHlwZUVycm9yKG1zZykpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkVUlMaXN0ZW5lcnMoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIGUpO1xuICAgIH1cbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEluaGVyaXRhbmNlIChCYXNlIENsYXNzKVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIFZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG4gIFZpZXcucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVmlldztcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFic3RyYWN0IG1ldGhvZHNcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBWaWV3LnByb3RvdHlwZS5pbml0VUkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1zZyA9ICdWaWV3IGlzIGFic3RyYWN0IGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLiBPdmVycmlkZScrXG4gICAgJ1xcJ2luaXRVSVxcJyBtZXRob2QgaW4gVmlldyBzdWJjbGFzcy4nO1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihtc2cpO1xuICB9O1xuXG4gIFZpZXcucHJvdG90eXBlLmFkZFVJTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtc2cgPSAnVmlldyBpcyBhYnN0cmFjdCBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4gT3ZlcnJpZGUnK1xuICAgICdcXCdhZGRVSUxpc3RlbmVyc1xcJyBtZXRob2QgaW4gVmlldyBzdWJjbGFzcy4nO1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihtc2cpO1xuICB9O1xuXG4gIFZpZXcucHJvdG90eXBlLnNlbmRFdmVudCA9IGZ1bmN0aW9uICh0eXBlLCBkYXRhKSB7XG4gICAgdmFyIHNlID0gbnVsbDtcbiAgICB2YXIgZGV0YWlsID0gbnVsbDtcblxuICAgIC8vIFNldCBkZXRhaWwgb2JqZWN0IGZvciBnaXZlbiBjdXN0b20gZXZlbnRcbiAgICBpZiAodHlwZSA9PT0gJ3NlYXJjaCcpIHtkZXRhaWwgPSB7cXVlcnk6IGRhdGF9O31cbiAgICBpZiAodHlwZSA9PT0gJ2dhbGxlcnknKSB7ZGV0YWlsID0ge3BvcnRyYWl0OiBkYXRhfTt9XG5cbiAgICAvLyBEaXNwYXRjaCBjdXN0b20gZXZlbnQgZnJvbSBjb21wb25lbnQgZWxlbWVudFxuICAgIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNlID0gbmV3IHdpbmRvdy5DdXN0b21FdmVudCh0eXBlLCB7XG4gICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgIGRldGFpbDogZGV0YWlsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgICBzZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgdHJ1ZSwgdHJ1ZSwgZGV0YWlsKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCh0eXBlLCB0cnVlLCB0cnVlLCBkZXRhaWwpO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQoKS5kaXNwYXRjaEV2ZW50KHNlKTtcbiAgfTtcblxuICBWaWV3LnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XG4gICAgfVxuICB9O1xuXG4gIFZpZXcucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NOYW1lLCAnJykucmVwbGFjZSgvXFxzXFxzLywgL1xccy8pO1xuICAgIH1cbiAgfTtcblxuICBWaWV3LnByb3RvdHlwZS5lbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3IpO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRXhwb3J0IGJhc2UgY2xhc3NcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB3aW5kb3cuSldMQi5WaWV3ID0gVmlldztcbn0pKHdpbmRvdylcbiIsIi8qXG4qIEBBdXRob3I6IGp1c3RpbndlYmJcbiogQERhdGU6ICAgMjAxNS0wOS0yMCAxNToyNDoyMVxuKiBATGFzdCBNb2RpZmllZCBieTogICBqdXN0aW53ZWJiXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTUtMDktMjQgMTk6MDA6MDVcbiovXG5cbihmdW5jdGlvbiAod2luZG93KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB3aW5kb3cuSldMQiA9IHdpbmRvdy5KV0xCIHx8IHt9O1xuICB3aW5kb3cuSldMQi5Nb2RlbCA9IHdpbmRvdy5KV0xCLk1vZGVsIHx8IHt9O1xuXG4gIHZhciBfYXBpID0gJ2h0dHBzOi8vYXBpLmZsaWNrci5jb20vc2VydmljZXMvcmVzdC8/JztcbiAgdmFyIF9tZXRob2QgPSB7XG4gICAgc2VhcmNoOiAnbWV0aG9kPWZsaWNrci5waG90b3Muc2VhcmNoJyxcbiAgICBnZXRTaXplczogJ21ldGhvZD1mbGlja3IucGhvdG9zLmdldFNpemVzJyxcbiAgICBnZXRJbmZvOiAnbWV0aG9kPWZsaWNrci5waG90b3MuZ2V0SW5mbydcbiAgfTtcbiAgdmFyIF9rZXkgPSAnYXBpX2tleT04ZmNhZjc4NGU4N2ZkZDAwMTU4M2NmMDU1OTdhMDk0NSc7XG4gIHZhciBfZm9ybWF0ID0gJ2Zvcm1hdD1qc29uJztcblxuICAvKipcbiAgICogT3V0cHV0IGVycm9yIG9iamVjdCB0byBjb25zb2xlXG4gICAqIEBwYXJhbSAge0Vycm9yfSBvYmplY3QgYXBwZWFyaW5nIGluIGNvbnNvbGVcbiAgICovXG4gIHZhciByZXBvcnRFcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICBjb25zb2xlLmxvZygnRmxpY2tyU2VydmljZTonLCBlcnIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSByZXF1ZXN0IHVybCBmb3IgRmxpY2tyIEFQSVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHF1ZXJ5VHlwZSBuYW1lIG9mIEZsaWNrciBBUEkgbWV0aG9kXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyAgIEZsaWNrciBBUEkgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICBVUkwgd2l0aCBxdWVyeXN0cmluZyBwYXJhbXNcbiAgICovXG4gIHZhciBnZW5lcmF0ZUFyZ3MgPSBmdW5jdGlvbiAocXVlcnlUeXBlLCBvcHRpb25zKSB7XG4gICAgdmFyIGFyZ3MgPSBbX2tleSwgX2Zvcm1hdF07XG4gICAgaWYgKHF1ZXJ5VHlwZSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgIGFyZ3MucHVzaChfbWV0aG9kLnNlYXJjaCk7XG4gICAgICBhcmdzLnB1c2goJ3RleHQ9JysgKG9wdGlvbnMudGV4dCB8fCAnY2hvY29sYXRlJykpO1xuICAgICAgYXJncy5wdXNoKCdwZXJfcGFnZT0nKyAob3B0aW9ucy5wZXJQYWdlIHx8IDUwKSk7XG4gICAgfVxuXG4gICAgaWYgKHF1ZXJ5VHlwZSA9PT0gJ2dldFNpemVzJykge1xuICAgICAgYXJncy5wdXNoKF9tZXRob2QuZ2V0U2l6ZXMpO1xuICAgICAgYXJncy5wdXNoKCdwaG90b19pZD0nKyBvcHRpb25zLmlkKTtcbiAgICB9XG5cbiAgICBpZiAocXVlcnlUeXBlID09PSAnZ2V0SW5mbycpIHtcbiAgICAgIGFyZ3MucHVzaChfbWV0aG9kLmdldEluZm8pO1xuICAgICAgYXJncy5wdXNoKCdwaG90b19pZD0nKyBvcHRpb25zLmlkKTtcbiAgICAgIGFyZ3MucHVzaCgnc2VjcmV0PScrIG9wdGlvbnMuc2VjcmV0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2FwaS5jb25jYXQoYXJncy5qb2luKCcmJykpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZW5kIEFKQVggcmVxdWVzdCB0byBGbGlja3IgQVBJIGFuZCBwYXJzZSByZXNwb25zZVxuICAgKiB0byBKU09OLlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHVybCAgICAgVVJMIHdpdGggcXVlcnlzdHJpbmcgcGFyYW1zXG4gICAqIEBwYXJhbSAge09iamVjdH0gaGFuZGxlciBjYWxsYmFja3MgZm9yIHN1Y2Nlc3MgYW5kIGZhaWx1cmVcbiAgICovXG4gIHZhciBtYWtlUmVxdWVzdCA9IGZ1bmN0aW9uICh1cmwsIGhhbmRsZXIsIGlkKSB7XG4gICAgICB2YXIgb25GYWlsdXJlID0gaGFuZGxlci5vbkZhaWx1cmUgfHwgcmVwb3J0RXJyb3I7XG4gICAgICB2YXIgb25TdWNjZXNzID0gaGFuZGxlci5vblN1Y2Nlc3MgfHwgbnVsbDtcbiAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJ0ID0gbnVsbDtcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID49IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgIHJ0ID0gcmVxdWVzdC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgcnQgPSBydC5zdWJzdHIoMCwgcnQubGVuZ3RoIC0gMSkucmVwbGFjZSgnanNvbkZsaWNrckFwaSgnLCcnKTtcbiAgICAgICAgICBydCA9IEpTT04ucGFyc2UocnQpO1xuICAgICAgICAgIG9uU3VjY2VzcyhydCwgaWQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxdWVzdC5vbmVycm9yID0gb25GYWlsdXJlIHx8IHJlcG9ydEVycm9yO1xuICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gIH07XG5cblxuICB2YXIgRmxpY2tyU2VydmljZSA9IHtcblxuICAgIGdldFNpemVzOiBmdW5jdGlvbiAob3B0aW9ucywgaGFuZGxlcikge1xuICAgICAgdmFyIHVybCA9IGdlbmVyYXRlQXJncygnZ2V0U2l6ZXMnLCBvcHRpb25zKTtcbiAgICAgIG1ha2VSZXF1ZXN0KHVybCwgaGFuZGxlciwgb3B0aW9ucy5pZCk7XG4gICAgfSxcblxuICAgIGdldEluZm86IGZ1bmN0aW9uIChvcHRpb25zLCBoYW5kbGVyKSB7XG4gICAgICB2YXIgdXJsID0gZ2VuZXJhdGVBcmdzKCdnZXRJbmZvJywgb3B0aW9ucyk7XG4gICAgICBtYWtlUmVxdWVzdCh1cmwsIGhhbmRsZXIpO1xuICAgIH0sXG5cbiAgICBzZWFyY2g6IGZ1bmN0aW9uIChvcHRpb25zLCBoYW5kbGVyKSB7XG4gICAgICB2YXIgdXJsID0gZ2VuZXJhdGVBcmdzKCdzZWFyY2gnLCBvcHRpb25zKTtcbiAgICAgIGlmIChoYW5kbGVyLm9uU3VjY2VzcyA9PT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZygnRmxpY2tyU2VydmljZTonLCB1cmwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFrZVJlcXVlc3QodXJsLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgd2luZG93LkpXTEIuTW9kZWwuRmxpY2tyU2VydmljZSA9IEZsaWNrclNlcnZpY2U7XG5cbn0pKHdpbmRvdyk7XG4iLCIvKlxuKiBAQXV0aG9yOiBqdXN0aW53ZWJiXG4qIEBEYXRlOiAgIDIwMTUtMDktMjQgMjE6MDg6MjNcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAganVzdGlud2ViYlxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE1LTA5LTI0IDIyOjE5OjQ1XG4qL1xuKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHdpbmRvdy5KV0xCID0gd2luZG93LkpXTEIgfHwge307XG4gIHdpbmRvdy5KV0xCLlZpZXcgPSB3aW5kb3cuSldMQi5WaWV3IHx8IHt9O1xuXG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFdmVudCBoYW5kbGluZ1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHZhciB3YWxsT25DbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbWcnKSB7XG4gICAgICB2YXIgaWQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5kYXRhc2V0LmlkO1xuICAgICAgdmFyIHNlbGVjdGVkUGhvdG8gPSB0aGlzLnBob3Rvcy5maWx0ZXIoZnVuY3Rpb24gKHBob3RvKSB7XG4gICAgICAgIGlmIChwaG90by5pZCA9PT0gaWQpIHtcbiAgICAgICAgICBwaG90by5wb3J0cmFpdC5pZCA9IGlkO1xuICAgICAgICAgIHJldHVybiBwaG90bztcbiAgICAgICAgfVxuICAgICAgfSlbMF07XG4gICAgICB0aGlzLnNlbmRFdmVudCgnZ2FsbGVyeScsIHNlbGVjdGVkUGhvdG8ucG9ydHJhaXQpO1xuICAgIH1cbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFZpZXcgb3ZlcnJpZGVzXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgdmFyIGFkZFVJTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudWkud2FsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHdhbGxPbkNsaWNrLmJpbmQodGhpcykpO1xuICB9O1xuXG4gIHZhciBpbml0VUkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlzVUlWYWxpZCA9IGZhbHNlO1xuICAgIHZhciBjb21wID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yKTtcblxuICAgIHRoaXMudWkud2FsbCA9IGNvbXA7XG5cbiAgICBpZiAodGhpcy51aS53YWxsKSB7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICBpc1VJVmFsaWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBpc1VJVmFsaWQ7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb25zdHJ1Y3RvclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHZhciBHYWxsZXJ5ID0gZnVuY3Rpb24gKGRvbUlkKSB7XG4gICAgLy8gT3ZlcnJpZGVuIFZpZXcgY2xhc3MgbWV0aG9kc1xuICAgIHRoaXMuaW5pdFVJID0gaW5pdFVJO1xuICAgIHRoaXMuYWRkVUlMaXN0ZW5lcnMgPSBhZGRVSUxpc3RlbmVycztcbiAgICB0aGlzLm5hbWUgPSAnR2FsbGVyeSc7XG5cbiAgICAvLyBJbnN0YW5jZSBwcm9wZXJ0aWVzXG4gICAgdGhpcy5waG90b3MgPSBbXTtcblxuICAgIC8vIEluaXRpYWxpemUgVmlld1xuICAgIEpXTEIuVmlldy5jYWxsKHRoaXMsIGRvbUlkKTtcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEluaGVyaXRhbmNlXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgR2FsbGVyeS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEpXTEIuVmlldy5wcm90b3R5cGUpO1xuICBHYWxsZXJ5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdhbGxlcnk7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbnN0YW5jZSBtZXRob2RzXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBHYWxsZXJ5LnByb3RvdHlwZS5hZGRUaHVtYiA9IGZ1bmN0aW9uIChkYXRhLCBpZCkge1xuICAgIC8vIFN0b3JlIGltYWdlIGRhdGEgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICB2YXIgcGhvdG8gPSB7XG4gICAgICBpZDogaWQsXG4gICAgICB0aHVtYjogbnVsbCxcbiAgICAgIHBvcnRyYWl0OiBkYXRhLnNpemVbMF1cbiAgICB9O1xuICAgIGRhdGEuc2l6ZS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICBpZiAoZWxlbS5sYWJlbCA9PT0gJ1NxdWFyZScpIHtcbiAgICAgICAgcGhvdG8udGh1bWIgPSBlbGVtO1xuICAgICAgfVxuICAgICAgaWYgKGVsZW0uaGVpZ2h0ID4gcGhvdG8ucG9ydHJhaXQuaGVpZ2h0KSB7XG4gICAgICAgIHBob3RvLnBvcnRyYWl0ID0gZWxlbTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnBob3Rvcy5wdXNoKHBob3RvKTtcblxuICAgIC8vIEJ1aWxkIHRodW1ibmFpbCBVSVxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBpZCk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RodW1iJyk7XG4gICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIHBob3RvLnRodW1iLnNvdXJjZSk7XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnaWQ6ICcrIGlkKTtcbiAgICBub2RlLmFwcGVuZENoaWxkKGltZyk7XG4gICAgdGhpcy51aS53YWxsLnF1ZXJ5U2VsZWN0b3IoJ2FydGljbGVbbmFtZT1mb29iYXJdJykuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH07XG5cbiAgR2FsbGVyeS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudWkud2FsbC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgYXJ0aWNsZSA9IHRoaXMudWkud2FsbC5jaGlsZHJlbi5pdGVtKDApXG4gICAgICBhcnRpY2xlLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoYXJ0aWNsZSk7XG4gICAgfVxuICAgIHZhciBhcnRpY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXJ0aWNsZScpO1xuICAgIGFydGljbGUuc2V0QXR0cmlidXRlKCduYW1lJywgJ2Zvb2JhcicpO1xuICAgIHRoaXMudWkud2FsbC5hcHBlbmRDaGlsZChhcnRpY2xlKTtcbiAgfTtcblxuICB3aW5kb3cuSldMQi5WaWV3LkdhbGxlcnkgPSBHYWxsZXJ5O1xufSkod2luZG93KTtcbiIsIihmdW5jdGlvbiAod2luZG93KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB3aW5kb3cuSldMQiA9IHdpbmRvdy5KV0xCIHx8IHt9O1xuICB3aW5kb3cuSldMQi5WaWV3ID0gd2luZG93LkpXTEIuVmlldyB8fCB7fTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEV2ZW50IGhhbmRsaW5nXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgdmFyIGRvU29tZXRoaW5nID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcy51aS5wb3J0cmFpdCkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgZXZlbnQudGFyZ2V0KTtcbiAgICB9XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBWaWV3IE92ZXJyaWRlc1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHZhciBhZGRVSUxpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnVpLnBvcnRyYWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZG9Tb21ldGhpbmcuYmluZCh0aGlzKSk7XG4gIH1cblxuICB2YXIgaW5pdFVJID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpc1VJVmFsaWQgPSBmYWxzZTtcbiAgICB2YXIgY29tcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlY3Rpb24nKTtcbiAgICBjb21wLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncG9ydHJhaXQnKTtcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnZGF0YScsICdjYW52YXMnKTtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjYW52YXMnKTtcbiAgICBjb21wLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgdGhpcy51aS5wb3J0cmFpdCA9IGNvbXA7XG5cbiAgICBpZiAodGhpcy51aS5wb3J0cmFpdCkge1xuICAgICAgX3ZtLmNhbnZhc1NlbGVjdG9yID0gJ3NlY3Rpb24ucG9ydHJhaXQgPiBkaXZbZGF0YT1jYW52YXNdJztcbiAgICAgIGlzVUlWYWxpZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzVUlWYWxpZDtcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByaXZhdGUgbWV0aG9kc1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHZhciBpbWdDZW50ZXJDYW52YXNPblNjcmVlbiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBjYW52YXMgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcbiAgICBjYW52YXMuc3R5bGUubWFyZ2luTGVmdCA9IChjYW52YXMub2Zmc2V0V2lkdGggLyAyICogLTEpICsncHgnO1xuICAgIGNhbnZhcy5zdHlsZS5tYXJnaW5Ub3AgPSAoY2FudmFzLm9mZnNldEhlaWdodCAvIDIgKiAtMSkgKydweCc7XG4gICAgY29uc29sZS5sb2coY2FudmFzKTtcbiAgfTtcblxuICB2YXIgY2xlYW5VcEltYWdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF92bS5jYW52YXNTZWxlY3Rvcik7XG4gICAgdmFyIGltZyA9IGNhbnZhcy5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICBpbWcub25sb2FkID0gbnVsbDtcbiAgICBpbWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpbWcpO1xuICB9O1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbnN0cnVjdG9yXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgdmFyIF92bSA9IHtcbiAgICBjYW52YXNTZWxlY3RvcjogbnVsbFxuICB9O1xuICB2YXIgUG9ydHJhaXQgPSBmdW5jdGlvbiAoZG9tSWQpIHtcblxuICAgIHRoaXMuaW5pdFVJID0gaW5pdFVJO1xuICAgIHRoaXMuYWRkVUlMaXN0ZW5lcnMgPSBhZGRVSUxpc3RlbmVycztcbiAgICB0aGlzLm5hbWUgPSAnUG9ydHJhaXQnO1xuXG4gICAgSldMQi5WaWV3LmNhbGwodGhpcywgZG9tSWQpO1xuICB9XG5cbiAgUG9ydHJhaXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShKV0xCLlZpZXcucHJvdG90eXBlKTtcbiAgUG9ydHJhaXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUG9ydHJhaXQ7XG5cbiAgUG9ydHJhaXQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAocGljKSB7XG5cbiAgICAvLyBDcmVhdGUgVUkgYW5kIHByZXBhcmUgcGljIGZvciBkaXNwbGF5XG4gICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIHBpYy5zb3VyY2UpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgcGljLnRpdGxlKTtcbiAgICBpbWcub25sb2FkID0gaW1nQ2VudGVyQ2FudmFzT25TY3JlZW47XG5cbiAgICAvLyBSZW1vdmUgYW55IHByZXZpb3VzIGltYWdlcyBhbmQgZGlzcGxheVxuICAgIHZhciBjYW52YXMgPSB0aGlzLnVpLnBvcnRyYWl0LnF1ZXJ5U2VsZWN0b3IoJ2RpdltkYXRhPWNhbnZhc10nKTtcbiAgICBpZiAoY2FudmFzLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGNsZWFuVXBJbWFnZSgpO1xuICAgIH1cbiAgICBjYW52YXMuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3IpLmFwcGVuZENoaWxkKHRoaXMudWkucG9ydHJhaXQpO1xuICB9O1xuXG4gIFBvcnRyYWl0LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIGNsZWFuVXBJbWFnZSgpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcikucmVtb3ZlQ2hpbGQodGhpcy51aS5wb3J0cmFpdCk7XG4gIH07XG5cbiAgd2luZG93LkpXTEIuVmlldy5Qb3J0cmFpdCA9IFBvcnRyYWl0O1xuXG59KSh3aW5kb3cpO1xuIiwiLypcbiogQEF1dGhvcjoganVzdGlud2ViYlxuKiBARGF0ZTogICAyMDE1LTA5LTIwIDIyOjA5OjM1XG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGp1c3RpbndlYmJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNS0wOS0yNCAxMzo1OTo1MVxuKi9cbihmdW5jdGlvbiAod2luZG93KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB3aW5kb3cuSldMQiA9IHdpbmRvdy5KV0xCIHx8IHt9O1xuICB3aW5kb3cuSldMQi5WaWV3ID0gd2luZG93LkpXTEIuVmlldyB8fCB7fTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEV2ZW50IGhhbmRsaW5nXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgdmFyIGlucHV0T25JbnB1dCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vIFVzZXIgZW50ZXJzIGRhdGEgaW4gc2VhcmNoIGJveFxuICAgIHZhciB1aSA9IHRoaXMudWk7XG4gICAgaWYgKHVpLmlucHV0LnZhbHVlID09PSAnJykge1xuICAgICAgdWkuc2VhcmNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWRkQ2xhc3ModWkuY2xvc2VCdG4sICdoaWRkZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdWkuc2VhcmNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbW92ZUNsYXNzKHVpLmNsb3NlQnRuLCAnaGlkZGVuJyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBpbnB1dE9uS2V5cHJlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAvLyBVc2VyIGhpdHMgRW50ZXIgd2hpbGUgZm9jdXNlZCBvbiBpbnB1dCBlbGVtZW50XG4gICAgdmFyIGUgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgdmFyIGNvZGUgPSBlLndoaWNoIHx8IGUua2V5Y29kZTtcbiAgICBpZiAoY29kZSA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLnZhbGlkYXRlSW5wdXQoKTtcbiAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICB0aGlzLnNlbmRFdmVudCgnc2VhcmNoJywgcXVlcnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogcHJvdmlkZSB1c2VyIGZlZWRiYWNrIGZvciBiYWQgcXVlcnlcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lICsnIGlucHV0IGlzIGJhZCEnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIGZvcm1PblN1Ym1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vIFVzZXIgc2VuZHMgcXVlcnlcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBxdWVyeSA9IHRoaXMudmFsaWRhdGVJbnB1dCgpO1xuICAgIGlmIChxdWVyeSkge1xuICAgICAgdGhpcy5zZW5kRXZlbnQoJ3NlYXJjaCcsIHF1ZXJ5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogcHJvdmlkZSB1c2VyIGZlZWRiYWNrIGZvciBiYWQgcXVlcnlcbiAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hGb3JtOiBpbnB1dCBpcyBiYWQhJyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjbG9zZUJ1dHRvbk9uQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgc2YgPSBudWxsO1xuICAgIGlmICghdGhpcy5pc1NlYXJjaE1vZGUpIHtcbiAgICAgIHRvZ2dsZUZpZWxkc2V0VmlzaWJpbGl0eSh0aGlzKTtcbiAgICB9XG4gICAgcmVzZXRTZWFyY2godGhpcyk7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBWaWV3IG92ZXJyaWRlc1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHZhciBhZGRVSUxpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnVpLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaW5wdXRPbklucHV0LmJpbmQodGhpcykpO1xuICAgIHRoaXMudWkuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBpbnB1dE9uS2V5cHJlc3MuYmluZCh0aGlzKSk7XG4gICAgdGhpcy51aS5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZvcm1PblN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnVpLmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VCdXR0b25PbkNsaWNrLmJpbmQodGhpcykpO1xuICAgIHRoaXMudWkuY2xlYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUJ1dHRvbk9uQ2xpY2suYmluZCh0aGlzKSk7XG4gIH07XG5cbiAgdmFyIGluaXRVSSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNVSVZhbGlkID0gZmFsc2U7XG4gICAgdmFyIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3IpO1xuICAgIHZhciB1aSA9IHRoaXMudWk7XG5cbiAgICB1aS5mb3JtID0gZWxlbS5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgdWkuaW5wdXQgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0gaW5wdXRbdHlwZT1zZWFyY2hdJyk7XG4gICAgdWkuc2VhcmNoQnRuID0gZWxlbS5xdWVyeVNlbGVjdG9yKCdidXR0b25bbmFtZT1zZWFyY2hdJyk7XG4gICAgdWkuY2xvc2VCdG4gPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbltuYW1lPWNsb3NlXScpO1xuICAgIHVpLmNsZWFyQnRuID0gZWxlbS5xdWVyeVNlbGVjdG9yKCdidXR0b25bbmFtZT1jbGVhcl0nKTtcblxuICAgIGlmICh1aS5mb3JtICYmIHVpLmlucHV0ICYmIHVpLnNlYXJjaEJ0biAmJiB1aS5jbG9zZUJ0bikge1xuICAgICAgaXNVSVZhbGlkID0gdHJ1ZTtcbiAgICAgIHZhciByZXN1bHRzID0gdGhpcy5lbGVtZW50KCkucXVlcnlTZWxlY3RvcignZmllbGRzZXRbbmFtZT1yZXN1bHRzXScpO1xuXG4gICAgICAvLyBzZXQgc3RhdGUgZm9yIGZvcm0gZWxlbWVudHNcbiAgICAgIHVpLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAvLyBUT0RPOiBJbXByb3ZlIHZhbGlkYXRpb25cbiAgICAgIC8vIHVpLmlucHV0LnNldEF0dHJpYnV0ZSgncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgIC8vIHVpLmlucHV0LnNldEF0dHJpYnV0ZSgncGF0dGVybicsIC9eW2EtelxcZFxcLV9cXHNdKyQvaSk7XG4gICAgICB1aS5zZWFyY2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5hZGRDbGFzcyh1aS5jbG9zZUJ0biwgJ2hpZGRlbicpO1xuICAgICAgdGhpcy5hZGRDbGFzcyhyZXN1bHRzLCAnaGlkZGVuJyk7XG4gICAgICB0aGlzLmlzU2VhcmNoTW9kZSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpc1VJVmFsaWQ7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXIgbWV0aG9kc1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHZhciByZXNldFNlYXJjaCA9IGZ1bmN0aW9uIChzZWFyY2hGb3JtKSB7XG4gICAgc2VhcmNoRm9ybS51aS5pbnB1dC52YWx1ZSA9ICcnO1xuICAgIHNlYXJjaEZvcm0uYWRkQ2xhc3Moc2VhcmNoRm9ybS51aS5jbG9zZUJ0biwgJ2hpZGRlbicpO1xuICAgIHNlYXJjaEZvcm0udWkuaW5wdXQuZm9jdXMoKTtcbiAgfTtcblxuICB2YXIgdG9nZ2xlRmllbGRzZXRWaXNpYmlsaXR5ID0gZnVuY3Rpb24gKHNlYXJjaEZvcm0pIHtcbiAgICB2YXIgc2YgPSBzZWFyY2hGb3JtO1xuICAgIHZhciB2aXpOYW1lID0gKHNmLmlzU2VhcmNoTW9kZSkgPyAncXVlcnknIDogJ3Jlc3VsdHMnO1xuICAgIHZhciBpbnZpek5hbWUgPSAodml6TmFtZSA9PT0gJ3F1ZXJ5JykgPyAncmVzdWx0cycgOiAncXVlcnknO1xuICAgIHZhciBlbCA9IHNmLmVsZW1lbnQoKTtcbiAgICBzZi5hZGRDbGFzcyhlbC5xdWVyeVNlbGVjdG9yKCdmaWVsZHNldFtuYW1lPScrIHZpek5hbWUgKyddJyksICdoaWRkZW4nKTtcbiAgICBzZi5yZW1vdmVDbGFzcyhlbC5xdWVyeVNlbGVjdG9yKCdmaWVsZHNldFtuYW1lPScrIGludml6TmFtZSArJ10nKSwgJ2hpZGRlbicpO1xuICAgIHNmLmlzU2VhcmNoTW9kZSA9ICFzZi5pc1NlYXJjaE1vZGU7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb25zdHJ1Y3RvclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHZhciBTZWFyY2hGb3JtID0gZnVuY3Rpb24gKGRvbUlkKSB7XG4gICAgLy8gT3ZlcnJpZGVuIFZpZXcgY2xhc3MgbWV0aG9kc1xuICAgIHRoaXMuaW5pdFVJID0gaW5pdFVJO1xuICAgIHRoaXMuYWRkVUlMaXN0ZW5lcnMgPSBhZGRVSUxpc3RlbmVycztcbiAgICB0aGlzLm5hbWUgPSAnU2VhcmNoRm9ybSc7XG4gICAgdGhpcy5pc1NlYXJjaE1vZGUgPSBudWxsO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBWaWV3XG4gICAgSldMQi5WaWV3LmNhbGwodGhpcywgZG9tSWQpO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5oZXJpdGFuY2VcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBTZWFyY2hGb3JtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSldMQi5WaWV3LnByb3RvdHlwZSk7XG4gIFNlYXJjaEZvcm0ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VhcmNoRm9ybTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEluc3RhbmNlIG1ldGhvZHNcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBTZWFyY2hGb3JtLnByb3RvdHlwZS52YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIHZhciBkYXRhID0gbnVsbDtcbiAgICAvLyBpZiAodGhpcy51aS5pbnB1dC52YWxpZGl0eS5wYXR0ZXJuTWlzbWF0Y2gpIHtcbiAgICAvLyAgIGRhdGEgPSB0aGlzLnVpLmlucHV0LnZhbHVlO1xuICAgIC8vIH1cbiAgICAvLyByZXR1cm4gZGF0YTtcbiAgICByZXR1cm4gdGhpcy51aS5pbnB1dC52YWx1ZTtcbiAgfTtcblxuICBTZWFyY2hGb3JtLnByb3RvdHlwZS5kaXNwbGF5UmVzdWx0cyA9IGZ1bmN0aW9uIChyZXN1bHRzKSB7XG4gICAgdmFyIHNmID0gdGhpcy5lbGVtZW50KCk7XG4gICAgdmFyIHBhZ2VTdGF0cyA9IChyZXN1bHRzLnBhZ2VzICE9IDApID8gcmVzdWx0cy5wYWdlICsnLycrIHJlc3VsdHMucGFnZXMgOiAwO1xuICAgIHZhciB2aWV3aW5nID0gKHJlc3VsdHMudG90YWwgPCByZXN1bHRzLnBlcnBhZ2UpID9cbiAgICAgIHJlc3VsdHMudG90YWwgOiByZXN1bHRzLnBlcnBhZ2U7XG4gICAgc2YucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1wYWdlc10nKS52YWx1ZSA9IHBhZ2VTdGF0cztcbiAgICBzZi5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPXZpZXdpbmddJykudmFsdWUgPSB2aWV3aW5nO1xuICAgIHNmLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9dG90YWxdJykudmFsdWUgPSByZXN1bHRzLnRvdGFsO1xuXG4gICAgdG9nZ2xlRmllbGRzZXRWaXNpYmlsaXR5KHRoaXMpO1xuXG4gIH07XG5cbiAgd2luZG93LkpXTEIuVmlldy5TZWFyY2hGb3JtID0gU2VhcmNoRm9ybTtcbn0pKHdpbmRvdyk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
