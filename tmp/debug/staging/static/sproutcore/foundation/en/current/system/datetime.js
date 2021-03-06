// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/** @class

  A Scanner reads a string and interprets the characters into numbers. You
  assign the scanner's string on initialization and the scanner progresses
  through the characters of that string from beginning to end as you request
  items.
  
  Scanners are used by DateTime to convert strings into DateTime objects.
  
  @extends SC.Object
  @author Martin Ottenwaelter
*/

SC.SCANNER_OUT_OF_BOUNDS_ERROR = new Error("Out of bounds.");
SC.SCANNER_INT_ERROR = new Error("Not an int.");
SC.SCANNER_SKIP_ERROR = new Error("Did not find the string to skip.");
SC.SCANNER_SCAN_ARRAY_ERROR = new Error("Did not find any string of the given array to scan.");

SC.Scanner = SC.Object.extend(
/** @scope SC.Scanner.prototype */ {
  
  /**
    The string to scan. You usually pass it to the create method:
    
    {{{
      SC.Scanner.create({string: 'May, 8th'});
    }}}
    
    @property
    @type {String}
  */
  string: null,
  
  /**
    The current scan location. It is incremented by the scanner as the
    characters are processed.
    The default is 0: the beginning of the string.
    
    @property
    @type {integer}
  */
  scanLocation: 0,
  
  /**
    Reads some characters from the string, and increments the scan location
    accordingly. 
    
    @param {integer} len the amount of characters to read
    @throws {SC.SCANNER_OUT_OF_BOUNDS_ERROR} if asked to read too many characters
    @returns {String} the characters
  */
  scan: function(len) {
    if (this.scanLocation + len > this.length) throw SC.SCANNER_OUT_OF_BOUNDS_ERROR;
    var str = this.string.substr(this.scanLocation, len);
    this.scanLocation += len;
    return str;
  },
  
  /**
    Reads some characters from the string and interprets it as an integer.
    
    @param {integer} len the amount of characters to read
    @throws {SC.SCANNER_INT_ERROR} if asked to read non numeric characters
    @returns {integer} the scanned integer
  */
  scanInt: function(len) {
    var str = this.scan(len);
    var re = new RegExp("\\d{"+len+"}");
    if (!str.match(re)) throw SC.SCANNER_INT_ERROR;
    return parseInt(str, 10);
  },
  
  /**
    Attempts to skip a given string.
    
    @param {String} str the string to skip
    @throws {SC.SCANNER_SKIP_ERROR} if the given string could not be scanned
    @returns {Boolean} YES if the given string was successfully scanned
  */
  skipString: function(str) {
    if (this.scan(str.length) !== str) throw SC.SCANNER_SKIP_ERROR;
    return YES;
  },
  
  /**
    Attempts to scan any string in a given array.
    
    @param {Array} ary the array of strings to scan
    @throws {SC.SCANNER_SCAN_ARRAY_ERROR} if no string of the given array is found
    @returns {integer} the index of the scanned string of the given array
  */
  scanArray: function(ary) {
    for (var i = 0, len = ary.length; i < len; i++) {
      if (this.scan(ary[i].length) === ary[i]) {
        return i;
      }
      this.scanLocation -= ary[i].length;
    }
    throw SC.SCANNER_SCAN_ARRAY_ERROR;
  }
  
});


