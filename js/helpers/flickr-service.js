/* 
* @Author: justinwebb
* @Date:   2015-09-20 15:24:21
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-20 17:22:35
*/

(function (window) {
  'use strict';

  var _api = 'https://api.flickr.com/services/rest/?';
  var _method = 'method=flickr.photos.search';
  var _key = 'api_key=8fcaf784e87fdd001583cf05597a0945';
  var _format = 'format=json';

  
  var FlickrService = {

    get: function (searchText) {
      searchText = searchText || 'chocolate';
      var args = [_method, _key, _format, 'text='+ searchText];
      var url = _api.concat(args.join('&'));
      return url;
    }
  };


  window.FlickrService = FlickrService;

})(window);