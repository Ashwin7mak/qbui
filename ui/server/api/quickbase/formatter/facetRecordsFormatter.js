/*
 Given raw records input and field meta data from the Java capabilities API, this module is capable of
 formatting the records into a FacetItem type object which looks like {id, name, type, [values]}
 where values are display formatted version of the raw record field values by addition of a display properties attribute.
 Recordformatter is used for the display formatting.
 */
(function() {
    'use strict';
    var _ = require('lodash');
    var consts = require('../../constants');
    var recordFormatter = require('./recordFormatter')();


    module.exports = function() {

        var facetRecordsFormatter = {
            //Given an array of array of records, array of fields format the record values into facet objects
            formatFacetRecords: function(facetRecordsArray, fields) {
                if (facetRecordsArray && fields) {
                    var facetList = [];

                    //for each array of records per facet
                    for (let facetRecords of facetRecordsArray){
                        //display format the records
                        var fieldsMap = {}; //also get back the fieldsMap so we dont need to iterate over fields again
                        let formattedFacetRecords = recordFormatter.formatRecords(facetRecords, fields, fieldsMap);

                        //populate a facet object
                        var facet = {};
                        //all records in this list should contain same fid so just pick it from the 1st one
                        facet.id = formattedFacetRecords[0][0].id;
                        //get the facet field based on the fid
                        var relatedFacetField = fieldsMap[facet.id];
                        facet.name = relatedFacetField.name;
                        facet.type = relatedFacetField.datatypeAttributes.type;
                        //now iterate over the records a second time to get just the values.
                        facet.values = [];
                        for (let record of facetRecords){
                            //each record should only have one field here so just open it up
                            facet.values.push(record[0].display);
                        }
                        facetList.push(facet);
                    }
                    return facetList;
                }
                return facetRecordsArray;
            }
        };
        return facetRecordsFormatter;
    };
}());
