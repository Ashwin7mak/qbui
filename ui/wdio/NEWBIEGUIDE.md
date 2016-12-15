#WebdriverIO NEWBIEGUIDE.md
Written by klabak 12/15/16


##Overview:
In this guide we will document key findings and information one should know when writing tests and page objects for WebdriverIO (wdio).
This document will be especially useful if you are coming from Protractor and are new to wdio. We will keep adding to this doc as we find new things!

For more info on WebdriverIO please see their website here: [http://webdriver.io/](http://webdriver.io/)

The wdio GitHub repo is here: [https://github.com/webdriverio](https://github.com/webdriverio)

The API for all wdio functions is here: [http://webdriver.io/api.html](http://webdriver.io/api.html)

##Things To Know:

If you need more info on a particular topic please see the links above. 

###Synchronous vs Asynchronous

* All hook functions (example: **beforeAll, before, after**) in wdio are run **asynchronously**! This includes all hooks in the **wdio.conf.js** file and **ALL Jasmine hooks within the spec files**! What this means is you need to **return** any promise chains so wdio will wait for them to finish before it continues execution!
* Anything within an **it** block of a spec file is run **synchronously**. Each line of code will execute and resolve before it continues to the next line. You no longer need **then()** and **return** statements to force synchronous execution (yay)!
* However, due to the first bullet point we should **return** the last function call within any page object (PO) functions in the off chance that we need to execute one of them within a before / after hook!
* You no longer need to specify **done()** in the function definition of either a hook or an it block. There's no reason to use them anymore!
* Don't put a promise function call like ```element.getText()``` inside a Jasmine **expect** assertion. It doesn't seem to resolve it first before asserting (like Protractor does). First create a variable to hold the text value and wdio will resolve it. Then pass it to the expect function. Example:
```var recordText = elementLocator.getText();
   expect(recordText).toBe('myText');
```

###Element Locators

####browser.element()
* No longer use ```browser.element(by.className('myClass'));``` to define locators as **by.** is a Protractor convention. Use standard element locators now (css class is the easiest): ```browser.element('.ag-row');```. **Protip:** wdio locators work in the Chrome Dev console so you can test them out prior to using them in wdio!
* To query for a className use ```browser.element('.className');``` - This is a css query. Note that element will always return one element (the first one it finds that matches)
* To query for id of an element use ```browser.element('#id');```
* To query for a specific tag use ```browser.element('div');```
* To specify a subclass within a single element just chain the locators together like ```browser.element('.ag-row.editing');```
* If you want to query for a sub (aka child) element you can combine the locators into one call by putting a space between them. Example: ```browser.element('.ag-row.editing .myLinkClass');```
* If you want to query for a custom property of an element define your locator like ```element('input[type="text"]');```
* You can combine different types of locators as well if you need to ```element('input[type="text"].textField');```

####browser.elements()
* ```element.all();``` in Protractor became ```elements();``` in wdio
* ```elements();``` is a bit different from Protractor in how you access values from the returned array. ```elements();``` gives you back an array of WebElement JSON objects (which contains an ELEMENT ID and a value). To get the actual webelement you must access the **value** portion of the object with 
```elements('myLocator').value[0]```.
* You can use ```elements('myLocator').value.length``` to get the size of the array for looping through a list of elements.

###Calling wdio functions
* Since we run our tests in synchronous mode you can now resolve promise function calls to a variable! You no longer have to resolve the promise with **then()** first. Example: ```var elementText = elementLocator.getText();``` instead of ```elementLocator.getText().then(function(text){ //do something with text here  });```
* ```elementLocator.waitForVisible(ms)``` or ```browser.waitForVisible('locator string', ms)``` are both valid ways to call wdio functions (you'll see both in the API doc)
* The second convention above is used mostly when you want to pass optional parameters into the function.
* If you already have a locator variable defined you can pass the **ELEMENT** value into the second function above and wdio will figure it out (if you need to use that format). Example: ```var saveButton = element('.saveButton'); browser.waitForVisible(saveButton.value.ELEMENT, 1000);```
* To do the **inverse** of a waitFor function pass in the **true** flag to the function call. Example: ```// By setting the true flag it will do the inverse of the function (in this case wait for it to NOT be in the DOM); browser.waitForExist('.ag-row.editing', browser.waitforTimeout, true);```
* ```browser.get();``` in Protractor is now ```browser.url();``` in wdio.
* To execute raw Javascript in wdio call ```browser.execute();```. This has changed from Protractor's ```browser.executeScript();```.
* To completely pause test execution for a set amount of time in wdio use ```browser.pause(ms);```. This has changed from Protractor's ```browser.wait();``` or ```browser.sleep();``` and this actually works %100 of the time unlike Protractor.
* To resize the browser window in wdio use ```browser.windowHandleSize();```

###Page Objects
* The syntax to create page objects and how to define locators and helper functions has changed from Protractor. See the new PO files or see [http://webdriver.io/guide/testrunner/pageobjects.html](http://webdriver.io/guide/testrunner/pageobjects.html) for more info.
* All Page Objects (for now) should inherit from **e2ePageBase.po.js**. See the link above for examples.

###Other tips
* For logging information to the console use wdio's built in **logger.js** module (which is the same one we use in our qbui code!) instead of using **console.log**. Example:
```browser.logger.info('This will show up in the log output under an Info tag!');```