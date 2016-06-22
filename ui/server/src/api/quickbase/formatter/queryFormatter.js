/*
 Given a facet expression format it into a query string
  facet expression looks like an array of facetObjects [{fid: fid1, fieldtype:'', values: [value1, value2]}, {fid: fid2, fieldtype:'', values: [value3, value4]}, {fid: fid3, fieldtype:'DATE', values: [value3, value4]}]
  corresponding query expression should look like ({fid1.EX.value1}OR{fid1.EX.value2})AND({fid2.EX.value3}OR{fid1.EX.value4})AND({fid2.OAF.value3}AND{fid1.OBF.value4})..
 */
(function() {
    'use strict';
    var Promise = require('bluebird');
    var consts = require('../../../../../common/src/constants');
    var log = require('../../../logger').getLogger();

    module.exports = {
        format: function(req) {
            var deferred = Promise.pending();

            var queryString = "";
            if (req && req.query) {
                var facetExpression = req.query[consts.REQUEST_PARAMETER.FACET_EXPRESSION];
                if (facetExpression) {
                    log.debug("facetExpression to parse: " + facetExpression);

                    for (var i = 0; i < facetExpression.length; i++) {
                        if (queryString !== "") {
                            queryString += consts.QUERY_AND;
                        }
                        // when the request comes from server since we are picking up a part of the url the facets are passed in as a string of json
                        if (typeof facetExpression[i] === "string") {
                            facetExpression[i] = JSON.parse(facetExpression[i]);
                        }

                        if (!facetExpression[i].values) {
                            continue;
                        }
                        var subquery = "";

                        if (facetExpression[i].fieldtype === consts.DATE || facetExpression[i].fieldtype === consts.DATE_TIME) {
                            if (facetExpression[i].values.length !== 2) {
                                continue;
                            }
                            queryString += "(";
                            subquery = "{" + facetExpression[i].fid.toString() + consts.OPERATOR_ONORBEFORE + "'" + facetExpression[i].values[0] + "'}" +
                                consts.QUERY_AND +
                                "{" + facetExpression[i].fid.toString() + consts.OPERATOR_ONORAFTER + "'" + facetExpression[i].values[1] + "'}";
                        } else {
                            queryString += "(";
                            for (var j = 0; j < facetExpression[i].values.length; j++) {
                                if (subquery !== "") {
                                    subquery += consts.QUERY_OR;
                                }
                                subquery += "{" + facetExpression[i].fid.toString() + consts.OPERATOR_EQUALS + "'" + facetExpression[i].values[j] + "'}";
                            }
                        }
                        queryString += subquery + ")";
                    }
                    log.debug("facetExpression parsed into query: " + queryString);
                }
            }

            deferred.resolve(queryString);

            return deferred.promise;
        }
    };
}());

