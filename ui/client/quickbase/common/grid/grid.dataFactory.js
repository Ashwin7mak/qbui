(function() {
    'use strict';

    /**
     * This service wraps the data source and adds pagination chunking
     **/

    //  get pages service
    angular.module('qbse.grid')
        .factory('GridDataFactory', ['$q', '$log', 'gridConstants', GridDataFactory]);

    function GridDataFactory($q, $log, gridConstants) {
        return function(dataServiceFunc) {
            this.dataServiceFunc = dataServiceFunc;
            this.$q = $q;
            this.gridConstants = gridConstants;
            this.getData = getData.bind(this);
            this.$log = $log;
        };
    }

    function getData(current) {
        /*jshint validthis:true */

        var deferred = this.$q.defer();
        var offset = (current.pageNumber - 1) * current.pageSize;
        var rows = current.pageSize;

        if (this.dataServiceFunc && typeof this.dataServiceFunc === 'function' && rows > 0) {

            //  for paging, get one extra row so that we know if there is more data to retrieve.
            this.$q.when(this.dataServiceFunc(this.gridConstants.SERVICE_REQ.DATA, offset, rows + 1)).then(
                function(data) {
                    var newState = {};
                    var newData;

                    angular.extend(newState, current);

                    // unless we are on the last page, will have one extra row in the result set..need to remove
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

                    deferred.resolve({
                        newState: newState,
                        data    : newData
                    });
                },
                function(err) {
                    this.$log.error('error calling dataService..' + err);
                    deferred.reject();
                }
            );
        } else {
            deferred.resolve({newState: current, data: []});
        }

        return deferred.promise;

    }

})();
