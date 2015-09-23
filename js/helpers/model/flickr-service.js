/* 
* @Author: justinwebb
* @Date:   2015-09-20 15:24:21
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-23 16:11:12
*/

(function (window) {
  'use strict';

  window.JWLB = window.JWLB || {};
  window.JWLB.Model = window.JWLB.Model || {};

  var _api = 'https://api.flickr.com/services/rest/?';
  var _method = 'method=flickr.photos.search';
  var _key = 'api_key=8fcaf784e87fdd001583cf05597a0945';
  var _format = 'format=json';

  /**
   * Output error object to console
   * @param  {Error} object appearing in console
   */
  var reportError = function (err) {
    console.log('FlickrService:', err);
  };

  var FlickrService = {

    get: function (searchText, options) {
      searchText = searchText || 'chocolate';
      var count = options.count || 50;
      var onFailure = options.onFailure || reportError;
      var onSuccess = options.onSuccess || null;
      var args = [
        _method, 
        _key, 
        _format,
        'text='+ searchText,
        'per_page='+ count
      ];
      var url = _api.concat(args.join('&'));

      if (onSuccess === null) {
        // print URL to the conosle for testing
        console.log('FlickrService:', url);
      } else {
        // Make AJAX request to Flickr API
        var request = new XMLHttpRequest();
        request.onload = function () {
          var rt = null;
          if (request.status >= 200 && request.status < 400) {
            rt = request.responseText;
            rt = rt.substr(0, rt.length - 1).replace('jsonFlickrApi(','');
            rt = JSON.parse(rt);
            onSuccess(rt.photos);
          }
        };
        request.onerror = onFailure;
        request.open('GET', url, true);
        request.send();
      }
    }
  };

  window.JWLB.Model.FlickrService = FlickrService;

})(window);
