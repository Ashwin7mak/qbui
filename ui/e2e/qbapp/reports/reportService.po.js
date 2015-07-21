/**
 * This file uses the Page Object pattern to define the reportService page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */

(function(){
    'use strict';

    var reportServicePage = function() {
        // Constants

        // Page Elements using Locators
        this.reportTitleEl = element.all(by.className('header')).first();
        this.columnHeaderElList = element.all(by.repeater('col in colContainer.renderedColumns track by col.colDef.name'));
        this.recordElList = element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
    };

    module.exports = new reportServicePage();
}());