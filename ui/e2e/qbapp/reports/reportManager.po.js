/**
 * This file uses the Page Object pattern to define the reportManager page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/20/15.
 */

(function(){
    'use strict';

    var reportManagerPage = function() {
        // Constants
        this.REPORT_HEADER_TEXT = 'Beta > Reports > Report name 1';
        this.STAGE_HEADER_TEXT = "Welcome ABC Enterprises!";
        this.STAGE_CONTENT_TEXT = "Congratulations and welcome! You're part of a small group in the early-phase " +
                                    "QuickBase Data-Snapshot program. A pioneer program that lorems your ipsums with " +
                                    "snapshot data so you can ipsum lorem, faster!";
        this.STAGE_TIME_TITLE_TEXT = 'Latest Snapshot';
        this.STAGE_REMINDER_BUTTON_TEXT = "Send your thoughts";

        // Page Elements using Locators
        // Main div for the page
        this.layoutDivEl = element(by.className('layout-container'));

        // Header (report name)
        this.headerEl = this.layoutDivEl.element(by.className('layout-header'));
        this.headerLeftDivEl = this.headerEl.element(by.className('left-content'));

        // Stage (containing welcome message, timestamp, feedback button)
        this.stageDivEl = this.layoutDivEl.element(by.className('layout-stage'));
        // Left side of stage
        this.stageLeftDivEl = this.stageDivEl.element(by.className('left'));
        this.stageHeaderDivEl = this.stageLeftDivEl.element(by.className('header'));
        this.stageContentDivEl = this.stageLeftDivEl.element(by.css('.left > div:nth-child(2)'));
        // Right side of stage
        this.stageRightDivEl = this.stageDivEl.element(by.className('right'));
        this.stageTimeDivEl = this.stageRightDivEl.element(by.className('time'));
        this.stageTimeTitleDivEl = this.stageTimeDivEl.element(by.className('title'));
        this.stageTimeContentDivEl = this.stageTimeDivEl.element(by.className('ng-binding'));
        this.stageReminderDivEl = this.stageRightDivEl.element(by.className('reminder'));
        //this.stageReminderButton = this.stageReminderDivEl.element(by.type('button'));
        // Stage open / close button
        this.stageTabArrowEl = this.stageDivEl.element(by.css('.tab'));

        // Content (containing actual report)
        this.contentDivEl = this.layoutDivEl.element(by.className('layout-content'));
    };

    module.exports = new reportManagerPage();
}());