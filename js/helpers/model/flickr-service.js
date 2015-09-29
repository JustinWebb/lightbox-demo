/*
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
