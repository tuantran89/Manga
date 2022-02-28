'use strict';
const moment = require('moment');
const ISO_8601_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';

const DateUtil = {
  dateUTC: function () {
    var leng = arguments.length;
    var tmp;
    if (leng === 1) {
      tmp = arguments[0] ? new Date(arguments[0]) : new Date();
      return new Date(Date.UTC(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()));
    } else if (leng === 3) {
      return new Date(Date.UTC(arguments[0], arguments[1], arguments[2]));
    } else {
      tmp = new Date();
      return new Date(Date.UTC(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()));
    }
  },
  utcToDateUTC: function () {
    var leng = arguments.length;
    var tmp;
    if (leng === 0 || (leng === 1 && !arguments[0])) {
      tmp = new Date();
      return new Date(Date.UTC(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()));
    } else if (leng === 1 && arguments[0]) {
      tmp = new Date(arguments[0]);
      return new Date(Date.UTC(tmp.getUTCFullYear(), tmp.getUTCMonth(), tmp.getUTCDate()));
    } else if (leng === 3) {
      return new Date(Date.UTC(arguments[0], arguments[1], arguments[2]));
    }
  },
  isDate: function (str) {
    // dd/mm/yyyy ||  dd/mm/yy ||  dd-mm-yyyy dd/mm/yy || dd-mm-yy ||  yyyy/mm/dd || yyyy-mm-dd

    let r = new RegExp(/^((\d{1,2})(-|\/)(\d{1,2})(-|\/)(\d{4}))|((\d{1,2})(-|\/)(\d{1,2})(-|\/)(\d{2}))|((\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2}))$/, 'g');
    let r1 = new RegExp(/\^\(\\w\{3\}\)\+\\s\+\\d\{2\},\+\\s\+\\d\{4\}\$/, 'g');
    let r2 = new RegExp(/\^\(\\d\{2\}\)\+\\\x2d\+\(\\w\{3,9\}\)\+\\\x2d\+\\d\{4\}\$/, 'g');
    return r.test(str) || r1.test(str) || r2.test(str);
  },
  convertDateStringToCustomFormat: (dateStr, timezoneOffset, customFormat) => {
    return moment
      .utc(dateStr)
      .utcOffset(timezoneOffset || 0)
      .format(customFormat || 'YYYY-MM-DD HH:mm:ss.SSS');
  },
  toUtcMoment(localDate, fromOffset) {
    if (fromOffset == null) {
      fromOffset = moment(localDate).utcOffset();
    }
    if (localDate) {
      return moment(localDate).add(-fromOffset, 'minutes');
    }

    return null;
  },
  parseDate: (dateStr) => {
    if (DateUtil.isDateTimeStr(dateStr)) {
      const newDate = moment.utc(dateStr).toDate();
      return newDate;
    }

    return null;
  },
  isDateTimeStr: (dateTimeStr) => {
    if (dateTimeStr === null || dateTimeStr === undefined || dateTimeStr === '') {
      return false;
    }

    const momentDate = moment(dateTimeStr);
    return momentDate.isValid();
  },
  toUtc: (localDate, fromOffset) => {
    const utcDate = DateUtil.toUtcMoment(localDate, fromOffset);
    const isoStr = utcDate.format(ISO_8601_FORMAT);
    if (isoStr != null) {
      return moment(isoStr).toDate();
    }

    return null;
  }
};

module.exports = DateUtil;