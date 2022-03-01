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

methods.uploadFile = function (req, res) {
  var fileType = req.query.fileType;
  var form = new multiparty.Form();
  var uploadDir = path.join(__dirname, '..', config.uploadFolder); // config.uploadFolder;
  form.on('error', function (err) {
    return responseHelper.handleError(res, err);
  });

  form.on('file', function (name, file) {
    let logFile;
    // Save file to local
    var typeFolder = path.normalize(fileType).replace(/^(\.\.(\/|\\|$))+/, '');
    try {

      let dirPath = path.join(uploadDir, 'historical-files-upload', typeFolder);
      dirPath = path.resolve(dirPath);
      dirPath = fileService.checkOrCreatePath(dirPath);
      logFile = fileService.saveToLocal(file, dirPath);
    } catch (ex) {
      return responseHelper.handleError(res, ex);
    }
    if (!logFile) {
      return responseHelper.handleError(res, {});
    }
    logFile.file_url = config.hostName + path.join('/historical-files-upload', typeFolder, logFile.file_name);
    // If file upload has no error
    const importLog = {
      log_name: logFile.file_name,
      file_type_entity: fileType,
      file_info: logFile
    };
    return saveImportLog(importLog).then(function (importLog) {
      const workflowName = 'load-manual-files';
      return Workflow.startWorkflow(workflowName, {
        files: [{
          path: logFile.file_url,
          type: fileType
        }]
      });
    }).then(function () {
      return responseHelper.ok(res, {});
    }).catch(function (err) {
      console.log('Upload occur error: ', err);
      //res error
      return responseHelper.handleError(res, err);
    });
  });

  // Parse req
  form.parse(req);
};

/**
 * Export the methods.
 * @type {{}}
 */
module.exports = methods;
