/*
 * caminio-media
 *
 * @author quaqua <quaqua@tastenwerk.com>
 * @date 03/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license MIT
 *
 */


var fixtures = require('caminio-fixtures');

fixtures.define('Mediafile', {
  name: 'my_picture.jpg',
  description: 'a picture',
  copyright: 'TASTENWERK',
  license: 'public domain',
  contentType: 'image/jpg',
  size: 32203
});