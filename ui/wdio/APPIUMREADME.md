#Appium ReadMe Setup Guide
Written by skamineni 05/01/17

##Pre-requisites for IOS devices:
Mac OS X 10.10 or higher.
Install Xcode version 7.2 which is found at https://developer.apple.com/download/more/
Apple Developer Tools (iPhone simulator SDK, command line tools)

##Pre-requisites for Android devices:
Mac OS X 10.10 or higher.
Download Android SDK from https://developer.android.com/sdk/index.html
Setting $Path and Configuring
    Open bash_profile with the command open .bash_profile
    Copy the contents to your .bash_profile
    export ANDROID_HOME=/Users/username/Library/Android/sdk .  (copy it from the sdk manager in android studio)
    export PATH=$ANDROID_HOME/platform-tools:$PATH
    export PATH=$ANDROID_HOME/tools:$PATH
    Save the file and finally run source ~/.bash_profile to reload the environment variables

Steps to Create Android virtual devices on Android Studio:
Can use this link https://developer.android.com/training/basics/firstapp/running-app.html#Emulator and follow 'Run on an emulator' part to setUp the virtual devices.

#Run Tests on android.
Once you have android emulator running . You can start your test to run.
If you get an error "Chrome should be > 53.0" then do these steps:
Download APK from the url http://www.apkmirror.com/apk/google-inc/chrome/chrome-55-0-2883-84-release/chrome-browser-55-0-2883-84-4-android-apk-download/
Rename the downloaded file to chrome_55.apk
then from terminal run this command : adb install -r ~/Downloads/chrome_55.apk

##Overview:
Appium is an open-source tool for automating mobile web on iOS and Android platforms. Mobile web apps are web apps accessed using a mobile browser (Appium supports Safari on iOS and Chrome or the built-in ‘Browser’ app on Android).

For more info on Appium please see their website here: [http://appium.io/getting-started.html?lang=en)].

##Configuration:
go to qbui/ui and run npm install. This should install appium version 1.6.4 and appium-service 0.2.3
run sudo xcode-select --switch /Applications/Xcode.app in the terminal
First copy the checked in **sample** file to the same directory renaming it to **wdio.conf.js** to create your local config (this has already been added to **.gitignore**). The sample file is located in

`qbui/ui/wdio/config/wdioMobile.conf.js.sample`

This config file will be set by default to run your tests locally. The config file will read in environment variables set by your Node server.
By default the E2E tests will launch a **separate** Node server automatically using the **e2e.js** config file on port **9001** (aka **NODE_ENV=e2e** environment variable if you run from the command line).
This is to prevent port collision if you have Node already running. This also loads appium server by default listening to 0.0.0.0:4723. This service is started before test run and stopped after the tests are run.

###Choosing which tests run:
Edit the **specs** parameter of **wdio.conf.js** (the path is dependent on where u run the wdio.conf.js from - see above).If all above works good the checkpoint is the test './ui/wdio/tests/reports/reportTable.e2e.spec.js' should 100% pass on iPad2(tablet)
and './ui/wdio/tests/mobile/reportSortingViaContainer.e2e.spec.js' should work on iPhone(card view)

##Troubleshooting:
Please make sure xCode 7.2 is installed if iOS fails.





