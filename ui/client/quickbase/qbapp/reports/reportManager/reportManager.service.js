(function() {
    'use strict';

    angular.module('qbapp.reports.manager').service('ReportService', function() {

        var d = new Date();
        d.setDate(d.getDate() - 1);

        var service = {
            //  TODO: use promise
            get: function(reportId) {
                var report = {
                    id: reportId,
                    name: 'Report name',
                    company: 'ABC Enterprises',
                    snapshot: d.toLocaleString(),
                    data: [
                            {id: '1', name: 'ABC Camping', phoneNumber: '555-333-1111', email:'bill@abccampgrounds.com', balance:'$209.87'},
                            {id: '2', name: 'Rochester Electric', phoneNumber: '532-665-1111', email:'JRE@RochesterElectric.com', balance:'$459.87'},
                            {id: '3', name: 'Cool Car Repair', phoneNumber: '617-988-8897', email:'John@coolcars.com', balance:'$79.00'},
                            {id: '4', name: 'Cambridge Hobby Shopt', phoneNumber: '617-533-1111', email:'Jan@cambridgehobbyshop.com', balance:'$1,599.10'},
                            {id: '5', name: 'REI Hiking', phoneNumber: '508-990-1111', email:'Mary@rei.com', balance:'$111.83'},
                        {id: '1', name: 'ABC Camping', phoneNumber: '555-333-1111', email:'bill@abccampgrounds.com', balance:'$209.87'},
                        {id: '2', name: 'Rochester Electric', phoneNumber: '532-665-1111', email:'JRE@RochesterElectric.com', balance:'$459.87'},
                        {id: '3', name: 'Cool Car Repair', phoneNumber: '617-988-8897', email:'John@coolcars.com', balance:'$79.00'},
                        {id: '4', name: 'Cambridge Hobby Shopt', phoneNumber: '617-533-1111', email:'Jan@cambridgehobbyshop.com', balance:'$1,599.10'},
                        {id: '5', name: 'REI Hiking', phoneNumber: '508-990-1111', email:'Mary@rei.com', balance:'$111.83'},
                        {id: '1', name: 'ABC Camping', phoneNumber: '555-333-1111', email:'bill@abccampgrounds.com', balance:'$209.87'},
                        {id: '2', name: 'Rochester Electric', phoneNumber: '532-665-1111', email:'JRE@RochesterElectric.com', balance:'$459.87'},
                        {id: '3', name: 'Cool Car Repair', phoneNumber: '617-988-8897', email:'John@coolcars.com', balance:'$79.00'},
                        {id: '4', name: 'Cambridge Hobby Shopt', phoneNumber: '617-533-1111', email:'Jan@cambridgehobbyshop.com', balance:'$1,599.10'},
                        {id: '5', name: 'REI Hiking', phoneNumber: '508-990-1111', email:'Mary@rei.com', balance:'$111.83'},
                        {id: '1', name: 'ABC Camping', phoneNumber: '555-333-1111', email:'bill@abccampgrounds.com', balance:'$209.87'},
                        {id: '2', name: 'Rochester Electric', phoneNumber: '532-665-1111', email:'JRE@RochesterElectric.com', balance:'$459.87'},
                        {id: '3', name: 'Cool Car Repair', phoneNumber: '617-988-8897', email:'John@coolcars.com', balance:'$79.00'},
                        {id: '4', name: 'Cambridge Hobby Shopt', phoneNumber: '617-533-1111', email:'Jan@cambridgehobbyshop.com', balance:'$1,599.10'},
                        {id: '5', name: 'REI Hiking', phoneNumber: '508-990-1111', email:'Mary@rei.com', balance:'$111.83'}
                ]};
                return report;
            }
        };

        return service;
    });

}());