/** @class

  A class representation of a date and time. It's basically a wrapper around
  the Date javascript object, KVO friendly and with common date/time
  manipulation methods.
  
  @extends SC.Object
  @extends SC.Freezable
  @extends SC.Copyable
  @author Martin Ottenwaelter
*/
SC.DateTime = SC.Object.extend(SC.Freezable, SC.Copyable,
  /** @scope SC.DateTime.prototype */ {
  
  /** @private
    Internal representation of a date: the number of milliseconds
    since January, 1st 1970 00:00:00.0 UTC
    
    @prototype
    @type {Integer}
  */
  _ms: 0,
  
  /**
    A DateTime instance is frozen by default for better performance.
    
    @property
    @type {Boolean}
  */
  isFrozen: YES,
  
  /**
    Returns a new DateTime object where one or more of the elements have been
    changed according to the options parameter. The time options (hour,
    minute, sec, usec) reset cascadingly, so if only the hour is passed, then
    minute, sec, and usec is set to 0. If the hour and minute is passed, then
    sec and usec is set to 0.
    
    (Parts copied from the Ruby On Rails documentation)
    
    @see SC.DateTime#create for the list of options you can pass
    @returns {DateTime} copy of receiver
  */
  adjust: function(options) {
    return this.constructor._adjust(options, this._ms)._createFromCurrentState();
  },
  
  /**
    Returns a new DateTime object advanced according the the given parameters.
    Don't use floating point values, it might give unpredicatble results.
    
    @see SC.DateTime#create for the list of options you can pass
    @param {Hash} options the amount of date/time to advance the receiver
    @returns {DateTime} the amount of days in the current month
  */
  advance: function(options) {
   return this.constructor._advance(options, this._ms)._createFromCurrentState();
  },
  
  /**
    Generic getter.
    
    The properties you can get are:
      - 'year'
      - 'month' (January is 1, contrary to JavaScript Dates for which January is 0)
      - 'day'
      - 'dayOfWeek' (Sunday is 0)
      - 'hour'
      - 'minute'
      - 'second'
      - 'millisecond'
      - 'milliseconds', the number of milliseconds since
        January, 1st 1970 00:00:00.0 UTC
      - 'timezoneOffset', the time-zone offset is the difference, in minutes,
        between UTC and local time. Note that this means that the offset is
        positive if the local timezone is behind UTC and negative if it is
        ahead.  For example, if your time zone is UTC+10 (Australian Eastern
        Standard Time), -600 will be returned. Daylight savings time prevents
        this value from being a constant even for a given locale. (Copied from
        the Mozilla JavaScript reference)
      - 'isLeapYear', a boolean value indicating whether the receiver's year
        is a leap year
      - 'daysInMonth', the number of days of the receiver's current month
      - 'dayOfYear', January 1st is 1, December 31th is 365 for a common year
      - 'week' or 'week1', the week number of the current year, starting with
        the first Sunday as the first day of the first week (00..53)
      - 'week0', the week number of the current year, starting with
        the first Monday as the first day of the first week (00..53)
      - 'lastMonday', 'lastTuesday', etc., 'nextMonday', 'nextTuesday', etc.,
        the date of the last or next weekday in comparison to the receiver,
      - 'utc', the UTC formatted time
    
    @param {String} key the property name to get
    @return the value asked for
  */
  unknownProperty: function(key) {
    return this.constructor._get(key, this._ms);
  },
  
  /**
    Formats the receiver according to the given format string. Should behave
    like the C strftime function.
  
    The format parameter can contain the following characters:
      %a - The abbreviated weekday name (``Sun'')
      %A - The full weekday name (``Sunday'')
      %b - The abbreviated month name (``Jan'')
      %B - The full month name (``January'')
      %c - The preferred local date and time representation
      %d - Day of the month (01..31)
      %H - Hour of the day, 24-hour clock (00..23)
      %I - Hour of the day, 12-hour clock (01..12)
      %j - Day of the year (001..366)
      %m - Month of the year (01..12)
      %M - Minute of the hour (00..59)
      %p - Meridian indicator (``AM'' or ``PM'')
      %S - Second of the minute (00..60)
      %U - Week number of the current year,
          starting with the first Sunday as the first
          day of the first week (00..53)
      %W - Week number of the current year,
          starting with the first Monday as the first
          day of the first week (00..53)
      %w - Day of the week (Sunday is 0, 0..6)
      %x - Preferred representation for the date alone, no time
      %X - Preferred representation for the time alone, no date
      %y - Year without a century (00..99)
      %Y - Year with century
      %Z - Time zone (ISO 8601 formatted)
      %% - Literal ``%'' character
    
    @param {String} format the format string
    @return {String} the formatted string
  */
  toFormattedString: function(fmt) {
    return this.constructor._toFormattedString(fmt, this._ms);
  },
  
  toISO8601: function(){
    var fmt = '%Y-%m-%dT%H:%M:%S%Z';
    return this.constructor._toFormattedString(fmt, this._ms);
  },
  
  /** @private
    Creates string representation of the receiver.
    
    @returns {String}
  */
  toString: function() {
    var d = new Date(this._ms);
    return d.toString();
  },
  
  /**
    Returns YES if the passed DateTime is equal to the receiver, ie: if their
    number of milliseconds since January, 1st 1970 00:00:00.0 UTC are equal.
    This is the preferred method for testing equality.
  
    @see SC.DateTime#compare
    @param {SC.DateTime} aDateTime the DateTime to compare to
    @returns {Boolean}
  */
  isEqual: function(aDateTime) {
    return SC.DateTime.compare(this, aDateTime) === 0;
  },
  
  /**
    Returns a copy of the receiver. Because of the way DateTime is designed,
    it just returns the receiver.
    
    @returns {DateTime}
  */
  copy: function() {
    return this;
  }
  
});

