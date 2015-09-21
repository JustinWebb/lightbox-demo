/* 
* @Author: justinwebb
* @Date:   2015-09-20 14:37:46
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-20 18:17:59
* @Purpose: Demonstrate the following:
* -- The ability to access to a public API and successfully retrieve 
* data from it;
* -- The ability to display that data on a page using only native 
* JavaScript (no libraries); and
* -- The ability to update the UI of a page without refreshing the page.
*/


(function (FS) {
  'use strict';

  var printJSON = function (data) {
    console.log('Main: ', data);
  };

  FS.get('chocolate', printJSON);
  
})(window.FlickrService);