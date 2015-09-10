#Protractor UI E2E Documentation

##Document Overview:

&lt;Add Goals&gt;

&lt;Scope of document&gt;

&lt;Table of Contents&gt;

##QuickBase UI Architecture Overview:

AngularJS for browser client code (MVC framework) -&gt; Node.js web
server code (Express framework) -&gt; Java API REST service

&lt;Picture of architecture here&gt;

AngularJS is a JavaScript framework for dynamic web apps. It lets you
use HTML as your template language and lets you extend HTML’s syntax to
express your application’s components clearly and succinctly. In short,
it is a client side framework that interacts with your HTML (in the
client’s web browser).

<https://angularjs.org/>

Things it does:

* Manipulates the DOM
* Allows you to write custom HTML declarations
* Manages state of model(s)
* Integrates with other UI tools

Node.js is a platform built on Chrome's JavaScript runtime used for
building fast, scalable network applications. Node.js uses an
event-driven, non-blocking I/O model that makes it lightweight and
efficient, perfect for data-intensive real-time applications that run
across distributed devices. It works on the server-side. Node.js runs
JavaScript without a browser, as a service and it can run frameworks
like Express, dealing with HTTP and so on, making it a nice web server.

<http://nodejs.org/>

Things it does:

* Communicates with databases, websockets, middleware etc.
* Serves web pages to the client

##Test Types and Definitions:

We will want to define each level of testing in the UI layer into proper
categories (or type) to avoid confusion. Unit and Functional tests will
be covered in another document but have been added here for
completeness. Each test framework used will also be noted for each.

**AngularJS – Client (Jasmine test framework)**

* Unit tests: Mock Node.js response - Test things like list of records or
apps (content of response), changing of state within a component
* Functional tests: Not mocked - testing the format of Node.js response

**Node.js – Server (Mocha test framework)**

* Unit tests: Mock REST response - again testing content of response
* Functional tests: Not mocked - testing of response format from REST
service
* Integration tests: Testing of data formatting transforms – Node will be
handling display properties for the UI and do the proper transformation
for the data being sent back from the REST service

**REST API Service (Java / TestNG)**

**Browser End to End (E2E) tests (Protractor test framework)**

Tests the product from the top level (browser) down through the
database. The full QuickBase stack needs to be setup and running (UI and
REST Service). Tests workflow cases from a users perspective. Things
like navigation through an app. I click this button then I'm taken to
this page. If I enter text into this search box I'll be displayed a
report. We're not testing every permutation and edge case of a component
from this level. Unit tests / Functional tests should be doing the bulk
of the data driven cases.

There will be two categories of E2E tests where we either test a
particular component on a page (or a page as a component such as a
dashboard) or a user workflow (such as logging in, creating an app,
logging out). This is described in more detail in the “Best Practices”
section below.

We will use Node.js to set up test data if needed during initialization
for any of the tests above.

##What is E2E testing?

End-To-End (E2E) testing is all about testing your application against
specific scenarios. With E2E testing you are interacting with the app's
interface just as an end user would through their web browser. An E2E
test runs against the front-end of a fully functional application. In
the case of a web application, this implies driving a browser that loads
pages, runs JavaScript, interacts with the DOM, fills and submits forms,
and so forth. The web application is served from a machine with a fully
functional backend and suitably populated database. The setup is
intended to mimic as closely as possible the live application,
environment, and use cases.

You might compare this with unit testing, wherein a unit test runs
against a small piece of functionality in isolation. Any data that might
come from the rest of the application is mocked for the purposes of a
unit test.

When following a proper test automation pattern unit tests are the
foundation of quality, followed by service / functional tests,
integration tests and finally UI (E2E) tests:

&lt;Proper test pattern picture here&gt;

E2E testing has another important job in running tests across browsers
to ensure functionality is not broken due to variations between the
different browsers.

##WebDriver and Selenium:

Selenium and WebDriver provide local and server APIs for driving a
browser and manipulating and inspecting the DOM on loaded pages - and
thus running tests against a website. Selenium, like most of the tools
in this ecosystem, is presently evolving into a new configuration, but
is reliable. A typical Selenium set up is:

