'use strict';

const fs = require('fs-extra');
const path = require('path');
const Q = require('q');
const _ = require('lodash');
const methods = {};

/**
 * Read File
 * @param  {String}   file
 * @return {Promise<Object>}
 */
methods.readFile = function (file) {
  var deferred = Q.defer();
  fs.readFile(file.path, 'utf8',
    function (err, data) {
      if (err) {
        return deferred.reject(err);
      }
      return deferred.resolve(data);
    });
  return deferred.promise;
};

methods.checkOrCreatePath = function (dirPath) {
  // var _path = '';
  var paths = dirPath.split('/');
  var uploadsDir = '/';
  for (var i = 0; i < paths.length; i++) {
    // uploadsDir = uploadsDir + '/' + paths[i];
    uploadsDir = path.join(uploadsDir, paths[i]);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
  }
  return uploadsDir;
};

methods.saveToLocal = function (file, dirPath) {
  var now = Date.now();
  var fileName = now + '_' + file.originalFilename.replace(/ /g, '_');
  var safe_input = path.normalize(fileName).replace(/^(\.\.(\/|\\|$))+/, '');
  var newFilePath = path.join(dirPath, safe_input);

  // Save file
  fs.copySync(file.path, newFilePath);
  var fileInfor = {};
  fileInfor.file_name = fileName;
  fileInfor.file_path = path.resolve(newFilePath);
  fileInfor.type = (file.headers && file.headers['content-type']);
  fileInfor.size = file.size;
  return fileInfor;
};

methods.deleteFile = function (filePath, callback) {
  if (!filePath) return;
  var filePathArray = filePath.split('/');
  filePathArray = filePathArray[filePathArray.length - 1];
  var safe_input = path.normalize(filePathArray).replace(/^(\.\.(\/|\\|$))+/, '');
  var url = path.join(__dirname, '../public/images', safe_input);
  var thumbnailUrl = path.join(__dirname, '../public/images/thumbnail', safe_input);
  // Check file minified exists
  if (fs.existsSync(thumbnailUrl)) {
    fs.unlinkSync(thumbnailUrl);
  }
  // Check file exists
  if (!fs.existsSync(url)) return;
  return fs.unlinkSync(url);
};
/**
 * Export the methods.
 * @type {{}}
 */
module.exports = methods;
