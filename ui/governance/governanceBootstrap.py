import urllib2
import urllib
import ssl
import time
from time import sleep
import xml.etree.ElementTree as ET
import random

#-------------------------------------------------------------------------------
# SERVER to create the entities
server = "www.currentstack-int.quickbaserocks.com"

# SUPER USER AUTHENTICATION
username = "administrator"
password = "jbcdjja"

# This is used to import the users into the groups
pageToken ="ZHVpcCNqMnMjYm11cnp4cmVhI2FibXV0cGdwcWUjPrnwkQVosY1lq40he80zK39%2F3CXO5ni3URMKGT5uL0s%3D"

sleep_time = 0


#-------------------------------------------------------------------------------

# Realm Create Config
adminEmail = "kunjanqb996@gmail.com"
adminPasswd= "intuit123"
doCreateEnterpriseRealm=True

# Groups Create Config
groupsToCreate = 2 # minimum 2
doNestGroups=True
groupPrefix = "AAAAAKKGroup4" + str(random.random())


# Users Create Config
doInviteUsers=True
usersToCreate = 10
usersAtTime= 1
userName =  'uam.tester'+ str(random.random()) +'+'

#-------------------------------------------------------------------------------

# Context to Ignore SSL Certs
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

#-------------------------------------------------------------------------------

# The main function that calls the server
def callServer(action, urlParams, body):
    url =  "https://" + server + "/db/main?a="+action+"&PageToken=" + urllib.quote_plus(pageToken)+"&username=" + username + "&password=" + password + "&passwd="+ adminPasswd+ "&email=" + adminEmail+ "&"+urlParams
    print url
    data = "<qdbapi>"+body+"</qdbapi>"
    r = urllib2.Request(url, data=data, headers={'Content-Type': 'application/xml'})
    u = urllib2.urlopen(r, context=ctx)
    response = u.read()
    print response
    return response

#-------------------------------------------------------------------------------

# Create Realm
def createRealm():
    print "----------------------------CREATING REALM----------------------------"
    response =callServer("QBI_CreateUserAndTrialAccount","createSubDomain=true", "")
    root = ET.fromstring(response)
    hostname = root.find('hostname').text
    acctid = int(root.find('acctid').text)
    realmID = int(root.find('realmID').text)
    return [hostname, acctid, realmID]

realmInfo = createRealm()
hostname = realmInfo[0]
accountid= realmInfo[1]
realmID= realmInfo[2]


if doCreateEnterpriseRealm:
    print "----------------------------CREATING ENTERPRISE ----------------------------"
    callServer("TAuto_UpgradeRealmToEnterprise","realmID=" + str(realmID), "")

#-------------------------------------------------------------------------------

# Create Groups

print "----------------------------CREATING GROUPS----------------------------"
groupID = []
for i in range(0,groupsToCreate):
    response = callServer("API_CreateGroup","", "<accountid>"+str(accountid)+"</accountid><name>" + groupPrefix + str(i)+"</name>")
    root = ET.fromstring(response)
    group = root.find('group')
    groupID.append(group.get('id').split(".")[0])
    sleep(sleep_time)


#-------------------------------------------------------------------------------

# Create SubGroups
print "----------------------------CREATING SUBGROUPS----------------------------"
if doNestGroups:
    for i in range(int(groupID[0]), int(groupID[-1]) -1):
        callServer("API_AddSubGroup","", "<accountid>"+str(accountid)+"</accountid><gid>"+str(i)+"</gid><subgroupid>"+str(i+1)+"</subgroupid>")
        sleep(sleep_time)


#-------------------------------------------------------------------------------

# Create Users
print "----------------------------ADDING USERS----------------------------"
if doInviteUsers:
    usersCount = 0;
    groupIndex = 0;
    retData = ""
    for i in range(0, usersToCreate+1):

        # If the buffer is full then we need to reset
        if(usersCount % usersAtTime == 0 and usersCount != 0):

            # Flush out the groups
            callServer("QBI_AccountProv","accountid="+str(accountid) +"&isImport=0", "<retData>"+retData+"</retData>")

            # Increment the Group Index
            if groupIndex == len(groupID) - 1:
                groupIndex = 0;
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
#--------------------------------------------------------------