1. A Selenium standalone server listens at a port for API commands.
2. Commands arrive indicating that Selenium should start a browser session.
3. Selenium loads a WebDriver implementation to control a particular
browser.
4. The browser is started and pointed to a web site, usually on another
server.

Typically test scripts run on server A and connect to Selenium on server
B. Selenium fires up a browser on server B to connect to a web
application running on server C. The test scripts on server A instruct
Selenium on server B to drive the browser around the site served from
server C, checking the state of the DOM and content in response to
various actions.

It is perfectly possible, but painful, to write end to end tests for an
AngularJS site using only Selenium tools. The challenge lies in
determining when AngularJS is actually done with a given action (since
many calls with Angular are asynchronous), such as a change of view -
this is somewhat more difficult than is the case for straightforward
old-school AJAX operations. So Selenium test scripts for AngularJS tend
to bloat with wait commands and checks for readiness of elements. This
is where Protractor comes in.

##Protractor Overview:

Protractor is an End-To-End testing framework originally created for the
JavaScript front-end framework AngularJS. Tests are written in
JavaScript and run in Node.js.

Protractor is customized for AngularJS applications as it has in built
support for AngularJS specific page load and actions. Under the hood
it's actually a Node.js application, which supports a wide variety of
assertion/test libraries like Jasmine, Mocha or Cucumber. For the
purposes of our qbui project we will be using Jasmine as our test
framework (which we also use for our Unit testing framework). Protractor
has replaced the previous standard of Karma test runner w/ ngScenario
(aka Angular scenario runner) for E2E testing of Angular apps.

Protractor acts as a wrapper on top of the WebDriverJS-API (which is the
JavaScript version of WebDriver), which is used to communicate with a
Selenium Server, either local (standalone) or remote. WebdriverJS is
also known as selenium-webdriver.

    Node.js (WebDriverJS) WebDriver API -> JSON Wire Protocol -> Remote / Local Selenium Server -> Browser driver

Since Protractor is based on WebDriverJS, as long as there's a "server"
component running, whether that's a Selenium server, chromedriver.exe,
IEDriverServer.exe, or PhantomJS, the driver should be able to
communicate with and drive that browser. WebDriverJS (and, by extension,
Protractor) can execute against Chrome and PhantomJS without requiring
the Selenium server running.

Protractor tests can also run on multiple browsers at the same time.
Support is wide-spread (Chrome, FF, IE, Safari) and even includes
headless browsers like PhantomJS.

It offers additional convenience features, not present in vanilla
WebDriverJS-API. One feature, perhaps the most important, is that it
allows you to write asynchronous tests in a synchronous style. This
means that Protractor will automatically execute the next task, the
moment the previous pending tasks finish (see the Promises section
below).

It also has features that make it easier to query for elements on a
page: accessors (also know as locators) by button text, partial button
text and an option to find by a combination of CSS and text (get me all
the divs with class ‘pet’ and text ‘dog’) are just a few examples of
these.

##Protractor and Jasmine:

Jasmine is a behavior-driven development framework for testing
JavaScript code. It does not depend on any other JavaScript frameworks.
It does not require a DOM. And it has a clean, obvious syntax so that
you can easily write tests.

<http://jasmine.github.io/1.3/introduction.html>

Jasmine is used for Protractor’s test syntax. As in unit testing, a test
file is comprised of one or more it blocks that describe the
requirements of your application. It blocks are made of commands and
expectations. Commands tell Protractor to do something with the
application such as navigate to a page or click on a button.
Expectations tell Protractor to assert something about the application's
state, such as the value of a field or the current URL.

&lt;Example of Jasmine test&gt;

When you install Protractor you get the Jasmine test library out of the
box – with a bonus patch to the ‘expect’ function to easily provide
validation through assertion.

All resources that are extracted from browsers can be used to make tests
as promises. Those promises are resolved internally by using the
'expect' command from Jasmine. That way the promises work smoothly while
creating tests (see later section on Promises).

Our project is currently using Jasmine version **1.3**.

##Protractor Setup / Configuration:

For prerequisites and basic setup see the tutorial here -
<http://angular.github.io/protractor/#/tutorial>

