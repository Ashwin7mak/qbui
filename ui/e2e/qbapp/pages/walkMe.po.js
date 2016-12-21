(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');

    var WalkMePage = function() {
        this.walkMeInnerDiv = element(by.className('walkme-custom-balloon-inner-div'));
        this.walkMeTopDiv = this.walkMeInnerDiv.element(by.className('walkme-custom-balloon-top-div'));
        this.walkMeTitle = this.walkMeTopDiv.element(by.className('walkme-custom-balloon-title'));
        this.walkMeBottonDiv = this.walkMeInnerDiv.element(by.className('walkme-custom-balloon-bottom-div'));
        this.walkMeNextBtn = this.walkMeBottonDiv.element(by.className('walkme-custom-balloon-next-button'));
        this.walkMeDoneBtn = this.walkMeBottonDiv.element(by.className('walkme-custom-balloon-done-button'));

        //Click the Manage User Access To Mercury Toggle
        this.dismissWalkMe = function() {
            var self = this;
            e2ePageBase.waitForElement(self.walkMeInnerDiv).then(function() {
                expect(self.walkMeTitle.getAttribute('textContent')).toBe('Welcome to Mercury!');
                return self.walkMeNextBtn.click().then(function() {
                    e2ePageBase.waitForElement(self.walkMeNextBtn);
                    //expect (self.walkMeTitle).toBe('Your app. Now in two views: Mercury & Classic');
                }).then(function() {
                    return self.walkMeNextBtn.click().then(function() {
                        e2ePageBase.waitForElement(self.walkMeNextBtn);
                        expect(self.walkMeTitle.getAttribute('textContent')).toBe("It's yours! We hope you'll invite your users, too.");
                    });
                }).then(function() {
                    return self.walkMeNextBtn.click().then(function() {
                        e2ePageBase.waitForElement(self.walkMeNextBtn);
                        expect(self.walkMeTitle.getAttribute('textContent')).toBe("We're still building, so please be patient");
                    });
                }).then(function() {
                    return self.walkMeNextBtn.click().then(function() {
                        e2ePageBase.waitForElement(self.walkMeDoneBtn);
                        expect(self.walkMeTitle.getAttribute('textContent')).toBe("C'mon, we'll show you around");
                    });
                }).then(function() {
                    //click done
                    return self.walkMeDoneBtn.click().then(function() {
                        return e2ePageBase.waitForElementToBeInvisible(self.walkMeTitle);
                    });
                });
            });
        };


    };
    WalkMePage.prototype = e2ePageBase;
    module.exports = WalkMePage;
}());
