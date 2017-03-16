#MockData usage:

## featureSwitches.json.sample

During development, feature switches can be persisted in a local JSON file instead of the DynamoDB database used in production.
 
Simply set the following property in config/environment/local.js:

featureSwitchesMockData: './server/mockData/featureSwitches.json' 

featureSwitches.json.sample contains a couple of sample feature switches and overrides.

JSON schema for feature switches:
<pre><code>
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "team": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "defaultOn": {
        "type": "boolean"
      },
      "overrides": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "entityType": {
              "type": "string"
            },
            "entityValue": {
              "type": "string"
            },
            "overrideStateOn": {
              "type": "boolean"
            }
          },
          "required": [
            "id",
            "entityType",
            "entityValue",
            "on"
          ]
        }
      }
    },
    "required": [
      "id",
      "name",
      "team",
      "description",
      "defaultOn",
      "overrides"
    ]
  }
}
</code></pre>