In order to work with Protractor, there is a little configuration that
is necessary. This is done in a configuration file, e.g.
**protractor.conf.js**, which sets up the basic information for Protractor
so it can find our test files, and start the standalone Selenium server.

Sample Protractor config:

    // conf.js
    exports.config = {
        seleniumAddress: 'http://localhost:4444/wd/hub',
        specs: ['spec.js']
    }

&lt;Setup needed for qbui project from checked-in Readme.md&gt;

##Writing Protractor tests:

<http://angular.github.io/protractor/#/tutorial>

Protractor tests are organized into spec files (filenames end with
**spec.js**). You want to set up tests such that each block tests as little
as possible. Ideally, each test block should contain no more than 1
expectation.

Example spec file:

    // spec.js\
    describe('Protractor Demo App', function() {
         it('should have a title', function() {
         browser.get('http://juliemr.github.io/protractor-demo/');
         expect(browser.getTitle()).toEqual('Super Calculator');
         });
    });

The describe and it syntax is from the Jasmine framework used for
defining test suites and test expectations in a BDD style (see the
“Protractor and Jasmine” section)

There are 3 important global keywords to remember: 

    element, browser, and protractor

**element** is how you select content on the page.

**browser** is how you interact with the browser that you're testing. browser is a global created by Protractor, 
which is used for browser-level commands (such as using browser.get to navigate to a certain page).

**protractor** is a shortcut for you to access static variables defined in the WebDriverJS namespace.

