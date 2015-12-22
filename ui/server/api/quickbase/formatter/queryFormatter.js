/*
 Given a facet expression format it into a query string
  facet expression looks like an array of facetObjects [{fid: fid1, fieldtype:'', values: [value1, value2]}, {fid: fid2, fieldtype:'', values: [value3, value4]}, {fid: fid3, fieldtype:'DATE', values: [value3, value4]}]
  corresponding query expression should look like ({fid1.EX.value1}OR{fid1.EX.value2})AND({fid2.EX.value3}OR{fid1.EX.value4})AND({fid2.OAF.value3}AND{fid1.OBF.value4})..
 */
(function() {
    'use strict';
    var consts = require('../../constants');

    module.exports = {
        format: function(facetExpression) {
            if (!facetExpression) {
                return '';
            }

            var queryString = "";
            for (var i = 0; i < facetExpression.length; i++){
                if (queryString !== "") {
                    queryString += consts.QUERY_AND;
                }

                facetExpression[i] = decodeURI(facetExpression[i]);
                facetExpression[i] = JSON.parse(facetExpression[i]);

                if (!facetExpression[i].values) {
                    continue;
                }
                queryString += "(";
                var subquery = "";

                if (facetExpression[i].fieldtype === consts.DATE || facetExpression[i].fieldtype === consts.DATE_TIME){
                    if (facetExpression[i].values.length !== 2) {
                        continue;
                    }
                    subquery = "{" + facetExpression[i].fid.toString() + consts.OPERATOR_ONORBEFORE + "'" + facetExpression[i].values[0] + "'}" +
                        consts.QUERY_OR +
                        "{" + facetExpression[i].fid.toString() + consts.OPERATOR_ONORAFTER + "'" + facetExpression[i].values[1] + "'}";
                } else {
                    for (var j = 0; j < facetExpression[i].values.length; j++) {
                        if (subquery !== "") {
                            subquery += consts.QUERY_OR;
                        }
                        subquery += "{" + facetExpression[i].fid.toString() + consts.OPERATOR_EQUALS + "'" + facetExpression[i].values[j] + "'}";
                    }
                }
                queryString += subquery + ")";
            }
            return queryString;
        }
    };
}());

