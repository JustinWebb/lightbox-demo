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
}());;/* 
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
  var makeRequest = function (url, handler) {
      var onFailure = handler.onFailure || reportError;
      var onSuccess = handler.onSuccess || null;
      var request = new XMLHttpRequest();
      request.onload = function () {
        var rt = null;
        if (request.status >= 200 && request.status < 400) {
          rt = request.responseText;
          rt = rt.substr(0, rt.length - 1).replace('jsonFlickrApi(','');
          rt = JSON.parse(rt);
          onSuccess(rt);
        }
      };
      request.onerror = onFailure || reportError;
      request.open('GET', url, true);
      request.send();
  };


  var FlickrService = {

    getSizes: function (options, handler) {
      var url = generateArgs('getSizes', options);
      makeRequest(url, handler);
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
* @Date:   2015-09-20 22:09:35
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-24 13:59:51
*/
(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.View = window.JWLB.View || {};

  var _vm = {
    selector: null,
    ui: {
      form: null,
      input: null,
      button: null
    }
  };

  var initUI = function () {
    var isUIValid = false;
    var comp = document.querySelector(_vm.selector);

    _vm.ui.form = comp.querySelector('form');
    _vm.ui.input = comp.querySelector('form input[type=search]');
    _vm.ui.button = comp.querySelector('form button[type=submit]');

    if (_vm.ui.form && _vm.ui.input && _vm.ui.button) {
      isUIValid = true;

      // set state for form elements
      _vm.ui.input.value = '';
      // _vm.ui.input.setAttribute('required', true);
      // _vm.ui.input.setAttribute('pattern', /^[a-z\d\-_\s]+$/i);
      _vm.ui.button.disabled = true;
    }
    return isUIValid;
  };

  var validateInput = function () {
    // var data = null;
    // if (_vm.ui.input.validity.patternMismatch) {
    //   data = _vm.ui.input.value;
    // }
    // return data;
    return _vm.ui.input.value;
  };

  var dispatchSearchEvent = function (query) {
    var se = null;
    if (window.CustomEvent) {
      se = new CustomEvent('search', {
        bubbles: true,
        cancelable: true,
        detail: {query: query}
      });
    } else {
      se = document.createEvent('search', true, true, {query: query});
    }
    _vm.ui.form.dispatchEvent(se);
  };

  var SearchForm = function (domId) {
    _vm.selector = domId;
    try {
      if (!initUI()) {
        var msg = 'DOM is malformed. Refer to SearchForm \'initUI\' method.';
        console.log(new ReferenceError(msg).stack);
      } else {
        // User enters data in search box
        // var inputEvents = 'propertychange change click keyup input paste';
        _vm.ui.input.addEventListener('input', function (event) {
          _vm.ui.button.disabled = (_vm.ui.input.value === '') ? true : false;
        });

        _vm.ui.input.addEventListener('keypress', function (event) {
          var e = event || window.event;
          var code = e.which || e.keycode;
          if (code === 13) {
            event.preventDefault();
            var query = validateInput();
            if (query) {
              dispatchSearchEvent(query);
            } else {
              // TODO: provide user feedback for bad query
              console.log('SearchForm: input is bad!');
          }          }
        });

        // User sends query
        _vm.ui.form.addEventListener('submit', function (event) {
          event.preventDefault();
          var query = validateInput();
          if (query) {
            dispatchSearchEvent(query);
          } else {
            // TODO: provide user feedback for bad query
            console.log('SearchForm: input is bad!');
          }
        });
      }
    } catch (e) {
      console.log('SearchForm: ', e);
    }
  };

  window.JWLB.checkForm = function (e) {
    console.log('Check: ', e);
    return false;
  };

  window.JWLB.View.SearchForm = SearchForm;
})(window);