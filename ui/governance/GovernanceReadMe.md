<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Governance FAQ/Readme](#governance-faqreadme)
  - [Intro](#intro)
  - [Update Log](#update-log)
  - [Structure of the Governance UI Project](#structure-of-the-governance-ui-project)
    - [Account Users](#account-users)
  - [Structure of the Governance Server Project](#structure-of-the-governance-server-project)
    - [Account Users](#account-users-1)
  - [Structure of the Governance Current stack end points](#structure-of-the-governance-current-stack-end-points)
  - [User Authentication/Federation](#user-authenticationfederation)
  - [Running Mock Server](#running-mock-server)
  - [Deploy/Monitoring Governance](#deploymonitoring-governance)
  - [Company/Realm/Account](#companyrealmaccount)
    - [Company](#company)
    - [Realm](#realm)
    - [Account](#account)
    - [AccountURL/Enterprise Realm](#accounturlenterprise-realm)
      - [How to convert an Account URL to enterprise account?](#how-to-convert-an-account-url-to-enterprise-account)
      - [How do I add two accounts to the enterprise account?](#how-do-i-add-two-accounts-to-the-enterprise-account)
  - [Users](#users)
    - [Provisional/Unregistered](#provisionalunregistered)
    - [Registered (Unverified)](#registered-unverified)
    - [Verified](#verified)
    - [Denied](#denied)
    - [Deactivated](#deactivated)
    - [Approved](#approved)
    - [Placeholder](#placeholder)
  - [Groups](#groups)
    - [What are groups used for?](#what-are-groups-used-for)
    - [What are special groups?](#what-are-special-groups)
    - [Group Manager vs Group Members](#group-manager-vs-group-members)
    - [What are DOM groups/ Email Groups?](#what-are-dom-groups-email-groups)
  - [Managers](#managers)
    - [Realm Admin](#realm-admin)
    - [Account Admin](#account-admin)
    - [App Manager](#app-manager)
    - [App Admin](#app-admin)
    - [App Create Permissions](#app-create-permissions)
  - [Special Users and Sets](#special-users-and-sets)
    - [Super Admin/Operators](#super-adminoperators)
    - [CSRs/Quick Base Staff](#csrsquick-base-staff)
    - [What is a Default User list?](#what-is-a-default-user-list)
  - [What do the different columns mean?](#what-do-the-different-columns-mean)
    - [What is a Paid Seat?](#what-is-a-paid-seat)
    - [What is an Inactive Users?](#what-is-an-inactive-users)
    - [What is "No App Access"?](#what-is-no-app-access)
  - [Source of Data - How things are stored in SQL?](#source-of-data---how-things-are-stored-in-sql)
    - [Users](#users-1)
    - [Realms](#realms)
    - [Accounts](#accounts)
    - [Databases](#databases)
    - [Groups](#groups-1)
    - [Access Control list](#access-control-list)
    - [Permissions](#permissions)
    - [Tracking User Flow](#tracking-user-flow)
  - [Contact](#contact)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


_______________________

# Governance FAQ/Readme

## Intro

- Governance project provides a Unified Account Management for Quick Base and Mercury customers.
- It is meant for large enterprise accounts to manage their users, accounts, realms. For example, Quick Base customers can see how many "Paid Seats" they have.
- It is also meant for admins who need a centralized hub to manage their users and apps that are spread in  two environments - Quick Base and Mercury.

## Update Log


| Date          | By            | Notes |
| ------------- |:-------------:| -----:|
| May 2017      | Kunjan        | init  |

**IMP**: Information in this doc is correct as of the latest date. If you update the doc please update this date.

_______________________

## Structure of the Governance UI Project

We share the repo with the rest of the Mercury QB UI project : https://github.com/QuickBase/qbui

### Account Users
The UI code is under the `ui/governance` folder.  The main entry point for the users page is `AccountUsersMain.js`.  This is where we fetch the users from the server, get
the request context and the mount the grid.

The `AccountUsersGrid` is the main grid that shows the retrieved users. It currently heavily uses the `StandardGrid.js`.
StandardGrid expects a couple of callbacks like the columns to display (`AccountUsersGrid`), facets to display (`AccountUsersGridFacet`) and does its magic.

The main update pipeline is the `doUpdate` function written in `AccountUsersAction.js`.
We filter, sort and paginate the users here and set the appropriate state in the grid. 

## Structure of the Governance Server Project

In order to retrieve the users we currently hit a Node API proxy which then calls a .NET handler in the current stack.

### Account Users
The UI service module `AccountUsersService` leverages the `BaseService` to contact the backend API.

All our server files are under `/server/governance`. For example, fetchUsers hits the `accountUsersAPI.getAccountUsers`

## Structure of the Governance Current stack end points

Eventually the calls are made to current stack, which is the source of truth. This is made via a .NET endpoint to query the SQL.

Our .NET files are under `GovernanceController.cs`. It is a .NET controller that inherits from `QBRestController`. It leverages the existing managers to query the SQL directly
and retrieves the data from the SQL. 

Currently we use the stored procedure `spAccountAllUsersForConsolidatedView` to get all the users.

## User Authentication/Federation

*Currently* we authenticate the user via the current stack. 

1. A user when they hit our page, gets redirected to the current stack endpoint.
2. The current stack signs in the user and builds the ticket. 
3. This ticket is then propagated to the new stack via cookies.

Remember that the current stack and new stack are in 2 different domains. ```*.quickbase.com``` and `*.mercury.quickbase.com`


_______________________

## Running Mock Server

If you want to quickly run the Governance page, you can use a mock server. 

1. Edit your local.js file from "isMockServer : false" to true. This will enable mockServer for your project.
2. Change `legacyBase: '.quickbase-dev.com'` in your local.js file to `legacyBase: '.ns.quickbase-dev.com:3030'` to point your mockServer to the port 3030.
3. From the UI server folder, we have a mock.js file that can be run like this: ``node ui/server/src/mockserver/mocker.js -f legacyStack.json``
4. Then grunt serve `/ui/Gruntfile.js serve` or run your node server `node ui/server/src/app.js`.
5. Then hit an endpoint like http://kunjanenterprise.ns.quickbase-dev.com:9000/qbase/governance/212950/users
6. If you are running the mock server, run the `NPM watch` command for your changes to the code to be reflected.

The APIs that we are hitting are mocked out in `legacyStack.json`.  Remember that if you add a new user to this JSON, give the user a different UID.
Remember to restart the mock server if you make changes to the JSON.

## Deploy/Monitoring Governance

*Currently* we use jenkins to deploy code, which is changing to containers and AWS code deploy.s

1. After we build a PR, we use the [try build](https://jenkins1.ci.quickbaserocks.com/view/Try%20UX%20Builds/job/try-flow-ui/build?delay=0sec)
2. You can monitor the [deploy pipeline here](https://jenkins1.ci.quickbaserocks.com/view/CoreUI%20Pipeline/)
3. The Splunk is forwarded to [SplunkCloud](https://quickbase.splunkcloud.com)

_______________________


## Company/Realm/Account

### Company
One company can have multiple realms. A company is a list of one or more email domains. Companies can only be associated with realms.

### Realm
Each realm can contain multiple accounts. Each account can contain multiple applications.  All apps belong to a single account.

### Account
Think of Accounts as Billing Accounts in Quick Base. So WalMart Realm can have multiple accounts for example WalMart-Marketing, WalMart-Sales.

### AccountURL/Enterprise Realm
When a customer signs up to Quick Base, the customer gets an account with a single "realm" called "AccountURL". When these customers get "big", they change to "Enterprise Realms", which can have multiple of these accounts.
These enterprise realms also provide additional customizations like "Realm Branding", SignUp Policies etc.

Since we have these two kinds of "realms", youll see permissions in the governance project set accordingly.


#### How to convert an Account URL to enterprise account?

As mentioned above, when you sign up, you get an Account URL. You "upgrade" to enterprise realm.

0. Sign up to Platform Plan or Unlimited. Lower plans dont support this feature
1. Go to Realm CSR tab as a CSR: RealmPropsSupport&realmid=117003
2. Set/Assign a Company
3. Un-check the "Account URL"

#### How do I add two accounts to the enterprise account?

1. Create two accounts, acct1 and acct2
2. Change the two account's plan to platform
3. From acct2 Realm CST > Revert Account URL to an Account (non-hosted)
4. From acct1 Realm CST > Move account into this realm, add acct2 ID, then Save

## Users
Users are global and independent of Company, Account, Realms. 

Users can be added directly to realm directory by Realm Admins or into an Application by the Application admin.

### Provisional/Unregistered
Sometimes you may want to add unregistered users to groups and apps. This is called provisioning the user.
If you provision a user to a group, Quick Base adds the user regardless of whether he or she is a registered Quick Base user.

Once the user registers, he or she will be able to access applications as specified by the permissions set up for each group.
Provisional users either don't have entries in the directory or they have never registered.

### Registered (Unverified)
When a user first signs up to Quick Base, the user gets "Unverified" status. They need to verify the email addresses to move to next level.

### Verified
When the user verifies the email, then the he gets set to "Verified" or Registered status.

### Denied
Let's say a user is fired, and we don't want to go through all the apps to remove the user.
An account admin can deny the user thus restricting the user's access to all apps and accounts.
Users who have been denied do not count toward the billing account's user limit.

### Deactivated
If a user truly needs to be removed from Quick Base, the person is deactivated. This means that the email address is no longer recognized.

### Approved
Users with Approved status can sign into realm.

### Placeholder
If you import email addresses into a User Field, Quick Base can immediately match a value with the Quick Base user who's registered with that email address
However sometimes Quick Base cant resolve users. So it will import the user as a placeholder. These users need to be resolved to a real user after import manually.

## Groups 

### What are groups used for?

In Quick Base, you can create a group of users like "Quick Base PD" can have all the PD users.
You can also create a group of multiple groups like "Quick Base All" can have "Quick Base PD" and "Quick Base Marketing".

### What are special groups?
We do reserve some special groups. For example, we have "Everyone in the Internet" group. This group when invited to the app lets anyone without credential access Quick Base.
This feature can be turned off by the account admin. You aren’t billed for these users, of course, because they are not identified to Quick Base.

### Group Manager vs Group Members

Every group has a manager and can have 0 or more members.
Group Managers and Group Members are stored separately. Group Managers who are not members will not show up in the UsersGrid.

Billing Account Administrators can manage any groups in their accounts.

### What are DOM groups/ Email Groups?
Sometimes you want to invite all the users in the company that have a particular domain. For example, you want to invite "@quickbase.com"
You could create a group out of your domain called DOM Groups by inviting the domain into the app with a given role.
So anytime a user with that domain tries to access Quick Base, we assign the user that role.


_______________________

## Managers

### Realm Admin

Realm admins can manage the entire realm and the accounts.
Only Support can grant users realm admin permissions through the `RealmPropsSupport` handler.
You can be a realm admin and not have account admin permissions. The governance page changes accordingly in this state.

### Account Admin

You can grant users FULL management permissions to account via `AccountPerms` handler if you already have account admin perms.
Think of this person as the "Billing Account Admin".

You can have two kinds of Account Admins: Full and Support. The Support-Level account access level does not allow signing up for or changing a service plan, changing the level of account access or editing the account’s properties.
It also disallows deleting or transferring apps in the account.

If you're an account administrator, you cannot view the contents of an application in your account unless that application's manager has explicitly granted you access to it.

### App Manager
The application manager has administrative rights to control the application. 

Initially, the user who creates an application is its manager/owner. 
However, this person can transfer management of the application at any time. 
Only a manager can add and remove users from an application's access list and control user permissions (roles).

Users can be [promoted to an app manager](http://help.quickbase.com/user-assistance/default.html#promote_new_mgr.html)

Can only have 1 App Manager.

### App Admin
User in a role that is in "Full Administration", is granted App Admin perms.
At least one role in an app should give Full Administration access.

App Managers have Full Administration access, and so are automatically App Admins, in addition to their other privileges

App Admins cannot Delete, Transfer apps. They cant also expel tables.

### App Create Permissions
Account Admins cannot control who is given access to an account. But the admin can control who can create an app or who can manage the accounts.
From the "Permissions" tab in the Account Manage page, the account admin can give anyone or specific users permissions to create an app.

## Special Users and Sets

### Super Admin/Operators
These users are usually OPS who can perform all kinds of actions like accessing apps, deleting these apps etc.

These users have `adminstrator` field set on their Users table entry.

### CSRs/Quick Base Staff
Certain administrative tasks may only be performed by Quick Base Customer Care representatives:
- Change the account URL for a Quick Base account
- Change the Billing Account Admin when no user has Account Admin privileges
- Grant permission to delete or deactivate users
- Implement LDAP access, Override SAML access for a user
- Restore a suspended account
- Set up an email domain
- Transfer an app to another account (for suspended or trial accounts)

These users have `systemRights` on their Users table entry.

There are different levels of Support, which can be altered in UserEdit by a superadmin.
0. Support - Provide access to customer account management. Support, anyone who needs to access user/app/account/realm info in production (some PMs, devs, etc)
1. SupportSupervisor - provides elevated customer support privileges
2. SupportAdditionalBilling - additional billing permissions for users with support, support sales, or support supervisor that allows changing discounts, suspensions, etc
3. SupportDeletedAppRestores - restore deleted apps permissions for users with support or support supervisor




### What is a Default User list?
Once a user has been invited to an app, they can be put into the Default Set, the set of users that shows by default in all user pickers

_______________________

## What do the different columns mean?

### What is a Paid Seat?
A Paid Seat is a user that is
 - non deactivated
 - non denied
 - non Quick Base internal user that is not a Paid Seat.
 - invited to an app
 - even if it is Inactive
 
- It does not matter if the person you invite is not yet registered with QuickBase; they count as a user from the time the invitation is sent.
- If a user is invited twice to the same account, the account is only charged once.

### What is an Inactive Users?
If a user hasnt accessed any app for the last 180 days or has never visited the app, the user is considered inactive.

### What is "No App Access"?
A non-deactivated, non-denied, non-Quick Base internal user that is not a Paid Seat.

_______________________

## Source of Data - How things are stored in SQL?

### Users
The User meta information are stored in `Users` table. It has information like firstName, lastName, email etc.

We also store a permissions of the Users in this table. It is split into `UserBasic` Flag and `UserAdvanced` Flag.
For example, we store if the user is deactivated in the `FlagDeactivated` in the `UserBasic`.

    UserFlag 
            {
            FlagNone                =   0x00000000,
            FlagUnverified          =   0x00000004,	//BillRec verified (email registration handshake completed)
            FlagDeactivated         =   0x00000040,	//User has been deactivated by CSR
            FlagHasEverRegistered   =   0x00002000,	//true if ever successfully registered (helps determine whether provisional)
            FlagDoNotFollowLDAPDefault= 0x00020000,	//refer to the next flag to determine LDAP usage
            FlagUseLDAP             =   0x00040000	//use LDAP for authentication if available
            };
             
         UserFlagAdvanced 
        {
              FlagNone			=		0x00000000
            , FlagNews			=		0x00000001		//Want the user letter
            , SpaceDensityPrefLowBit =  0x00000002
            , SpaceDensityPrefHighBit = 0x00000004
    
            , FlagAllowNonSSL	=		0x00000010		//Let this user use Non-SSL
            , FlagEmailIsID		=		0x00000080		//If there are multiple billRecs with the same email, this is the distinguished one
            , FlagIsNovice		=		0x00000100		//Display customization, (update / new icons vs. words)
            , FlagMarComm		=		0x00000400		// allow marketing communications
            , FlagCustMode		=		0x00008000		// customize mode is enabled
            , FlagCustModeHelp	=		0x00010000		// customize mode help is currently displayed
            , FlagPerfMonitorShow	=	0x00020000		// Show/Hide Performance Monitor
            , PswdHasBeenChecked	=	0x00040000		// Password has been checked for compliance with our policies
            , PswdCheckedViaAPI 	=	0x00080000		// Password check occurred in API_Authenticate
            , PswdMeetsRequirements	=	0x00100000		// Password complies with our policies
            , FlagHideNewUpdatedIcons = 0x00200000      //don't show the new/updated icons in any reports
            , FlagDelayVerify       =   0x00400000      //don't force this user to verify before signing in
            , FlagHideV2Lightbox	= 0x00800000
            , FlagCollapseV1Banner	= 0x01000000
            , FlagCollapseV2Banner	= 0x02000000
            , FlagHasMarketplaceApp = 0x08000000  //the user has created at least 1 marketplace app. this is primarily to switch the manage marketplace app entry points
        };

### Realms
The Realm info are stored in the `Realm` table. 

### Accounts
The Account info are in `Account` table. It has a reference to the `realmID` to the `Realm` table.

### Databases
The App and Table info are stored in `Databases` table. 
This has information like the primary DBID, name, description, whether they are an app or a table etc. 

The `DatabaseMetainformation` table stores the map from the DBID to AccountID.

### Groups
The Groups themselves are stored in the `Groups` table. It just has the group name, description etc. 

Groups belong to accounts, so they have link to the accountID.
T
he members are stored separately in ``GroupMembers``. The managers are stored separately in ``GroupManagers``.

Since groups can have other groups, the children groups are stored in `GroupChildren` tables. 


### Access Control list
- Users invited to the app are stored  in `DatabaseUserACL`.
- Groups invited to the app are stored in `DatabaseGroupACL`. 
- DOMGroups invited to the app are stored in `DatabaseDomGroupACL`. All the users in a particular DOM Group are in `User2Domgroup` table.

All the users collected from above have access to the app.

### Permissions
When users sign-up and register to realms, they put in the `RealmDirectory` table. When users are denied, they are also put in the `RealmDirectory` table.
We store all these states as flags in the `RealmDirFlag` column.

    RealmDirFlag
        {
            kAdmin					= 0x0001,
            kGuest					= 0x0002,
            kApproved				= 0x0004,
            kIsOnDenyList			= 0x0008,
            kHasEverRegistered		= 0x0010,	// true if the user has ever tried to register
            kVerified				= 0x0020,	// true if the user is fully registered and verified (provision if both verify flags are false)
            kOverrideSSODefault     = 0x0040,   // even if realm uses SAML, this user should be authenticated by Quick Base.  If realm uses LDAP, also checks kAlwaysUseLDAP.
            kAlwaysUseLDAP			= 0x0080,   // never use QB authentication, even if LDAP server returns an error
            kDeniedDueToLDAP		= 0x0100,	// true if the user was added to the realm deny list automatically due to LDAP
            kHasRunScript   		= 0x0200,	// true if the user has ever called API_Authenticate from an SDK, QuNect, or unknown browser
            PswdHasBeenChecked	    = 0x0400,	// Password has been checked for compliance with our policies
            PswdCheckedViaAPI	    = 0x0800,	// Password check occurred in API_Authenticate
            PswdMeetsRequirements   = 0x1000,	// Password complies with our policies
            UserHasSeenUXV2         = 0x2000,   // set when the user has viewed uxv2
            kUserCanCallRealmAPI    = 0x4000    // User can call APIs with the RealmPerm::API permission
    
        };

Whether someone is an app manager or not is stored in `Database` table in the `uid` column.
Users account permission is stored in `Trustee2Account` table in the `flags` column. For example, whether we a user can create a database in the account.
  
    AccountTrusteeFlags
      {
          kFlagNone			= 0x0000
        , kFlagAdmin		= 0x0001
        , kFlagSupport		= 0x0002
        , kFlagCanCreateDB	= 0x0004
        , kFlagCanCloneDB	= 0x0008
        , kFlagReceiveQAResetReq = 0x0010
      };


### Tracking User Flow
Any usage information is stored in the `UserDatabaseUsageInfo`. For example, it stores the `lastAccessTime`, which is stored as are stored as ` '1900-01-01 00:00:00.000'`
if a user has never accessed the app. 

_______________________

## Contact
<a href="mailto:quickbaseunifiedaccountmanagement@quickbase.com">Mail the team</a>
