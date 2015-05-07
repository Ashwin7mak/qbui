(function() {
    'use strict';
    /***
     * This service is used to manage the state of the pages of the data for a grid
     **/
    angular
        .module('qbse.grid')
        .factory('PagesHandler',[ '$http', PagesHandlerFactory]);

    function PagesHandlerFactory($http) {

        var PagesHandler = function(gridConstants, gridOptions, getTotalPagesMethod) {
            this.http = $http;
            this.gridConstants = gridConstants;
            this.gridOptions = gridOptions;
            this.current = {
                pageSize  : this.gridConstants.ROWS_PER_PAGE,
                pageNumber: 1,
                pageTopRow: 0,
                sort      : null
            }
        };

        // handle paging of rows
        PagesHandler.prototype.sortList = function(grid, sortColumns) {
            if (sortColumns.length === 0) {
                this.current.sort = null;
            } else {
                this.current.sort = sortColumns[0].sort.direction;
            }
            this.getPage();
        };

        PagesHandler.prototype.updatePages = function(newPage, pageSize) {
            this.current.pageNumber = newPage;
            this.current.pageSize = pageSize;
            this.current.pageTopRow = (newPage - 1) * pageSize;

            this.getPage();
            this.current.pageBottomRow = this.current.pageTopRow + this.gridOptions.data.length;
        };

        PagesHandler.prototype.getTotalRowsMsg = function() {
            if (this.current.foundEnd) {
                return this.current.totalRows;
            }
        };

        PagesHandler.prototype.getTotalPages = function() {
            if (this.current.morePages) {
                return (this.current.foundEnd) ? this.current.foundEnd : Number.MAX_VALUE;
            } else {
                return this.current.pageNumber;
            }
        };

        PagesHandler.prototype.getPage = function() {
            var url = 'quickbase/common/mockdata/1000.json';
            var self = this;
            $http.get(url)
                .success(function(data) {
                    self.gridOptions.totalItems = 1000;

                    var current = self.current;

                    var firstRow = ( current.pageNumber - 1) *
                        current.pageSize;
                    self.gridOptions.data = data.slice(firstRow, firstRow +  current.pageSize);
                    current.pageBottomRow =  current.pageTopRow +  self.gridOptions.data.length;

                    if (( current.foundEnd &&  current.pageNumber < current.foundEnd ) ||
                        (firstRow +  current.pageSize) < self.gridOptions.totalItems) {
                        current.morePages = true;
                    } else {
                        current.morePages = false;
                        current.foundEnd =  current.pageNumber;
                        current.totalRows =  current.pageTopRow +  self.gridOptions.data.length;
                    }
                });
        };
    return PagesHandler;
    }

})();