For example:

    // tell browser to go to URL\
    browser.get(‘http://www.someUrl.com’);
    
    // find the input using a css selector
    input = element(by.css(‘\#someInput’));
    
    // Send a ‘webdriver’ key to the element named input
    input.sendKeys(protrctor.Key.ENTER);

For a more in-depth look at writing tests see the tutorial linked above.

##Running your Protractor Tests:

You can run your tests from the command line with:

    protractor conf.js

From within your config file you can specify the list of spec files you
want to run (and all will be run by default) or you can specify a
particular spec file(s) to run by adding

    --specs mydir/mytestfile.spec.js

to the above command.

&lt;Add section on creating / running a Node.js configuration in
IntelliJ IDE)&gt;

&lt;Include how to disable describe blocks or run specific blocks /
tests from within the IDE&gt;

##Protractor Tests are Promise-Based and Asynchronous:

Consider a set of commands such as:

    var element = browser.findElement(by.css(‘.page-header h4’):
    expect(element.isDisplayed()).toBe(true)
    expect(element.getText()).toBe(‘An example route’);

These commands are not running synchronously: behind the scenes they are
being queued up to wait for completion of browser actions. The return
values for **element.isDisplayed()** and **element.getText()** are promises, to
be resolved at a later date, not the actual values from the DOM. The key
here is to understand that **expect()** effectively unwraps promises,
waiting on their resolution before running any associated assertion.
This prevents you from making your assertion or performing some other
action on an element that has not loaded yet (thus removing the need for
sleeps or waits in your tests).

You can structure much of your Protractor test code as above so as to
ignore the asynchronous activity taking place behind the scenes (done by
Angular).

&lt;Link to JavaScript Promises tutorial&gt;

##Protractor benefits:

-   Preferred end-to-end testing framework for testing
    AngularJS webapps.

-   Built on Selenium WebDriverJS which supports all major browsers
    (WebDriverJS uses ChromeDriver for example)

-   Can use the Selenium infrastructure (Selenium Grid)

-   Built atop the Jasmine test framework (which is our current Unit
    test framework) – If you can write Jasmine Unit tests you should be
    able to write Protractor E2E tests

-   Introduces everyone to JavaScript

-   Can be written using the Page Object Model.

-   As it is based on AngularJS concepts, that makes it easy to learn
    Protractor if you already know about AngularJS and vice versa.

-   Protractor also provides you a way to wait for scope changes
    using protractor.waitForAngular(). Protractor was designed with the
    asynchronous nature of Angular in mind (hence the use of Promises).

-   Protractor also speeds up your testing as it avoids the need for a
    lot of “sleeps” and “waits” in your tests.

-   Can use Sauce Labs for running tests on multiple browsers

##Page Object Model:

Page Object is a Design Pattern that has become popular in test
automation for enhancing test maintenance and reducing code duplication.
A page object is an object-oriented class that serves as an interface to
a page or component of your AUT (application under test). The tests then
use the methods of this page object class whenever they need to interact
with that page of the UI. The benefit is that if the UI changes for the
page, the tests themselves don’t need to change. Only the code within
the page object needs to change. Subsequently all changes to support
that new UI are located in one place.

What this means is that you try to group information about how you
access and interact with parts of the application into separate classes.
This makes it simple to access specific elements multiple times. Now
instead of repeating the **element.by.xxx** code over and over across
multiple tests, we unify the access making it easier to maintain and
modify.

You can basically represent each page or module or widget by a unique
class/object/file.

Page object files will end with **po.js**. The actual spec file containing
the tests (and assertions) should be located next to the page object for
easy access (see the project structure section below).

For example if we were to test a particular page called login. We would
end up with two files: **login.spec.js** and **login.po.js**

&lt;Page Object code example&gt;

It’s important to note that page objects not only contain ways to access
the elements on the page but also ways to interact with those objects.
For instance in your Login PO you would have objects that have accessors
to the username text box and a password text box. The page object would
also have methods/functions that correspond to this page’s domain. So
the Login page object knows how to ‘completeLoginForm(username,
password)’.

Now your tests can actually say

    // Setup the page object
    LoginPage = require(‘./loginPage.po’);
    // Inside Test 1
    LoginPage.completeLoginForm(myUser, myPass123);

<http://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings>

##Assertions with Page Objects:

Page objects are commonly used for testing, but should not make
assertions themselves. Their responsibility is to provide access to the
state of the underlying page. It's up to test clients to carry out the
assertion logic.

There are differences of opinion on whether page objects should include
assertions themselves, or just provide data and helper methods for test
scripts to do the assertions. Advocates of assertion-free page objects
say that including assertions mixes the responsibilities of providing
access to page data with assertion logic, and leads to a bloated page
object. On the other hand, opponents of this belief state that you end
up duplicating a lot of your assert code throughout your test classes.

While this is a valid concern, we will attempt to avoid duplication by
providing assertion libraries for common assertions that can be used
across spec files.

##Best practices and Quality Standards:

For developers: Elements in a component or page we’ll want to test
should be properly marked with either a unique ID or class for easy
access in our page objects.

* Base test classes
* Common assertion / utils libraries
* Constants files
* Shared setup / before / after functions
* Base page object file – Common accessors / interaction methods that all
POs extend
* Setup/Tear Down for test classes / suites

&lt;More detail on the above items&gt;

&lt;Structure of files overview (where to put and how we are
categorizing tests)&gt;

End-to-end tests are entities of a much higher level of abstraction then
unit tests – E2E spec files should be located away from the actual code,
in a special directory. 

We’ll be placing our Protractor tests in the **E2E**
directory under **qbui/ui**. 

It contains all of the end-to-end spec files,
along with the page objects for every page, or part of a page of
the application. This is a directory structure we've agreed to have
that’s specific to Protractor (unit tests will live in the client code
in a “test” folder next to the actual implementation modules).

The reason for keeping our E2E tests separate is that although you might
be running an end to end test for the login module, as a general rule
the end to end tests will be running integration style tests across
multiple controllers/services/views. The nature of these tests make them
difficult to keep to a one-to-one file relationship like you may do with
the unit tests. There is no reason why you may not also have a
protractor test that logs in, then changes some details on an account,
then logs out. In this situation, the E2E test wouldn't make sense to live in either
the account or login module directories.

##TODO Section:

Things we are looking to accomplish in the near future

1.  Get Protractor tests running in Jenkins (nightly job off of Master).
2.  Investigate / Implement code coverage tool
    (grunt-protractor-coverage plugin for using Istanbul). We will need
    to define a quality bar for code coverage (unit test coverage bar
    also needs to be defined).
3.  Update to newer version of Jasmine (supports running of a single
    test – not just a class).

##Resources section (helpful guides and tutorials):

&lt;Add links here&gt;