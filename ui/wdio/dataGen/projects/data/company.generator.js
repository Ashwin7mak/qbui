/**
 * Generate a company with a random name, url, phone
 * Created by Claire on April 25, 2017.
 */
module.exports = function(chance) {
    'use strict';
    const DEFAULT_NUM_COMPANIES = 10;
    const RANK_RANGE ={min:10, max:50};
    const fs = require('fs');
    let usedName = 0;
    const companies = [
        "Apple", "Microsoft", "AT & T", "IBM", "Johnson & Johnson", "Deer",
        "Dataware", "Intuit", "QuickBase", "Walgreens", "Black & Decker", "Tesla",
        "Ford", "Staples", "Boeing", "Intel", "Motorola", "FedEx", "Cisco", "Heliosety Energy",
        "Good Idea",
    ];

    function init() {
        usedName = 0;
    }
    function getNextName() {
        return usedName < companies.length ? companies[usedName++] : chance.capitalize(chance.word());
    }
    chance.mixin({
        company: function(options) {
            let name = options && options.name ? options.name : getNextName();
            let rank = chance.integer(RANK_RANGE);
            let email = options && options.email ? options.email : chance.email(options);
            let url = options && options.url ? options.url : chance.url(options);
            let phone = chance.phone(Object.assign({formatted: false}, options));

            return {
                name,
                rank,
                email,
                url,
                phone,
            };
        }
    });

    const fidToProp = {
        6 : 'name',
        7 : 'rank',
        8 : 'email',
        9 : 'url',
        10 : 'phone',
    };

    const propToFid = {
        'name' : 6,
        'rank' : 7,
        'email' : 8,
        'url' : 9,
        'phone' : 10,
    };


    let api = {
        init,

        getPropFromFid : function(fid) {
            return fidToProp[fid];
        },

        getFidFromProp : function(prop) {
            return propToFid[prop];
        },

        addSchemaFields: function(tableToFieldToFieldTypeMap, tableCompaniesName, addColumn) {
            //Company table is parent to Projects table
            tableToFieldToFieldTypeMap[tableCompaniesName] = {};
            addColumn(tableToFieldToFieldTypeMap[tableCompaniesName], e2eConsts.dataType.TEXT, 'Name', {unique: true});
            addColumn(tableToFieldToFieldTypeMap[tableCompaniesName], e2eConsts.dataType.NUMERIC, 'Rank');
            addColumn(tableToFieldToFieldTypeMap[tableCompaniesName], e2eConsts.dataType.EMAIL_ADDRESS, 'Email', {unique: true});
            addColumn(tableToFieldToFieldTypeMap[tableCompaniesName], e2eConsts.dataType.URL, 'URL');
            addColumn(tableToFieldToFieldTypeMap[tableCompaniesName], e2eConsts.dataType.PHONE_NUMBER, 'Phone', {unique: true});
        }
    };
    return api;
};