// Class Methods
SC.DateTime.mixin(
  /** @scope SC.DateTime */ {
  
  /**
    The localized day names. Add the key '_SC.DateTime.dayNames' and its value
    to your strings.js file to add support for another language than English.

    @property
    @type {Array}
  */
  dayNames: '_SC.DateTime.dayNames'.loc().w(),
  
  /** @private
    The English day names used for the 'lastMonday',
    'nextTuesday', etc., getters.

    @property
    @type {Array}
  */
  _englishDayNames: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.w(),
  
  /**
    The localized abbreviated day names. Add the key
    '_SC.DateTime.abbreviatedDayNames' and its value to your strings.js
    file to add support for another language than English.

    @property
    @type {Array}
  */
  abbreviatedDayNames: '_SC.DateTime.abbreviatedDayNames'.loc().w(),

  /**
    The localized month names. Add the key '_SC.DateTime.monthNames' and its
    value to your strings.js file to add support for another language than
    English.

    @property
    @type {Array}
  */
  monthNames: '_SC.DateTime.monthNames'.loc().w(),

  /**
    The localized abbreviated month names. Add the key
    '_SC.DateTime.abbreviatedMonthNames' and its value to your strings.js
    file to add support for another language than English.

    @property
    @type {Array}
  */
  abbreviatedMonthNames: '_SC.DateTime.abbreviatedMonthNames'.loc().w(),
  
  /** @private
    The unique internal Date object used to make computations. Better
    performance is obtained by having only one Date object for the whole
    application and manipulating it with setTime() and getTime().

    @property
    @type {Date}
  */
  _date: new Date(),
  
  /** @private
    A cache of SC.DateTime instances. If you attempt to create a SC.DateTime
    instance that has already been created, then it will return the cached
    value.

    @property
    @type {Array}
  */
  _dt_cache: {},
  
  /** @private
    The index of the lastest cached value. Used with _DT_CACHE_MAX_LENGTH to
    limit the size of the cache.

    @property
    @type {Integer}
  */
  _dt_cache_index: -1,
  
  /** @private
    The maximum length of _dt_cache. If this limit is reached, then the cache
    is overwritten, starting with the oldest element.

    @property
    @type {Integer}
  */
  _DT_CACHE_MAX_LENGTH: 1000,
  
  /** @private
    @see SC.DateTime#unknownProperty
  */
  _get: function(key, start) {
    var d = this._date;
    if (start !== undefined) d.setTime(start);
    
    // simple keys
    switch (key) {
      case 'year':           return d.getFullYear(); //TODO: investigate why some libraries do getFullYear().toString() or getFullYear()+""
      case 'month':          return d.getMonth()+1; // January is 0 in JavaScript
      case 'day':            return d.getDate();
      case 'dayOfWeek':      return d.getDay();
      case 'hour':           return d.getHours();
      case 'minute':         return d.getMinutes();
      case 'second':         return d.getSeconds();
      case 'millisecond':    return d.getMilliseconds();
      case 'milliseconds':   return d.getTime();
      case 'timezoneOffset': return d.getTimezoneOffset();
      case 'utc':            return d.utcFormat();
    }
    
    // isLeapYear
    if (key === 'isLeapYear') {
      var y = this._get('year');
      return (y%4 === 0 && y%100 !== 0) || y%400 === 0;
    }
    
    // daysInMonth
    if (key === 'daysInMonth') {
      switch (this._get('month')) {
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
        case 2:
          return this._get('isLeapYear') ? 29 : 28;
        default:
          return 31;
      }
    }
    
    // dayOfYear
    if (key === 'dayOfYear') {
      var ms = d.getTime(); // save time
      var doy = this._get('day');
      this._adjust({day: 1});
      for (var m = this._get('month') - 1; m > 0; m--) {
        doy += this._adjust({month: m})._get('daysInMonth');
      }
      d.setTime(ms); // restore time
      return doy;
    }
    
    // week, week0 or week1
    if (key.slice(0, 4) === 'week') {
      // firstDayOfWeek should be 0 (Sunday) or 1 (Monday)
    	var firstDayOfWeek = key.length === 4 ? 1 : parseInt(key.slice('4'), 10);
    	var dayOfWeek = this._get('dayOfWeek');
      var dayOfYear = this._get('dayOfYear') - 1;
    	if (firstDayOfWeek === 0) {
    	  return parseInt((dayOfYear - dayOfWeek + 7) / 7, 10);
    	} else {
    	  return parseInt((dayOfYear - (dayOfWeek - 1 + 7) % 7 + 7) / 7, 10);
    	}
    }
    
    // nextWeekday or lastWeekday
    var prefix = key.slice(0, 4);
    var suffix = key.slice(4);
    if (prefix === 'last' || prefix === 'next') {
      var currentWeekday = d.getDay();
      var targetWeekday = this._englishDayNames.indexOf(suffix);    
      if (targetWeekday >= 0) {
        var delta = targetWeekday - currentWeekday;
        if (prefix === 'last' && delta >= 0) delta -= 7;
        if (prefix === 'next' && delta <  0) delta += 7;
        this._advance({day: delta})._adjust({hour: 0});
        return this._createFromCurrentState();
      }
    }

    return null;
  },
  
  /** @private
    @see SC.DateTime#adjust
  */
  _adjust: function(options, start) {
    var opts = options ? SC.clone(options) : {};
    
    var d = this._date;
    if (start !== undefined) d.setTime(start);
    
    // the time options (hour, minute, sec, millisecond)
    // reset cascadingly (see documentation)
    if ( !SC.none(opts.hour) && SC.none(opts.minute)) {
      opts.minute = 0;
    }
    if (!(SC.none(opts.hour) && SC.none(opts.minute))
        && SC.none(opts.second)) {
      opts.second = 0;
    }
    if (!(SC.none(opts.hour) && SC.none(opts.minute) && SC.none(opts.second))
        && SC.none(opts.millisecond)) {
      opts.millisecond = 0;
    }

    if (!SC.none(opts.year))        d.setFullYear(opts.year);
    if (!SC.none(opts.month))       d.setMonth(opts.month-1); // January is 0 in JavaScript
    if (!SC.none(opts.day))         d.setDate(opts.day);
    if (!SC.none(opts.hour))        d.setHours(opts.hour);
    if (!SC.none(opts.minute))      d.setMinutes(opts.minute);
    if (!SC.none(opts.second))      d.setSeconds(opts.second);
    if (!SC.none(opts.millisecond)) d.setMilliseconds(opts.millisecond);
    
    return this;
  },
  
  /** @private
    @see SC.DateTime#advance
  */
  _advance: function(options, start) {
    var opts = options ? SC.clone(options) : {};
    
    var d = this._date;
    if (start !== undefined) d.setTime(start);
    
    for (var key in opts) opts[key] += this._get(key);
    return this._adjust(opts);
  },
  
  /**
    Returns a new DateTime object advanced according the the given parameters.
    The parameters can be:
    - none, to create a DateTime instance initialized to the current
      date and time,
    - a integer, the number of milliseconds since
      January, 1st 1970 00:00:00.0 UTC
    - a options hash that can contain any of the following properties: year,
      month, day, hour, minute, second, millisecond
      
    Note that if you attempt to create a SC.DateTime instance that has already
    been created, then, for performance reasons, a cached value may be
    returned.
    
    @param options one of the three kind of parameters descibed above
    @returns {DateTime} the DateTime instance that corresponds to the
      passed parameters, possibly fetched from cache
  */
  create: function() {
    var arg = arguments.length === 0 ? {} : arguments[0];
    
    if (SC.typeOf(arg) === SC.T_NUMBER) {
      // quick implementation of a FIFO set for the cache
      var key = 'nu'+arg, cache = this._dt_cache;
      var ret = cache[key];
      if (!ret) {
        var previousKey, idx = this._dt_cache_index, C = this;
        ret = cache[key] = new C([{_ms: arg}]);
        idx = this._dt_cache_index = (idx + 1) % this._DT_CACHE_MAX_LENGTH;
        previousKey = cache[idx];
        if (previousKey !== undefined && cache[previousKey]) delete cache[previousKey];
        cache[idx] = key;
      }
      return ret;
    } else if (SC.typeOf(arg) === SC.T_HASH) {
      var now = new Date();
      return this.create(this._adjust(arg, now.getTime())._date.getTime());
    }
    
    return null;
  },
  
  /** @private
    Calls the create() method with the current internal _date value.
    
    @return {DateTime} the DateTime instance returned by create()
  */
  _createFromCurrentState: function() {
    return this.create(this._date.getTime());
  },
  
  /**
    Returns a DateTime object created from a given string parsed with a given
    format. Returns null if the parsing fails.

    @see SC.DateTime#toFormattedString for a description of the format parameter
    @param {String} str the string to parse
    @param {String} fmt the format to parse the string with
    @returns {DateTime} the DateTime corresponding to the string parameter
  */
  parse: function(str, fmt) {
    var re = /(?:\%([aAbBcdHIjmMpSUWwxXyYZ\%])|(.))/g;
    var d, parts, opts = {}, check = {}, scanner = SC.Scanner.create({string: str});
    try {
      while ((parts = re.exec(fmt)) !== null) {
        switch(parts[1]) {
          case 'a': check.dayOfWeek = scanner.scanArray(this.abbreviatedDayNames); break;
          case 'A': check.dayOfWeek = scanner.scanArray(this.dayNames); break;
          case 'b': opts.month = scanner.scanArray(this.abbreviatedMonthNames) + 1; break;
          case 'B': opts.month = scanner.scanArray(this.monthNames) + 1; break;
          case 'c': throw "%c is not implemented";
          case 'd': opts.day = scanner.scanInt(2); break;
          case 'H': opts.hour = scanner.scanInt(2); break;
          case 'I': opts.hour = scanner.scanInt(2); break;
          case 'j': throw "%j is not implemented";
          case 'm': opts.month = scanner.scanInt(2); break;
          case 'M': opts.minute = scanner.scanInt(2); break;
          case 'p': opts.meridian = scanner.scanArray(['AM', 'PM']); break;
          case 'S': opts.second = scanner.scanInt(2); break;
          case 'U': throw "%U is not implemented";
          case 'W': throw "%W is not implemented";
          case 'w': throw "%w is not implemented";
          case 'x': throw "%x is not implemented";
          case 'X': throw "%X is not implemented";
          case 'y': opts.year = scanner.scanInt(2); opts.year += (opts.year > 70 ? 1900 : 2000); break;
          case 'Y': opts.year = scanner.scanInt(4); break;
          case 'Z':
            var modifier = scanner.scan(1);
            if(modifier == 'Z'){
              opts.timeZoneOffset = 0; 
            } else {
              var timeZoneHours = scanner.scanInt(2);
              if(scanner.scan(1) !== ':'){
                scanner.scan(-1);
              } 
              var timeZoneMinutes = scanner.scanInt(2);
              var timeZoneSecondsOffset = (timeZoneHours*3600)+(timeZoneMinutes*60);

              var offset = eval(0 + modifier + timeZoneSecondsOffset);
              opts.timeZoneOffset = offset;
            } 
              
            break;
      //    case 'Z': throw "%Z is not implemented";
          case '%': scanner.skipString('%'); break;
          default:  scanner.skipString(parts[0]); break;
        }
      }
    } catch (e) {
      console.log('SC.DateTime.createFromString ' + e.toString());
      return null;
    }
    
    if (!SC.none(opts.meridian) && !SC.none(opts.hour)) {
      if (opts.meridian === 1) opts.hour = (opts.hour + 12) % 24;
      delete opts.meridian;
    }
    
    d = SC.DateTime.create(opts);
    
    if (!SC.none(check.dayOfWeek) && d.get('dayOfWeek') !== check.dayOfWeek) {
      return null;
    }
    if(!SC.none(opts.timeZoneOffset)){
      d = d.advance({second: opts.timeZoneOffset});
    }
    
    return d;
  },
  
  /** @private
    Converts the x parameter into a string padded with 0s so that the string’s
    length is at least equal to the len parameter.
    
    @param x the object to convert to a string
    @param {Integer} the minimum length of the returned string
    @returns {String} the padded string
  */
  _pad: function(x, len) {
  	var str = '' + x;
  	if (len === undefined) len = 2;
    while (str.length < len) str = '0' + str;
    return str;
  },
  
  /** @private
    @see SC.DateTime#toFormattedString
  */
  __toFormattedString: function(part) {
    switch(part[1]) {
      case 'a': return this.abbreviatedDayNames[this._get('dayOfWeek')];
      case 'A': return this.dayNames[this._get('dayOfWeek')];
      case 'b': return this.abbreviatedMonthNames[this._get('month')-1];
      case 'B': return this.monthNames[this._get('month')-1];
      case 'c': return this._date.toString();
      case 'd': return this._pad(this._get('day'));
      case 'H': return this._pad(this._get('hour'));
      case 'I': 
        var hour = this._get('hour');
        return this._pad((hour === 12 || hour === 0) ? 12 : (hour + 12) % 12);
      case 'j': return this._pad(this._get('dayOfYear'), 3);
      case 'm': return this._pad(this._get('month'));
      case 'M': return this._pad(this._get('minute'));
      case 'p': return this._get('hour') > 11 ? 'PM' : 'AM';
      case 'S': return this._pad(this._get('second'));
      case 'u': return this._pad(this._get('utc')); //utc
      case 'U': return this._pad(this._get('week0'));
      case 'W': return this._pad(this._get('week1'));
      case 'w': return this._get('dayOfWeek');
      case 'x': return this._date.toDateString();
      case 'X': return this._date.toTimeString();
      case 'y': return this._pad(this._get('year') % 100);
      case 'Y': return this._get('year');
      case 'Z':
        var offset = -1 * this._get('timezoneOffset');
        return (offset >= 0 ? '+' : '-')
               + this._pad(parseInt(Math.abs(offset)/60, 10))
               + ':'
               + this._pad(Math.abs(offset)%60);
      case '%': return '%';
    }
  },
  
  /** @private
    @see SC.DateTime#toFormattedString
  */
  _toFormattedString: function(format, start) {
    var d = this._date;
    if (start !== undefined) d.setTime(start);
    
    var that = this;
    return format.replace(/\%([aAbBcdHIjmMpSUWwxXyYZ\%])/g, function() {
      return that.__toFormattedString.call(that, arguments);
    });
  },
  
  /**
    This will tell you which of the two passed DateTime is greater than the
    other, by comparing the date and time parts of the passed objects.
 
    @param {SC.DateTime} a the first DateTime instance
    @param {SC.DateTime} b the second DateTime instance
    @returns {Integer} -1 if a < b, 
                       +1 if a > b,
                       0 if a == b
  */
  compare: function(a, b) {
    return a._ms < b._ms ? -1 : a._ms === b._ms ? 0 : 1;
  },
  
  /**
    This will tell you which of the two passed DateTime is greater than the
    other, by only comparing the date parts of the passed objects.
 
    @param {SC.DateTime} a the first DateTime instance
    @param {SC.DateTime} b the second DateTime instance
    @returns {Integer} -1 if a < b,
                       +1 if a > b,
                       0 if a == b
  */
  compareDate: function(a, b) {
    var d1 = this._adjust({hour: 0}, a._ms)._date.getTime();
    var d2 = this._adjust({hour: 0}, b._ms)._date.getTime();
    return d1 < d2 ? -1 : d1 === d2 ? 0 : 1;
  }
  
});

/**
  Adds a transform to format the DateTime value to a String value according
  to the passed format string. 
  
  {{
    valueBinding: SC.Binding.dateTime('%Y-%m-%d %H:%M:%S')
                  .from('MyApp.myController.myDateTime');
  }}

  @param {String} format format string
  @returns {SC.Binding} this
*/
SC.Binding.dateTime = function(format) {
  return this.transform(function(value, binding) {
    return value ? value.toFormattedString(format) : null;
  });
};
