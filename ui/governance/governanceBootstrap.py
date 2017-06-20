import random
import ssl
import urllib2
import urllib
import xml.etree.ElementTree as ET
from time import sleep

#-------------------------------------------------------------------------------
# SERVER to create the entities
server = "currentstack-int.quickbaserocks.com"

# SUPER USER AUTHENTICATION
superAdminUserName = "administrator"
superAdminPassword = "jbcdjja"

# Time to wait before batch operations are performed
sleep_time = 0

# Unique ID for the entities
id = str(random.random())

print "Unique ID: " + id

#-------------------------------------------------------------------------------

# Realm Create Config
adminEmail = "testRealm" + id + "@gmail.com"
adminPasswd= "intuit123"

# Groups Create Config
groupsToCreate = 5 # minimum 2
groupPrefix = "testGroup" + id


# Users Create Config
usersToCreate = 10
usersAtTime= 2
userName =  'testUser'+ id +'+'

# App Create Config
appName =  'testApp'+ id

# Cleanup Config
doCleanup = False

#-------------------------------------------------------------------------------

# Context to Ignore SSL Certs
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def callQuickBase(hostname, app, action, urlParams, body, username, password):

    type = app
    if not app:
       type = "main"

    url =  "https://" + hostname + "." + server + "/db/" + type + "?a="+action +"&username=" + username + "&password=" + password + "&" + urlParams
    print url

    data = "<qdbapi>"+body+"</qdbapi>"
    r = urllib2.Request(url, data=data, headers={'Content-Type': 'application/xml'})
    u = urllib2.urlopen(r, context=ctx)
    response = u.read()

    print response

    return response

#-------------------------------------------------------------------------------

class LegacyRealmService:
    """The Service to interact with Realm Entity"""


    def createRealm(self, isEnterprise):
        """ Create Realm """

        print "----------------------------CREATING REALM----------------------------"

        response = callQuickBase("www", "main", "QBI_CreateUserAndTrialAccount", "delayVerify=true&createSubDomain=true"+ "&passwd="+ adminPasswd+ "&email=" + adminEmail, "", superAdminUserName, superAdminPassword)
        root = ET.fromstring(response)

        # Extract the info
        hostname = root.find('hostname').text.split(".")[0]
        acctid = int(root.find('acctid').text)
        realmID = int(root.find('realmID').text)


        if isEnterprise:
            print "----------------------------CREATING ENTERPRISE ----------------------------"

            callQuickBase("www", "main", "TAuto_UpgradeRealmToEnterprise", "realmID=" + str(realmID), "", superAdminUserName, superAdminPassword)

        return [hostname, acctid, realmID]


    def deleteRealms (self, realmId):
        """Delete the realm Created"""

        print "----------------------------DELETING REALM----------------------------"

        return callQuickBase("www", "main", "Tauto_Cleanup_RealmsAndDependentsDeleteMatching", "", "<preflight>0</preflight><matchtext>"+str(realmId)+"</matchtext>", superAdminUserName, superAdminPassword)

#-------------------------------------------------------------------------------

class LegacyEntitlementService:
    """The Service to interact with Plans Entity"""

    def subscribeToPlan(self, accountid, planID):
        print "----------------------------SUBSCRIBE TO PLAN----------------------------"
        return callQuickBase("www", "main", "TAuto_DoChoosePlan", "accountid=" + str(accountid) + "&planid=" + planID, "", superAdminUserName, superAdminPassword)

#-------------------------------------------------------------------------------

class LegacyFeatureSwitchService:
    """The Service to interact with Feature Switches Entity"""

    def set(self, switchName, entityType,entityValues, state):

        print "----------------------------SETTING FEATURE SWTICH----------------------------"
        return callQuickBase("www", "main", "JBI_FeatureSwitchFilter_AddUpdate", "switchName="+switchName+"&entityType="+entityType+"&entityValues=" + str(entityValues) + "&filterState="+ str(state), "", superAdminUserName, superAdminPassword)



#-------------------------------------------------------------------------------

class LegacyAppService:
    """The Service to interact with App Entity"""

    def createApps(self, hostname, appName):
        print "---------------------------- Creating Apps ----------------------------"

        appCreateResponse = callQuickBase(hostname, "main", "API_CreateDatabase", "dbname=" + appName, "", adminEmail, adminPasswd)
        root = ET.fromstring(appCreateResponse)

        # Get the App ID
        return root.find('appdbid').text

    def appTokenSet(self, hostname, appID, state):
        """ Set/Unset the App Token to call the APIs"""
        print "---------------------------- Unset App Token ----------------------------"

        return callQuickBase(hostname, appID, "TAuto_SetRequireAppTokens", "isAppTokenRequired=" + state, "", superAdminUserName, superAdminPassword)


#-------------------------------------------------------------------------------

