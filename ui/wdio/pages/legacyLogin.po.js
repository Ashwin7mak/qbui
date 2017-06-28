'use strict';

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
    singInUser(username, password) {
        // Login user
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickSignInButton();
    }

    /**
     * Enter username/email address
     * @param username
     */
    enterUsername(username) {
        try {
            this.fieldUsername.setValue(username);
        } catch (err) {
            browser.logger.error('Error in enterUsername function:' + err);
        }
    }

    /**
     * Enter enter password
     * @param password
     */
    enterPassword(password) {
        try {
            this.fieldPassword.setValue(password);
        } catch (err) {
            browser.logger.error('Error in enterPassword function:' + err);
        }
    }

    /**
     * Click Sign in button
     */
    clickSignInButton() {
        try {
            this.buttonSignIn.click();
        } catch (err) {
            browser.logger.error('Error in clickSignInButton function:' + err);
        }
    }

}
module.exports = new legacyLogin();
// export default legacyLogin();
