'use strict';

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

const _ = require('lodash');
const CommonUtil = {
  decimals2: function (number) {
    number = number || 0;
    return Math.round(number * 100) / 100;
  },
  decimals3: function (number) {
    number = number || 0;
    return Math.round(number * 1000) / 1000;
  },
  trimChars(text, char) {
    let re = new RegExp('^[' + char + ']+|[' + char + ']+$', 'g');
    return text.replace(re, '');
  },
  // Return array of string values, or NULL if CSV string not well formed.
  convertCSVToArray(text) {
    if (!text) {
      return;
    }
    let re = new RegExp(/(?=(?:[^\"]|\"[^\"]*\")*$),/, 'g');
    let cols = text.split(re);
    // for (var i = 0; i < matches.length; ++i) {
    //     matches[i] = matches[i].trim();
    //     if (matches[i] === ',') {
    //         matches[i] = '';
    //     }
    // }
    let compacted = _.compact(cols);
    if (compacted && compacted.length) {
      return cols;
    }
    return [];
  },
  splitNewLine(text) {
    // return text.split(/(?=([^\"]*\"[^\"]*\")*[^\"]*$)\n/);
    if (!text) {
      return;
    }
    // var matches = text.match(/(\s*"[^"]+"\s*|\s*[^,]+|$)/g);

    let re = new RegExp(/(?=(?:[^\"]|\"[^\"]*\")*$),/, 'g');
    let matches = text.match(re);
    let rows = text.split(re);
    let data = [];
    rows.forEach((row) => {
      if (row) {
        row = row.trim();
        if (matches.indexOf(row) === -1) {
          data.push(row);
        }
      }
    });
    let compacted = _.compact(data);
    if (compacted && compacted.length) {
      return data;
    }
    return [];
  },
  getHeadersFromText(text) {
    var labels = this.convertCSVToArray(text);
    var headers = [];
    labels.forEach((item, index) => {
      labels[index] = this.trimChars(item, '"');
      if (labels[index]) {
        let headerCode = labels[index].toLowerCase().split(' ').join('_');
        headers.push({ headerName: labels[index], headerCode: headerCode, index: index });
      }
    });
    return headers;
  }
};

module.exports = CommonUtil;