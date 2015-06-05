#Introduction

The test generator package is node js utility for test generation which allows you to create api objects
with pseudo-random or populated values.

#Supported Objects
    - app
    - table
    - field
    - relationship
    - user
    - record

#Unsupported Objects
    - role
    - right
    - clientSideAttributes
   
#Usage

The generators are meant to be used to facilitate test setup or to generate a mock response. A test should only need to 
import a generator or a builder and should not need to directly access the constants object.

## Constants

Each supported object has a file <object>.constants.js. The constants package holds all of the keys associated
with the json representation of the object and may also contain additional helpful values such as defaults or static values.

Storing this type of data has an inherent risk that this static data will get out of sync because the API is the definitive 
owner of these objects. This is particularly dangerous for fields as we have an additional constant file used field.schema.defaults.js.

## Builders

Builders are a javascript interpretation of the builder pattern for our app/table/field/relationship objects. The builder 
allows you to build state slowly. A builder is leveraged by a generator but can be used independently with the rawValue.generator
if the user wants to roll their own.

## Generators

The generators are the heart of the test_generator package. They link together the builders with the constants to generate 
fully formed objects. These objects are generated as new, so they **do not contain ids**.

### Example
#### Import

Use relative path to get ahold of the proper generator. From ui/server/api/quickbase/recordsApi.js it would look like:

    var fieldGenerator = require('../../../test_generators/field.generator');
    var consts = require('../constants');

#### Generate
Simply ask and you shall recieve:

    var field = fieldGenerator.generateBaseField(consts.CHECKBOX);

This will produce an object that looks like this:

    {
        name: 'randomString',
        type: 'CHECKBOX'
    }

There are some more complex functionality in the table and app generator:

    var fieldNameToTypeMap = {};
    fieldNameToTypeMap['checkbox field'] = consts.CHECKBOX;
    fieldNameToTypeMap['text field'] = consts.TEXT;
    fieldNameToTypeMap['multi line field'] = consts.MULTI_LINE_TEXT;
    fieldNameToTypeMap['phone number field'] = consts.PHONE_NUMBER;
    fieldNameToTypeMap['date field'] = consts.DATE;
    fieldNameToTypeMap['formula duration field'] = consts.FORMULA_DURATION;

    var table = tableGenerator.generateTableWithFieldMap(fieldMap);

This will produce an object that looks like this:

    {
        name: 'randomTableName',
        fields: {
            {name: 'checkbox field', type: 'CHECKBOX'},
            {name: 'text field', type: 'TEXT'},
            {name: 'multi line field', type: 'MULTI_LINE_TEXT'},
            {name: 'phone number field', type: 'PHONE_NUMBER'},
            {name: 'date field', type: 'DATE'},
            {name: 'formula duration field', type: 'FORMULA_DURATION'}
        }
    }

#### Builder

If you would like to override default properties or just roll your own, you can instead use a builder
    
    var fieldBuilder = require('../../../test_generators/field.builder');
    var fieldBuilderInstance = fieldBuilder.builder();
    var fieldType = 'TEXT';
    
    //The field builder is especially picky as we impose the field type hierarchy by type
    //You can't, for instance, add user editable to a formula field - it will puke
    var field = fieldBuilderInstance.withType(fieldType).withUserEditable(false, fieldType).withName('Custom Field').build();