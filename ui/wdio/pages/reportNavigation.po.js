(function() {
    'use strict';
    let e2ePageBase = requirePO('e2ePageBase');

    module.exports = Object.create(e2ePageBase, {
        nextPageButton: {get: function() {return browser.element('.nextButton');}},
        prevPageButton: {get: function() {return browser.element('.previousButton');}},
        rowNumbers: {get: function() {return browser.element('.pageNumbers');}}, // pageNumbers is a misnomer
        recordsCount: {get: function() {return browser.element('.recordsCount');}},
        reportNavigation: {get: function() {return browser.element('.reportNavigation');}},
    });
}());