class LegacyUserGroupService:
    """The Service to interact with Group Entity"""

    def createGroups(self, accountid, numberOfGroups, groupPrefix):

        print "----------------------------CREATING GROUPS----------------------------"

        groupsCreated = []

        for i in range(0,numberOfGroups):
            response = callQuickBase("www", "main", "API_CreateGroup", "", "<accountid>"+str(accountid)+"</accountid><name>" + groupPrefix + str(i)+"</name>", superAdminUserName, superAdminPassword)
            root = ET.fromstring(response)
            group = root.find('group')
            groupsCreated.append(group.get('id').split(".")[0])
            sleep(sleep_time)

        return groupsCreated

    def createSubGroups(self, accountid, groupID):

        print "----------------------------CREATING SUBGROUPS----------------------------"

        for i in range(int(groupID[0]), int(groupID[-1]) -1):
            response = callQuickBase("www", "main", "API_AddSubGroup", "", "<accountid>"+str(accountid)+"</accountid><gid>"+str(i)+"</gid><subgroupid>"+str(i+1)+"</subgroupid>", superAdminUserName, superAdminPassword)
            print response
            sleep(sleep_time)

    def deleteGroups(self, groupID):


        print "----------------------------DELETING GROUPS----------------------------"
        for id in range(int(groupID[0]), int(groupID[-1])):
            callQuickBase("www", "main", "API_DeleteGroup", "", "<gid>"+str(id)+"</gid>", superAdminUserName, superAdminPassword)

    def setVerified(self, userID, state):
        """ Sets the User as verified"""
        return callQuickBase("www", "main", "TAuto_SetUserVerified", "uid="+userID +"&verified=" + str(state), "", superAdminUserName, superAdminPassword)

    def getUserInfo(self, email):
        """ Retrieves the user information"""
        return callQuickBase("www", "main", "API_GetUserInfo", "email="+email, "", superAdminUserName, superAdminPassword)

    def deleteUsers(self, users):


        print "----------------------------DELETING USERS----------------------------"

        for id in range(0, len(users)):
            print "Deleting User:" + str(users[id])
            callQuickBase("www", "main", "TAuto_Cleanup_UserDelete", "", "<uid>"+str(users[id])+"</uid>", superAdminUserName, superAdminPassword)

    def inviteUsersToGroups(self, accountid, usersToCreate, groupID):

        print "----------------------------ADDING USERS----------------------------"

        usersCount = 0
        groupIndex = 0
        retData = ""
        usersCreated = []
        for i in range(0, usersToCreate+1):

            # If the buffer is full then we need to reset
            if(usersCount % usersAtTime == 0 and usersCount != 0):

                # Flush out the groups
                response = callQuickBase("www", "main", "QBI_Tauto_AccountProv", "accountid="+str(accountid) +"&isImport=0", "<retData>"+retData+"</retData>", superAdminUserName, superAdminPassword)
                root = ET.fromstring(response)
                # Extract the info
                usersAdded = root.find('usersAdded').text.split(",")
                for id in range(0, len(usersAdded)):
                    usersCreated.append(usersAdded[id])

                # Increment the Group Index
                if groupIndex == len(groupID) - 1:
                    groupIndex = 0
                else:
                    groupIndex = groupIndex+1

                # Reset the Variables
                retData = ""
                usersCount =0
            else:
                # Start a new user
                if(usersCount != 0):
                    retData = retData + "~|~"

                usersCount = usersCount + 1
                unique = userName + str(i)
                retData = retData + str(usersCount)
                retData = retData + "$^^" + unique+ "@gmail.com"
                retData = retData + "$^^" + unique + "firstName"
                retData = retData + "$^^" + unique + "lastName"
                retData = retData + "$^^" + str(groupID[groupIndex])
                retData = retData + "$^^0$^^0$^^"

            # Sleep
            sleep(sleep_time)

        return usersCreated

    def addGroupToApp(self, appID, groupID, roleID):

        print "---------------------------- Add Group to App ----------------------------"

        callQuickBase(hostname, appID, "API_AddGroupToRole", "gid="+ groupID[0] + "&roleid=" + roleID, "", superAdminUserName, superAdminPassword)


#-------------------------------------------------------------------------------

# Create a realm
realmService = LegacyRealmService()
realmInfo = realmService.createRealm(True)
hostname = realmInfo[0]
accountid= realmInfo[1]
realmID= realmInfo[2]

# Subscribe to unlimited plan
LAB_UNLIMITED = "1"
entitlementService = LegacyEntitlementService()
entitlementService.subscribeToPlan(accountid, LAB_UNLIMITED)


# Turn on feature switch
featureSwitchService = LegacyFeatureSwitchService()
featureSwitchService.set("Switch_GovernanceConsolidatedUserView", "realm", realmID, "true")

# Create a bunch of groups and subgroups
userGroupService = LegacyUserGroupService()
groupsCreated = userGroupService.createGroups(accountid, groupsToCreate, groupPrefix)
userGroupService.createSubGroups(accountid, groupsCreated)

# Set the user as verified
adminResponse = userGroupService.getUserInfo(adminEmail)
root = ET.fromstring(adminResponse)
adminID = root.find('user').attrib['id']
userGroupService.setVerified(adminID, True)

#--------------------------------------------------------------
# Create Users
usersCreated = userGroupService.inviteUsersToGroups(accountid, usersToCreate, groupsCreated)
#--------------------------------------------------------------

# Create an App
appService = LegacyAppService()
appId = appService.createApps(hostname, appName)
appService.appTokenSet(hostname, appId, "false")

#--------------------------------------------------------------

# Invite Group to the App
userGroupService.addGroupToApp(appId, groupsCreated, "12")



#--------------------------------------------------------------
# Cleanup
if doCleanup:
    userGroupService.deleteGroups(groupsCreated)
    realmService.deleteRealms(realmID)
    userGroupService.deleteUsers(usersCreated)


#--------------------------------------------------------------

print "Realm:" +  hostname
print "App: " + appId

