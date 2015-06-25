(function() {
    'use strict';
    angular
        // define the QuickBase (qbse) Grid Module
        //depends on the ui-grid and ui-selection see: http://ui-grid.info/
        .module('qbse.grid', [
            'ui.grid',
            'ui.grid.selection',
            'ui.grid.pagination',
            'ui.grid.autoResize',
            'ui.grid.resizeColumns',
            'ngResource',
            'qbse.api',
            'ngLodash'
        ]);

})();
