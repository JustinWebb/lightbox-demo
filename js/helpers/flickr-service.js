/* 
* @Author: justinwebb
* @Date:   2015-09-20 15:24:21
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-20 18:23:05
*/

(function (window) {
  'use strict';

  var _api = 'https://api.flickr.com/services/rest/?';
  var _method = 'method=flickr.photos.search';
  var _key = 'api_key=8fcaf784e87fdd001583cf05597a0945';
  var _format = 'format=json';

  var reportError = function (err) {
    console.log('FlickrService:', err);
  };

  var FlickrService = {

    get: function (searchText, onSuccess, onFailure) {
      searchText = searchText || 'chocolate';
      onFailure = onFailure || reportError;
      var args = [_method, _key, _format, 'text='+ searchText];
      var url = _api.concat(args.join('&'));

      if (onSuccess === null) {
        // print URL to the conosle for testing
        console.log('FlickrService:', url);
      } else {
        // Make AJAX request to Flickr API
        var request = new XMLHttpRequest();
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            onSuccess(request.responseText);
          }
        };
        request.onerror = onFailure;
        request.open('GET', url, true);
        request.send();
      }

    }
  };


  window.FlickrService = FlickrService;

})(window);