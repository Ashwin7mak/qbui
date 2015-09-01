(function() {
    'use strict';
    /***
     * This service is used to manage the state of the pages of the data for a grid
     **/
    angular
            .module('qbse.grid')
            .factory('PagesHandler', ['$http', '$log', 'GridDataFactory', PagesHandlerFactory]);

    function PagesHandlerFactory($http, $log, GridDataFactory) {

        var PagesHandler = function(dataServiceFunc, gridConstants, gridOptions) {
            this.http = $http;
            this.gridConstants = gridConstants;
            this.gridOptions = gridOptions;
            this.dataServiceFunc = dataServiceFunc;
            this.current = {
                pageSize     : this.gridOptions.paginationPageSize,
                pageNumber   : 1,
                pageTopRow   : 0,
                pageBottomRow: null, //gets set once data is fetched
                totalRows    : null, //gets set once end of data is reached
                foundEnd     : null, // get set once end of data is encountered
                sort         : null
            };
            //data fetcher
            this.dataFact = new GridDataFactory(this.dataServiceFunc);
        };

        PagesHandler.prototype.setGridOptions = function(gridOptions) {
            this.gridOptions = gridOptions;
        };

        PagesHandler.prototype.loadCurrentPage = function() {
            var context = this;
            this.dataFact.getData(this.current).then(function(resolved) {
                context.current = resolved.newState;
                context.gridOptions.data = resolved.data;
            }, function(error) {
                // getData rejected, log the error with: console.log('error', error);
                //TODO error message to screen & change to use tbd logging interface and emit notification
                $log.error('ERROR ' + JSON.stringify(error));
            });
        };

        // go to a 1st with given page sizing
        PagesHandler.prototype.updatePageSize = function(pageSize) {
            if (pageSize > 0 && pageSize <= this.gridConstants.MAX_ROWS_PER_PAGE) {
                this.gridOptions.paginationPageSize = pageSize;
                this.gridOptions.paginationCurrentPage = 1;
            }
        };

        PagesHandler.prototype.noNext = function() {
            var noNext = false;
            if (this.current.foundEnd) {
                // check if this page last row is the end
                if (this.current.pageBottomRow >= this.current.totalRows) {
                    noNext = true;
                }
            }
            return noNext;
        };

        PagesHandler.prototype.noPrev = function() {
            var noPrev = false;
            if (this.current.pageTopRow === 0) {
                // check if this page 1st row is the start
                noPrev = true;
            }
            return noPrev;
        };

        // go to a new page with given page sizing
        PagesHandler.prototype.updatePages = function(newPage, pageSize) {
            if (this.current.foundEnd) {
                // make sure this page is within the known end to continue
                if ((newPage - 1) * pageSize >= this.current.totalRows) {
                    return;
                }
            }
            this.current.pageNumber = newPage;
            this.current.pageSize = pageSize;
            this.current.pageTopRow = (newPage - 1) * pageSize;

            this.loadCurrentPage();
            this.current.pageBottomRow = this.current.pageTopRow + this.gridOptions.data.length;
        };

        // return the total number of row if it has been determined
        PagesHandler.prototype.getTotalRowsMsg = function() {
            if (this.current.foundEnd) {
                return this.current.totalRows;
            }
        };

        // get the total number of pages if its known
        PagesHandler.prototype.getTotalPages = function() {
            if (this.current.morePages) {
                return (this.current.foundEnd) ? this.current.foundEnd : Number.MAX_VALUE;
            } else {
                return this.current.pageNumber;
            }
        };

        return PagesHandler;
    }

})();
