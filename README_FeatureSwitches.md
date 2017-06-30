# Feature switches 

Feature switches are used to selectively enable/disable a feature from the user interface.
At this time feature  switches are developed as a configuration file based 
service and in the near future will be enhanced to a full fleged global service, 
enabling dynamic addition and update of feature switches that could affect multiple realms. 
 
### Configuration file based feature switches:

 #### Defining feature switches and overrides
 To add a feature switch that is applied across all environments add it to <B>master.featureSwitches.json</B> defined in
 ui/server/src/config/environment/featureSwitch directory.  
 
 <B> Note:</B>  Changes to master.featureSwitches.json file must be made with caution
 as changes made to this file also affect production environment. 
 
  
 master.featureSwitches.json is a list of feature switches that are defined 
 in the following format
  
 
 ##### JSON schema for feature switches:
 <pre><code>
 {
   "$schema": "http://json-schema.org/draft-04/schema#",
   "type": "array",
   "items": {
     "type": "object",
     "properties": {
       "name": {
         "type": "string"
       },
       "description": {
         "type": "string"
       },
       "defaultOn": {
         "type": "boolean"
       },
       "realmsOveride": {
         "type": "array",
         "items": {
           "type": "object",
           "properties": {
               "realmId": {
               "type": "string"
             },
             "overrideStateOn": {
               "type": "boolean"
             }
           },
           "required": [ 
             "realmId",
             "overrideStateOn" 
           ]
         }
       }
     },
     "required": [ 
       "name", 
       "defaultOn"
     ]
   }
 }
 </code></pre>
 
 ##### Example
  <pre><code>
 [
   {
     "name": "Feature A",
     "defaultOn": false,
     "description": "description",
     "realmsOveride":[
       {
         "realmId": "1234567",
         "overrideStateOn": true
       },
       {
         "realmId": "987654",
         "overrideStateOn": true
       }
     ]
   }
 ] </code></pre>

 The example above defines a feature switch identified as "Feature A", that is <B>OFF</B> by default for all realms other than 
 realm's with id's "1234567" and "987654" that are defined in the overrides.
 
 
 ##### Environment specific overrides
 For feature switches that are specific to an environment or override the ones that 
 are defined in <B>master.featureSwitches.json</B> :  
   
   *  Create an overrides file if one does not exist say  <B>local.override.featureSwitches.json</B> stick it into the directory say 
 ui/server/src/config/environment/featureSwitch. If one already exists, add the environment specific overrides to it.    
   *  In the environment specific config js file such as local.js/e2e.js/prod.js; define the property
    <B> featureSwitchConfigOverride </B> and specify the path to the environment specific json file.      
   * Feature Switches are overridden based on their names, ensure overrides in these environment specific names 
     have same name including spacing. 
   * JSON structure follows the same pattern as defined above for master.featureSwitches.json file 

 ##### Enable all feature switches for local development/ running unit/integration tests [ AKA Development hacks]   
 
 For enabling all feature switches that may have been defined in either the master 
 or the environment specific file or both, define a property <B>masterOverrideTurnFeaturesOn: true</B> in 
 the environment specific configuration file. 
  
  
#### Enable/Disable rendering of the UI feature by checking for a feature switch defined above
  In order to Enable/Disable rendering of a UI component: 
  * Add feature switch into the configuration files as mentioned above
  * Use FeatureCheck component to wrap the component that needs to be selectively hidden as follows : 
   <pre><code>
   &lt;FeatureCheck featureName={"Feature A"}>
          &lt;IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>
   &lt;/FeatureCheck&gt;
    </code></pre>
   In the example above <IconActions> is selectively shown/disabled  based on the configuration for "Feature A".
   
   Note: By default a feature that is not specified in the configuration file is turned off
     
   
 ### Trouble shooting :
* The path for master configuration file[master.featureSwitches.json] is not configurable at this time. 
* If the master.featureSwitches.json in "ui/server/src/config/environment/featureSwitch/" is deleted, or contains an invalid JSON - 
A log line along the lines of : "Could not read master feature switch configuration file *" 
  would be seen in the logs 
  
  
  
* As mentioned earlier, override files can be added - ui/server/src/config/environment/featureSwitch/{env}.override.featureSwitches.json
* This file is then referenced in {env.js} file 
* If the path to the file specified in env.js is incorrect or if the file is not a valid JSON file  -  A log line along the lines of : "Could not read override feature switch configuration file *" would be seen in the logs 