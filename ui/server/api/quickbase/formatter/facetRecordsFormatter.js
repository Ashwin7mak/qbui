/*
 Given raw records input and field meta data from the Java capabilities API, this module is capable of
 formatting the records into a FacetItem type object which looks like {id, name, type, hasBlanks, [values]}
 where values are display formatted version of the raw record field values by addition of a display properties attribute.
 Recordformatter is used for the display formatting.
 Terminology used:
 A facetRecord is a List<Record> for each facetFid, where each record has only one field and its value.
 A facetRecordArray is a List<FacetRecord>
 A facet object is a an object that contains all relevant data required by the client to be able to render the dynamic filters.
 A facetList is an array of Facet objects.
 Facet object {
    id: numeric. Facet field's id
    type: string. Facet field's datatype
    name: string. Facet field's name
    values: array. Array of distinct values for the facet field that the user can filter the report on.
    hasBlanks: boolean. Set to true of any of the values for this field was found to be null or empty.
    //TODO: add the errorMessage
    errorMessage: string. If values array is empty, a message indicating why the values is empty.
            For example this could be because all values are null or because the table is larger than 10K rows or because the facet field has more than 200 distinct values.
 }
 Example-
 Consider a report with 2 facetFids - fid7 (type text) and fid8 (type date).
 FacetRecordsArray returned by getFacets Api:
 [[
 [{7, "abc"}] -- Assumption: All values over the list of records for a particular field will be unique. This is hanlded by server.
 [{7, "def"}]
 [{7, "xyz"}]
 ]
 [
 [{8, "02/16/2015"}] -- Assumption: each date or date time field will only have 2 records: one for min value and another for max value. This is handled by server
 [{8, "02/16/2016"}]
 ]]
 Using the field's meta data:
 Field 7 -                              Field 8 -
 {                                      {
 id: 7                                  id: 8
 name: "Text Field"                     name: "Date Field"
 appearsByDefault: true                 appearsByDefault: true
 builtIn: false                         builtIn: false
 dataIsCopyable = true                  dataIsCopyable: true
 datatypeAttributes: {                  datatypeAttributes: {
 type:"TEXT"                             type:"DATE"
 ...                                     ...
 }                                      }
 ...                                    ...
 }                                      }
 The facetList would  look like -
 [
    {
        hasBlanks: false
        id: 7
        name: "Text Field"
        type: "TEXT"
        values: ["abc", "def", "xyz"]
     }
     {
         hasBlanks: false
         id: 8
         name: "Date Field"
         type: "DATE"
         values: ["02/16/2015", "02/16/2016"]
     }
 ]
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
                if (Array.isArray(facetRecordsArray) && Array.isArray(fields) && facetRecordsArray.length > 0 && fields.length > 0) {
                    var facetList = [];
                    let fieldsMap = {};
                    //populate the fieldsMap for easy access to fields by id
                    fields.forEach(function(entry) {
                        fieldsMap[entry.id] = entry;
                    });
                    //for each array of records per facet
                    for (let facetRecords of facetRecordsArray) {
                        //display format the records
                        let formattedFacetRecords = recordFormatter.formatRecords(facetRecords, fields);
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
                        facet.hasBlanks = false;
                        for (let record of facetRecords) {
                            //each record should only have one field here so just open it up
                            facet.values.push(record[0].display);
                            if (!record[0].display) {
                                facet.hasBlanks = true;
                            }
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
