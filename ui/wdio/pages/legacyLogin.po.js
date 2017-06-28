'use strict';

/**
 * This file uses the Page Object pattern to define legacy Login page for test
 */
class legacyLogin {
    get fieldUsername() {
        // EmailAddress or User name text field
        browser.element('.UserInput.WithPadding[name="loginid"]').waitForVisible();
        return browser.element('.UserInput.WithPadding[name="loginid"]');
    }

    get fieldPassword() {
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
        this.setUsername(username);
        this.setPassword(password);
        this.clickSignInButton();
    }

    /**
     * Enter username/email address
     * @param username
     */
    setUsername(username) {
        try {
            this.fieldUsername.setValue(username);
            return this;
        } catch (err) {
            browser.logger.error('Error in enterUsername function:' + err);
        }
    }

    /**
     * Enter enter password
     * @param password
     */
    setPassword(password) {
        try {
            this.fieldPassword.setValue(password);
            return this;
        } catch (err) {
            browser.logger.error('Error in enterPassword function:' + err);
        }
    }

    /**
     * Click Sign in button
     */
    clickSignInButton() {
        try {
            return this.buttonSignIn.click();
        } catch (err) {
            browser.logger.error('Error in clickSignInButton function:' + err);
        }
    }

}
module.exports = new legacyLogin();
