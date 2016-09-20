'use strict';

const fs = require('fs');
const jpeg = require('..');

const decoded = jpeg.decode(fs.readFileSync(__dirname + '/DSC05162.JPG'));
console.log(decoded.exif.gps.map);
