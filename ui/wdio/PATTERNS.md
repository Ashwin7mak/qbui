![alt text](Primary_Logo_RGB_Purple.png "test")
# WDIO Patterns and Best Practices
Patterns and techniques for UI automation on the Mercury platform.
##Page Objects
Page objects should follow ES6 standards as described here:
http://webdriver.io/guide/testrunner/pageobjects.html#description

For example:
```javascript
'use strict';
let topNavPO = requirePO('topNav');

class formBuilderPage {
  // page elements
  get cancelBtn() {
    // CANCEL (form) button in footer bar
    return browser.element('.alternativeTrowserFooterButton');
    ...
    }
  }
```
##### Page elements:
1. As a general rule, you should define a page element for every UI component you observe or interact with in your tests. There may be specific reasons why your tests need to use inline locators instead; the reasons for these exceptions s/b documented in comments
1. One-line collapsible comment w/useful description for each element (not just repetition of the element name)
1. Locators s/b CSS exclusively as far as possible, only use xpath when absolutely required (e.g. match by text or to navigate UP in DOM)
1. Locators should contain the minimum # of DOM references required for unique identification, i.e. don't be overly specific - keep it simple.  It is acceptable to express ancestry in locators like so: 
```javascript
get reportTitle: {
  return browser.element('.formContainer .qbPanelHeaderTitleText');
  }
```
unless the same parent appears in more than one locator, in which case the parent s/b a separate element, like so:
```javascript
get formContainer: {
  return browser.element('.formContainer');
  }

get reportTitle: {
  return formContainer.element('.qbPanelHeaderTitleText');
  }
```
##### Page methods:
```javascript
cancel() {
   // Clicks on CANCEL in the form builder and dismisses the dirty form dlg
   this.cancelBtn.click();
   this.dirtyForm_Dismiss();
   return this;
   }
``` 
Page methods should always return "this" (except for 'getters' which return useful test data) so that you can chain calls like so:
```javascript
let newFields = formBuilderPO.cancel().open().getFieldLabels();
```
##### Open question: how to extend base class (e2ePageBase) using ES6?
## Test Classes
* Test classes run in parallel, runtime s/b < 10 minutes per class  - otherwise break it into multiple smaller classes
* Disabled tests should always include comment citing a JIRA issue # to trigger review once the issue is fixed
## Anti-Patterns
* In general, locators should appear exclusively as "web elements" in page objects; they should not appear in page methods nor tests - because they're not reusable in those contexts.  Whenever "inline locators" are necessary or intentional for whatever reason, these exceptions s/b documented with inline comments.
* Don't use ToBeTruthy/Falsy:
https://vincenttunru.com/toBeTruthy-vs-toBe-true/
## Test Execution
https://jenkins1.ci.quickbaserocks.com/view/Try%20UX%20Builds/

Prior to merging your PR, run try-flow-e2e at least three times without any errors, then run try-flow-ui without any errors
## GitHub
PR names should always include the corresponding JIRA story # (if one exists), e.g. "MC-441 existing field tests".  If you don't have a corresponding JIRA story, you probably should - so that your work on the PR can be properly tracked in JIRA.
## Tips & Tricks
To iterate over an array & generate a 2nd array based on it:
```javascript
return labels.value.map(function(label) {
  return label.getText();
  }
```
