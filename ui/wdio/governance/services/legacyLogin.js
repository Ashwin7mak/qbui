let legacyLoginPO = requirePO('../governance/pages/legacyLogin');
let legacyQuickbasePO = requirePO('../governance/pages/legacyQuickbase');

module.exports = {
    Login(signInURL, username, password) {
        //* Invoke login page
        legacyLoginPO.invoke(signInURL);

        //* Login user
        legacyLoginPO.signInUser(username, password);

        //* Wait for current stack page to fully load
        legacyQuickbasePO.waitForPageToFullyLoad();

        //* Dismiss Quick Base University
        legacyQuickbasePO.dismissQBUniversityPopup();
    }
}

