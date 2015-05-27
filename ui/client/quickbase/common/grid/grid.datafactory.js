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
        //this.getColumns = getColumns.bind(this);
    };
}

//function getColumns() {
    /*jshint validthis:true */
//    if (this.service.getColumns) {
//        return this.service.getColumns();
//    }
//    else {
//        return this.$q.then([]);
//    }
//}

function getData(current) {
    /*jshint validthis:true */

    var deferred = this.$q.defer();

    if (this.dataServiceFunc && typeof this.dataServiceFunc === 'function') {

        //var offset = (current.pageNumber - 1) * current.pageSize;
        //var rows = current.pageSize;

        this.$q.when(this.dataServiceFunc(this.gridConstants.SERVICE_REQ.DATA)).then(
            function (data) {
                var newState = {};
                var newData;

                angular.extend(newState, current);

                // the first row is the the current page number * the current page size
                // (page number is 1 based)
                var firstRow = (newState.pageNumber - 1) * newState.pageSize;

                // request the data starting from the current pages 1st row
                // for page number of pages
                newData = data.slice(firstRow, firstRow + newState.pageSize);
                newState.pageBottomRow = newState.pageTopRow + newData.length;

                // the files size is known in this jsonfile case
                // todo : remove
                var totalItems = data.length;

                // determine if there is more data
                // there is more if we know the end page and we are less that that or
                // if we the pages starting row + page size is less than total rows
                if ((newState.foundEnd && newState.pageNumber < newState.foundEnd) ||
                    (firstRow + newState.pageSize) < totalItems) {
                    newState.morePages = true;
                } else {
                    newState.morePages = false;
                    newState.foundEnd = newState.pageNumber;
                    newState.totalRows = newState.pageTopRow + newData.length;
                }

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
