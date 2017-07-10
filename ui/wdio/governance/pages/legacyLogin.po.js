/**
 * This file uses the Page Object pattern to define legacy Login page for test
 */
class legacyLogin {
    get username() {
        // EmailAddress or User name text field
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
     * Invoke the login page
     * @param url
     */
    invoke(url) {
        browser.url(url);
        this.buttonSignIn.waitForVisible();
        return this;
    }
    /**
     * Login user
     * @param username
     * @param password
     */
    signInUser(username, password) {
        this.username.setValue(username);
        this.password.setValue(password);
        return this.buttonSignIn.click();
    }

}
module.exports = new legacyLogin();
