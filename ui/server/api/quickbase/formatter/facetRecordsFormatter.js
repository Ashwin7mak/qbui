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
    userId: for user data types, will include the userId of the distinct value
    errorMessage: string. If values array is empty, a message indicating why the values is empty.
            For example this could be because all values are null or because the table is larger than 10K rows or because the facet field has more than 200 distinct values.
 }
 Example-
 Consider a report with 3 facetFids - fid7 (type text), fid8 (type date) and fid9 (some type with more than 200 distinct values).
 FacetRecordsArray returned by getFacets Api:
 [[
 [{7, "abc"}] -- Assumption: All values over the list of records for a particular field will be unique. This is handled by server.
 [{7, "def"}]
 [{7, "xyz"}]
 ]
 [
 [{8, "02/16/2015"}] -- Assumption: each date or date time field will only have 2 records: one for min value and another for max value. This is handled by server
 [{8, "02/16/2016"}]
 ]
 [
 [{10, {code: 100024, message: "Number of records is too big...."}}] -- Example of error message returned by server - this indicates no results were sent back and this is the reason why.
 ]]
 Using the field's meta data:
 Field 7 -                              Field 8 -               Field 9 -
 {                                      {                       ...
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
     {
         hasBlanks: false
         id: 9
         name: "User Field"
         type: "USER"
         values: [{"John Smith", userId: 111", {...}]
     }
     {
         id: 10
         name: "Some name"
         type: "TEXT"
         errorCode: 100024
     }
 ]
 */
(function() {
    'use strict';

    var recordFormatter = require('./recordFormatter')();
    var constants = require('../../constants');

    module.exports = function() {

        function checkForFacetErrorCode(facetRecords) {
            if (facetRecords.length === 1 && facetRecords[0][0].value && facetRecords[0][0].value.code) {
                return facetRecords[0][0].value.code;
            }
            return null;
        }

        function isBlank(inValue) {
            if (inValue === null) {return true;}
            if (inValue === 'undefined') {return true;}
            if (inValue === false) {return false;}
            if (inValue === true) {return false;}
            if (inValue === 0) {return false;}
            return !inValue;
        }

        var facetRecordsFormatter = {

            //Given an array of array of records, array of fields format the record values into facet objects
            formatFacetRecords: function(facetRecordsArray, fields) {
                if (Array.isArray(facetRecordsArray) && Array.isArray(fields) && facetRecordsArray.length > 0 && fields.length > 0) {
                    var facetList = [];
                    var fieldsMap = {};

                    //populate the fieldsMap for easy access to fields by id
                    fields.forEach(function(entry) {
                        fieldsMap[entry.id] = entry;
                    });

                    // Loop through the facets for this report
                    for (let facetRecords of facetRecordsArray) {

                        var facet = {};

                        //  Basic information about the facet...the fid, name and data type
                        facet.id = facetRecords[0][0].id;
                        facet.name = fieldsMap[facet.id].name;
                        facet.type = fieldsMap[facet.id].datatypeAttributes.type;

                        // check for any facet business rule errors
                        var facetErrorCode = checkForFacetErrorCode(facetRecords);
                        if (facetErrorCode) {
                            facet.errorCode = facetErrorCode;
                        } else {
                            //  No error...set the distinct facet information
                            facet.values = [];

                            //  iterate over the list of records and format the record values as appropriate
                            recordFormatter.formatRecords(facetRecords, fields);

                            //  Format of the facet data is set based on the following supported data types:
                            //      DATE/DATETIME:  values:[{value: {min:'',max:''}}]
                            //      USER:   values:[{value:{string: 'val1',userId:'user1'}},...,{value:{string:'valN',userId:'userN')}]
                            //      TEXT:   values:[{value:'val1'},{value:'val2'},...,{value:'valN'}]
                            //      CHECKBOX: values:[{value:'val1'},{value:'val2'},...,{value:'valN'}]
                            var facetData = {};
                            var hasBlanks = false;

                            if (facet.type === constants.DATE || facet.type === constants.DATE_TIME) {
                                //  initialize
                                facetData.value = {
                                    min: '',
                                    max: ''
                                };

                                //  2 rows are expected for DATES;  row 1 is the minimum date  and row 2
                                //  is the maximum date that make up the facet range
                                if (facetRecords && facetRecords.length === 2) {
                                    facetData.value.min = facetRecords[0][0].display;
                                    facetData.value.max = facetRecords[1][0].display;
                                }
                                facet.values.push(facetData);

                                //  test if there is blank min or max date returned
                                if (isBlank(facetData.value.min) || isBlank(facetData.value.max)) {
                                    hasBlanks = true;
                                }
                            } else {
                                for (let record of facetRecords) {
                                    if (facet.type === constants.USER) {
                                        //  initialize data structure for a USER
                                        facetData = {
                                            value: {
                                                string: record[0].display,
                                                userId: ''
                                            }
                                        };
                                        if (record[0].value) {
                                            facetData.value.userId = record[0].value.userId;
                                        }
                                    } else {
                                        facetData = {
                                            value: record[0].display
                                        };
                                    }

                                    facet.values.push(facetData);

                                    //  test if there is blank data returned..could have 'false' as display
                                    //  value, so doing a negative test is not good enough
                                    if (isBlank(record[0].display)) {
                                        hasBlanks = true;
                                    }
                                }
                            }

                            facet.hasBlanks = hasBlanks;

                        }
                        facetList.push(facet);
                    }
                    return facetList;
                }
                return [];
            }
        };
        return facetRecordsFormatter;
    };
}());
