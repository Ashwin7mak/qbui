/*
 Given a raw email field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the email.
 */
(function() {
    'use strict';
    var _ = require('lodash');

    //Module constants:
    var ALLOWED_HTML_ELEMENTS = ["a", "abbr", "acronym", "address", "area", "b", "big", "blockquote", "br", "caption", "cite",
        "code", "dd", "del", "dfn", "div", "dl", "dt", "em", "fieldset", "font", "h1", "h2", "h3", "h4", "h5",
        "h6", "hr", "i", "img", "ins", "kbd", "legend", "li", "map", "ol", "p", "pre", "q", "samp", "small",
        "span", "strong", "sub", "sup", "tt", "u", "ul", "var"];


    module.exports = {
        //Given a email string as input, formats as a email with display preferences applied.
        format: function(fieldValue, fieldInfo) {
            // if html is allowed encode some of the html tags if not encode all html
            return (fieldInfo && fieldInfo.htmlAllowed ? this.limitHTML(fieldValue.value) : this.encHTML(fieldValue.value));
        },

        /**
         * finds the first matching char in the input string given the set of chars
         * @param inStr - the input string
         * @param chars - array of chars it should find 1st one of
         * @param start - offset into inString to start looking
         * @returns {number}
         */
        findFirstOf: function(inStr, chars, start) {
            var idx = -1;
            [].some.call(inStr.slice(start || 0), function(c, i)  {
                if (chars.indexOf(c) >= 0) {
                    idx = i;
                    return true;
                }
            });
            return idx >= 0 ? idx + (start || 0) : -1;
        },


        /**
         * Escape special characters in the given string to html entities.
         *  handles escaping both within and outside of attributes.
         * @param s - the string to escape
         * @param forAttribute - true if the string is used in an attribute
         * @return escaped html
         */
        escapeHTML: function(s, forAttribute) {
            return s.replace(forAttribute ? /[&<>'"]/g : /[&<>]/g, function(c)  {
                return {
                    '&': "&amp;",
                    '"': "&quot;",
                    "'": '&#39;',
                    '`': '&#96;',
                    '<': "&lt;",
                    '>': "&gt;"
                }[c];
            });
        },

        /**
         * Unescape special characters in the given string of html.
         *
         * @param  {String} html
         * @return {String}
         */
        unescape: function(html) {
            return String(html)
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&#96;/g, "`")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
        },

        /**
         * encodeForbiddenTags
         * Checks an HTML string for tags not in allow array and encodes those tags and text contained within those tags.
         */
        encodeForbiddenTags: function(s) {
            // if the string contains no element start char we're done
            if (!s || s.indexOf('<') === -1) {
                return s;
            }
            var result = '';
            var copyPos = 0;
            //loop thru each character
            var sLen = s.length;
            for (var pos = 0; pos < sLen; pos++) {
                var c = s[pos];

                //on a start tag?
                if (c === '<') {
                    //not the location of the < less than char
                    var ltPos = pos;

                    //go past the found <
                    ++pos;

                    // skip initial whitespace and slashes
                    while (s[pos] === ' ' || s[pos] === '/' && pos < sLen) {
                        ++pos;
                    }

                    // get the tag and check it
                    var endTagPos = this.findFirstOf(s, ' >', pos);

                    //note the location of the > greater than char
                    var gtPos = (endTagPos === -1) ? -1 : s.indexOf('>', endTagPos);

                    // reach the end of the string without finding the >
                    if (gtPos === -1) {
                        //ends with an open <; escape it
                        result += s.substr(copyPos, ltPos - copyPos);
                        result += '&lt;' + s.substr(ltPos + 1);
                        copyPos = sLen;
                        break;
                    } else {
                        var tag = s.substr(pos, endTagPos - pos);
                        tag = tag.toLowerCase(tag);
                        var isAllowed  = false;
                        for (var i in ALLOWED_HTML_ELEMENTS) {
                            if (ALLOWED_HTML_ELEMENTS[i] === tag) {
                                isAllowed = true;
                                break;
                            }
                        }
                        if (isAllowed) {
                            // its allowed no escaping needed
                            pos = gtPos;
                            continue;
                        }
                    }
                    // if we get here we need ot escape this element
                    result += s.substr(copyPos, ltPos - copyPos);
                    result += '&lt;' + s.substr(ltPos + 1, gtPos - ltPos - 1) + '&gt;';
                    copyPos = gtPos + 1;
                    pos = gtPos;
                }

            }
            result += s.substr(copyPos, sLen - copyPos);
            return result;
        },

        /**
         * encode all the html tags and entities
         * @param s
         * @returns {string}
         */
        encHTML: function(s) {
            //encode all html tags
            return _.escape(s);
        },

        /**
         *
         * @param s
         * @returns {*}
         */
        limitHTML: function(s) {
            //encode just not allowed tags
            s = this.encodeForbiddenTags(s);
            return s;
        }
    };
}());
