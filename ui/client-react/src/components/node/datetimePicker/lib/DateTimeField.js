"use strict";

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _extends = require("babel-runtime/helpers/extends")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _DateTimePickerJs = require("./DateTimePicker.js");

var _DateTimePickerJs2 = _interopRequireDefault(_DateTimePickerJs);

var _ConstantsJs = require("./Constants.js");

var _ConstantsJs2 = _interopRequireDefault(_ConstantsJs);

var DateTimeField = (function (_Component) {
  _inherits(DateTimeField, _Component);

  function DateTimeField() {
    var _this = this;

    _classCallCheck(this, DateTimeField);

    _get(Object.getPrototypeOf(DateTimeField.prototype), "constructor", this).apply(this, arguments);

    this.resolvePropsInputFormat = function () {
      if (_this.props.inputFormat) {
        return _this.props.inputFormat;
      }
      switch (_this.props.mode) {
        case _ConstantsJs2["default"].MODE_TIME:
          return "h:mm A";
        case _ConstantsJs2["default"].MODE_DATE:
          return "MM/DD/YY";
        default:
          return "MM/DD/YY h:mm A";
      }
    };

    //  CUSTOMIZED
    //  viewDate and selectedDate to default to current month and day if the input value is invalid
    //
    this.state = {
      showDatePicker: this.props.mode !== _ConstantsJs2["default"].MODE_TIME,
      showTimePicker: this.props.mode === _ConstantsJs2["default"].MODE_TIME,
      inputFormat: this.resolvePropsInputFormat(),
      buttonIcon: this.props.mode === _ConstantsJs2["default"].MODE_TIME ? "glyphicon-time" : "glyphicon-calendar",
      widgetStyle: {
        display: "block",
        position: "absolute",
        left: -9999,
        zIndex: "9999 !important"
      },
      viewDate: (0, _moment2["default"])(this.props.dateTime, this.props.format, true).isValid() ? (0, _moment2["default"])(this.props.dateTime, this.props.format, true).startOf("month") : (0, _moment2["default"])().startOf("month"),
      selectedDate: (0, _moment2["default"])(this.props.dateTime, this.props.format, true).isValid() ? (0, _moment2["default"])(this.props.dateTime, this.props.format, true) : (0, _moment2["default"])(),
      inputValue: typeof this.props.defaultText !== "undefined" ? this.props.defaultText : (0, _moment2["default"])(this.props.dateTime, this.props.format, true).format(this.resolvePropsInputFormat()),
      isFocused: false
    };

    /**
     * CUSTOMIZED to accomodate Quickbase requirements
     *
     * @param nextProps
     * @returns {*}
     */
    this.componentWillReceiveProps = function (nextProps) {
      var state = {};
      //  CUSTOMIZED to add !dateTime test
      if (!nextProps.dateTime) {
        var ghostText = nextProps.format ? nextProps.format.toLowerCase() : 'mm-dd-yyyy';
        state.inputValue = nextProps.dateTime === null ? ghostText : '';
        state.selectedDate = (0, _moment2["default"])();
        state.viewDate = (0, _moment2["default"])().startOf("month");
      } else {
        if (nextProps.inputFormat !== _this.props.inputFormat) {
          state.inputFormat = nextProps.inputFormat;
          state.inputValue = (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true).format(nextProps.inputFormat);
        }

        if (nextProps.dateTime !== _this.props.dateTime && (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true).isValid()) {
          state.viewDate = (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true).startOf("month");
          state.selectedDate = (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true);
          state.inputValue = (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true).format(nextProps.inputFormat ? nextProps.inputFormat : _this.state.inputFormat);
        }
      }
      return _this.setState(state);
    };

    /**
     *  CUSTOMIZED...add onBlur event handling
     *
     *  Handle various MomentJS quickbase shortcut keys for dates.
     *
     *  NOTE: NOT locale saavy
     *
     * @param event
     * @returns {*}
     */
    this.onBlur = function (event) {
      _this.setState({isFocused: false});
      var dateTemplate = event.target == null ? event : event.target.value;
      var value = null;

      //
      // Month/Year combination; default to last day of the month; if month only, use current year.
      //
      var monthFormats = ['MMM', 'MMMM', 'MMM YYYY', 'MMMM YYYY'];
      if ((0, _moment2["default"])(dateTemplate, monthFormats, true).isValid()) {
        value = (0, _moment2["default"])(dateTemplate, monthFormats, true).endOf("month").format(_this.state.inputFormat);
      } else {
        //
        // Year only; set date to last day of the year
        //
        var yearFormats = ['YYYY'];
        if ((0, _moment2["default"])(dateTemplate, yearFormats, true).isValid()) {
          value = (0, _moment2["default"])(dateTemplate, yearFormats, true).endOf("year").format(_this.state.inputFormat);
        } else {
          //
          // Month/Day formats.  Year is set to current year.
          //
          var monthDayFormats = ['MMM D', 'MMMM D', 'MMM-D', 'M-D', 'M D', 'M/D'];
          if ((0, _moment2["default"])(dateTemplate, monthDayFormats, true).isValid()) {
            var currentYr = (0, _moment2["default"])().format('YYYY');
            value = (0, _moment2["default"])(dateTemplate, monthDayFormats, true).year(currentYr).format(_this.state.inputFormat);
          } else {
            //
            //  Month/Day/Year formats
            //
            var monthDayYrFormats = [
              'MMM D YYYY', 'MMMM D YYYY', 'MMM D, YYYY', 'MMMM D, YYYY', 'MMM-D-YYYY', 'M-D-YYYY', 'M D YYYY', 'M/D/YYYY',
              'MMM D YY', 'MMMM D YY', 'MMM D, YY', 'MMMM D, YY', 'MMM-D-YY', 'M-D-YY', 'M D YY', 'M/D/YY'];
            if ((0, _moment2["default"])(dateTemplate, monthDayYrFormats, true).isValid()) {
              value = (0, _moment2["default"])(dateTemplate, monthDayYrFormats, true).format(_this.state.inputFormat);
            }
          }
        }
      }

      if (value) {
        return _this.setState({
          inputValue: value
        }, function () {
          return this.props.onBlur((0, _moment2["default"])(this.state.inputValue, this.state.inputFormat, true).format(this.props.format), value);
        });
      }
    };

    /**
     * CUSTOMIZED to accomodate Quickbase requirements
     *
     * @param nextProps
     * @returns {*}
     */
    this.onChange = function (event) {
      var value = event.target == null ? event : event.target.value;

      //  Quickbase shortcut for dates; set the value to today's date.  This conditional
      //  gets triggered only when the date is highlighted/selected (ie: ctrl-a) and the user
      //  types in the letter 't'.  Other scenarios for handling the 't' shortcut is
      //  handled in the onKeyPress event.
      if (value === 't') {
        value = (0, _moment2["default"])().format(_this.state.inputFormat);
      }

      if ((0, _moment2["default"])(value, _this.state.inputFormat, true).isValid()) {
        _this.setState({
          selectedDate: (0, _moment2["default"])(value, _this.state.inputFormat, true),
          viewDate: (0, _moment2["default"])(value, _this.state.inputFormat, true).startOf("month")
        });
      } else {
        _this.setState({
          selectedDate: (0, _moment2["default"])(),
          viewDate: (0, _moment2["default"])().startOf("month")
        });
      }

      return _this.setState({
        inputValue: value
      }, function () {
        //  CUSTOMIZED to return empty value to allow for manual entry of a date.
        if ((0, _moment2["default"])(this.state.inputValue, this.state.inputFormat, true).isValid()) {
          return this.props.onChange((0, _moment2["default"])(this.state.inputValue, this.state.inputFormat, true).format(this.props.format), value);
        } else {
          return this.props.onChange('', value);
        }
      });
    };

    /**
     * CUSTOMIZE to handle unique Quickbase shortcut keys 't', '[' and ']'.
     *
     * @param event
     * @returns {*}
     */
    this.onKeyPress = function (event) {

      //  Shortcuts:
      //  t - today (if no date is entered)
      //  ] - increment 1 day  (if a date has already been entered)
      //  [ - subtract 1 day

      var value = null;
      var ASCII_T = 116;
      var ASCII_LEFT_BRACKET = 91;
      var ASCII_RIGHT_BRACKET = 93;

      if (event.charCode === ASCII_T) {
        //  if the date input is empty or the ghost text
        if (!event.target.value || event.target.value === 'mm-dd-yyyy') {
          value = (0, _moment2["default"])().format(_this.state.inputFormat);
        }
      } else {
        if (event.charCode === ASCII_LEFT_BRACKET || event.charCode === ASCII_RIGHT_BRACKET) {
          if (_this.props.dateTime) {
            if (event.charCode === ASCII_RIGHT_BRACKET) {
              value = (0, _moment2["default"])(_this.props.dateTime, _this.props.format).add(1, 'd').format(_this.state.inputFormat);
            } else {
              value = (0, _moment2["default"])(_this.props.dateTime, _this.props.format).subtract(1, 'd').format(_this.state.inputFormat);
            }
          }
        }
      }

      if (value) {
        //  preventDefault() stops the onChange event from getting triggered after processing completes
        event.preventDefault();

        //   set the state and return
        return _this.setState({
          inputValue: value,
          selectedDate: (0, _moment2["default"])(value, _this.state.inputFormat, true),
          viewDate: (0, _moment2["default"])(value, _this.state.inputFormat, true).startOf("month")
        }, function () {
          return this.props.onChange((0, _moment2["default"])(this.state.inputValue, this.state.inputFormat, true).format(this.props.format), value);
        });
      }
    };

    this.getValue = function () {
      return (0, _moment2["default"])(_this.state.inputValue, _this.props.inputFormat, true).format(_this.props.format);
    };

    this.setSelectedDate = function (e) {
      var target = e.target;

      if (target.className && !target.className.match(/disabled/g)) {
        var month = undefined;
        if (target.className.indexOf("new") >= 0) month = _this.state.viewDate.month() + 1;else if (target.className.indexOf("old") >= 0) month = _this.state.viewDate.month() - 1;else month = _this.state.viewDate.month();
        return _this.setState({
          selectedDate: _this.state.viewDate.clone().month(month).date(parseInt(e.target.innerHTML)).hour(_this.state.selectedDate.hours()).minute(_this.state.selectedDate.minutes())
        }, function () {
          this.closePicker();
          this.props.onChange(this.state.selectedDate.format(this.props.format));
          return this.setState({
            inputValue: this.state.selectedDate.format(this.state.inputFormat)
          });
        });
      }
    };

    this.setSelectedHour = function (e) {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().hour(parseInt(e.target.innerHTML)).minute(_this.state.selectedDate.minutes())
      }, function () {
        this.closePicker();
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.state.inputFormat)
        });
      });
    };

    this.setSelectedMinute = function (e) {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().hour(_this.state.selectedDate.hours()).minute(parseInt(e.target.innerHTML))
      }, function () {
        this.closePicker();
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.state.inputFormat)
        });
      });
    };

    this.setViewMonth = function (month) {
      return _this.setState({
        viewDate: _this.state.viewDate.clone().month(month)
      });
    };

    this.setViewYear = function (year) {
      return _this.setState({
        viewDate: _this.state.viewDate.clone().year(year)
      });
    };

    this.addMinute = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().add(1, "minutes")
      }, function () {
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
        });
      });
    };

    this.addHour = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().add(1, "hours")
      }, function () {
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
        });
      });
    };

    this.addMonth = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(1, "months")
      });
    };

    this.addYear = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(1, "years")
      });
    };

    this.addDecade = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(10, "years")
      });
    };

    this.subtractMinute = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().subtract(1, "minutes")
      }, function () {
        _this.props.onChange(_this.state.selectedDate.format(_this.props.format));
        return _this.setState({
          inputValue: _this.state.selectedDate.format(_this.resolvePropsInputFormat())
        });
      });
    };

    this.subtractHour = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().subtract(1, "hours")
      }, function () {
        _this.props.onChange(_this.state.selectedDate.format(_this.props.format));
        return _this.setState({
          inputValue: _this.state.selectedDate.format(_this.resolvePropsInputFormat())
        });
      });
    };

    this.subtractMonth = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(1, "months")
      });
    };

    this.subtractYear = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(1, "years")
      });
    };

    this.subtractDecade = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(10, "years")
      });
    };

    this.togglePeriod = function () {
      if (_this.state.selectedDate.hour() > 12) {
        return _this.onChange(_this.state.selectedDate.clone().subtract(12, "hours").format(_this.state.inputFormat));
      } else {
        return _this.onChange(_this.state.selectedDate.clone().add(12, "hours").format(_this.state.inputFormat));
      }
    };

    this.togglePicker = function () {
      return _this.setState({
        showDatePicker: !_this.state.showDatePicker,
        showTimePicker: !_this.state.showTimePicker
      });
    };

    this.onClick = function () {
      var classes = undefined,
          gBCR = undefined,
          offset = undefined,
          placePosition = undefined,
          scrollTop = undefined,
          styles = undefined;
      if (_this.state.showPicker) {
        return _this.closePicker();
      } else {
        _this.setState({
          showPicker: true
        });
        gBCR = _this.refs.dtpbutton.getBoundingClientRect();
        classes = {
          "bootstrap-datetimepicker-widget": true,
          "dropdown-menu": true
        };
        offset = {
          top: gBCR.top + window.pageYOffset - document.documentElement.clientTop,
          left: gBCR.left + window.pageXOffset - document.documentElement.clientLeft
        };
        offset.top = offset.top + _this.refs.datetimepicker.offsetHeight;
        scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        placePosition = _this.props.direction === "up" ? "top" : _this.props.direction === "bottom" ? "bottom" : _this.props.direction === "auto" ? offset.top + _this.refs.widget.offsetHeight > window.offsetHeight + scrollTop && _this.refs.widget.offsetHeight + _this.refs.datetimepicker.offsetHeight > offset.top ? "top" : "bottom" : void 0;
        if (placePosition === "top") {
          offset.top = -_this.refs.widget.offsetHeight - _this.clientHeight - 2;
          classes.top = true;
          classes.bottom = false;
          classes["pull-right"] = true;
        } else {
          offset.top = 40;
          classes.top = false;
          classes.bottom = true;
          classes["pull-right"] = true;
        }
        styles = {
          display: "block",
          position: "absolute",
          top: offset.top,
          left: "auto",
          right: 40
        };
        return _this.setState({
          widgetStyle: styles,
          widgetClasses: classes
        });
      }
    };

    this.closePicker = function () {
      var style = _extends({}, _this.state.widgetStyle);
      style.left = -9999;
      style.display = "none";
      return _this.setState({
        showPicker: false,
        widgetStyle: style
      });
    };

    this.size = function () {
      switch (_this.props.size) {
        case _ConstantsJs2["default"].SIZE_SMALL:
          return "form-group-sm";
        case _ConstantsJs2["default"].SIZE_LARGE:
          return "form-group-lg";
      }

      return "";
    };

    this.renderOverlay = function () {
      var styles = {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: "999"
      };
      if (_this.state.showPicker) {
        return _react2["default"].createElement("div", { onClick: _this.closePicker, style: styles });
      } else {
        return _react2["default"].createElement("span", null);
      }
    };
  }

  _createClass(DateTimeField, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        null,
        this.renderOverlay(),
        _react2["default"].createElement(_DateTimePickerJs2["default"], {
          addDecade: this.addDecade,
          addHour: this.addHour,
          addMinute: this.addMinute,
          addMonth: this.addMonth,
          addYear: this.addYear,
          daysOfWeekDisabled: this.props.daysOfWeekDisabled,
          maxDate: this.props.maxDate,
          minDate: this.props.minDate,
          mode: this.props.mode,
          ref: "widget",
          selectedDate: this.state.selectedDate,
          setSelectedDate: this.setSelectedDate,
          setSelectedHour: this.setSelectedHour,
          setSelectedMinute: this.setSelectedMinute,
          setViewMonth: this.setViewMonth,
          setViewYear: this.setViewYear,
          showDatePicker: this.state.showDatePicker,
          showTimePicker: this.state.showTimePicker,
          showToday: this.props.showToday,
          subtractDecade: this.subtractDecade,
          subtractHour: this.subtractHour,
          subtractMinute: this.subtractMinute,
          subtractMonth: this.subtractMonth,
          subtractYear: this.subtractYear,
          togglePeriod: this.togglePeriod,
          togglePicker: this.togglePicker,
          viewDate: this.state.viewDate,
          viewMode: this.props.viewMode,
          widgetClasses: this.state.widgetClasses,
          widgetStyle: this.state.widgetStyle
        }),
        _react2["default"].createElement(
          "div",
          { className: "input-group date " + this.size() + (this.state.isFocused ? ' is-focused' : ''), ref: "datetimepicker" },
          _react2["default"].createElement("input",
            _extends({
                className: "form-control",
                onKeyPress: this.onKeyPress,
                onBlur: this.onBlur,
                onChange: this.onChange,
                onFocus: (function() {this.setState({isFocused: true})}).bind(this),
                type: "text",
                value: this.state.inputValue
            }, this.props.inputProps)),
          _react2["default"].createElement(
            "span",
            { className: "input-group-addon", onBlur: this.onBlur, onClick: this.onClick, ref: "dtpbutton" },
            _react2["default"].createElement("span", { className: (0, _classnames2["default"])("glyphicon", this.state.buttonIcon) })
          )
        )
      );
    }
  }], [{
    key: "defaultProps",
    value: {
      dateTime: (0, _moment2["default"])().format("x"),
      format: "x",
      showToday: true,
      viewMode: "days",
      daysOfWeekDisabled: [],
      size: _ConstantsJs2["default"].SIZE_MEDIUM,
      mode: _ConstantsJs2["default"].MODE_DATETIME,
      onChange: function onChange(x) {
        console.log('No onChange property callback supplied to DateTime.' + x);
      },
      onBlur: function onBlur(x) {
        console.log('No onBlur property callback supplied to DateTime.' + x);
      },
      onKeyPress: function onKeyPress(x) {
        console.log('No onKeyPress property callback supplied to DateTime.' + x);
      }
    },
    enumerable: true
  }, {
    key: "propTypes",
    value: {
      dateTime: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
      onChange: _react.PropTypes.func,
      onBlur: _react.PropTypes.func,
      format: _react.PropTypes.string,
      inputProps: _react.PropTypes.object,
      inputFormat: _react.PropTypes.string,
      defaultText: _react.PropTypes.string,
      mode: _react.PropTypes.oneOf([_ConstantsJs2["default"].MODE_DATE, _ConstantsJs2["default"].MODE_DATETIME, _ConstantsJs2["default"].MODE_TIME]),
      minDate: _react.PropTypes.object,
      maxDate: _react.PropTypes.object,
      direction: _react.PropTypes.string,
      showToday: _react.PropTypes.bool,
      viewMode: _react.PropTypes.string,
      size: _react.PropTypes.oneOf([_ConstantsJs2["default"].SIZE_SMALL, _ConstantsJs2["default"].SIZE_MEDIUM, _ConstantsJs2["default"].SIZE_LARGE]),
      daysOfWeekDisabled: _react.PropTypes.arrayOf(_react.PropTypes.number)
    },
    enumerable: true
  }]);

  return DateTimeField;
})(_react.Component);

exports["default"] = DateTimeField;
module.exports = exports["default"];
