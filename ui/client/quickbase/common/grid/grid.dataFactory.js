(function() {
    'use strict';

/**
 * This service wraps the data source and adds pagination chunking

**/

//  get pages service
angular.module('qbse.grid')
    .factory('GridDataFactory', ['$q', 'gridConstants', GridDataFactory]);

function GridDataFactory($q, gridConstants) {
    return function(dataServiceFunc) {
        this.dataServiceFunc = dataServiceFunc;
        this.$q = $q;
        this.gridConstants = gridConstants;
        this.getData = getData.bind(this);
    };
}

function getData(current) {
    /*jshint validthis:true */

    var deferred = this.$q.defer();

    if (this.dataServiceFunc && typeof this.dataServiceFunc === 'function') {

        var offset = (current.pageNumber - 1) * current.pageSize;
        var rows = current.pageSize;

        //  get one extra row so that we know if there is more data to retrieve
        this.$q.when(this.dataServiceFunc(this.gridConstants.SERVICE_REQ.DATA , offset, rows+1 )).then(
            function (data) {
                var newState = {};
                var newData;

                angular.extend(newState, current);

                // the first row is the the current page number * the current page size
                // (page number is 1 based)
                //var firstRow = (newState.pageNumber - 1) * newState.pageSize;

                // request the data starting from the current pages 1st row
                // for page number of pages
                newData = data.length > rows ? data.slice(0, rows) : data;
                newState.pageBottomRow = newState.pageTopRow + newData.length;

                // is there additional data to show beyond the current page
                if (data.length > rows) {
                    newState.morePages = true;
                }
                else {
                    newState.morePages = false;
                    newState.foundEnd = newState.pageNumber;
                    newState.totalRows = ((newState.pageNumber - 1) * newState.pageSize) + data.length;
                }


                /*
                if ((newState.foundEnd && newState.pageNumber < newState.foundEnd) ||
                    (firstRow + newState.pageSize) < totalItems) {
                    newState.morePages = true;
                } else {
                    newState.morePages = false;
                    newState.foundEnd = newState.pageNumber;
                    newState.totalRows = newState.pageTopRow + newData.length;
                }
                */
                deferred.resolve({
                    newState: newState,
                    data: newData
                });
            },
            function (err) {
                console.log('error calling dataService..' + err);
                deferred.reject();
            }
        );
    } else {
        // TODO for now..if no dataService or dataService is not a function
        deferred.resolve({newState: current, data: []});
    }

    return deferred.promise;

}

})();
