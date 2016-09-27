/**
 * This file uses the Page Object pattern to define the currentStackLogin page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 10/20/16
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    var e2ePageBase = require('./../../common/e2ePageBase');

    var CurrentStackLoginPage = function() {

        // Login elements
        this.userNameInputEl = element.all(by.css('input[name="loginid"]')).first();
        this.passwordInputEl = element(by.css('input[name="password"]'));
        this.loginButtonEl = element(by.css('button[name="SignIn'));

        /**
         * Login function will enter the supplied userName and password and then click the login button
         * @param userName
         * @param password
         */
        this.loginUser = function(userName, password) {
            var self = this;
            return e2ePageBase.waitForElements(this.userNameInputEl, this.passwordInputEl).then(function() {
                return self.userNameInputEl.sendKeys(userName).then(function() {
                    return self.passwordInputEl.sendKeys(password).then(function() {
                        return self.loginButtonEl.click();
                    });
                });
            });
        };

    };
    CurrentStackLoginPage.prototype = e2ePageBase;
    module.exports = CurrentStackLoginPage;
}());
