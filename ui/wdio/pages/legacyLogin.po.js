'use strict';

/**
 * This file uses the Page Object pattern to define legacy Login page for test
 */
class legacyLogin {
    get username() {
        // EmailAddress or User name text field
        browser.element('.UserInput.WithPadding[name="loginid"]').waitForVisible();
        return browser.element('.UserInput.WithPadding[name="loginid"]');
    }

    get password() {
        // Password text field
        return browser.element('.UserInput.WithPadding[name="password"]');
    }

    get buttonSignIn() {
        // Sign in button
        return browser.element('.SubmitButton');
    }

    /**
     * Login user
     * @param username
     * @param password
     */
    signInUser(username, password) {
        try {
            this.username.setValue(username);
            this.password.setValue(password);
            return this.buttonSignIn.click();
        } catch (err) {
            browser.logger.error('Error in signInUser function:' + err);
        }
    }

}
module.exports = new legacyLogin();
