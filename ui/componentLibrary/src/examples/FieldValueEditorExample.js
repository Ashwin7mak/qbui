
let editValue1 = 'QuickBase';
let editValue2 = 'Lorem ipsum dolor sit amet';
let editValue3 = 123;
let editValue2Invalid = true;
let fieldDefWithPlaceholder = {
    placeholder : "test@example.com"
};
let fieldDefWithRequired = {
    required : true
};
let fieldDefWithCurrencySymbol = {
    "datatypeAttributes" : {"clientSideAttributes" : {"symbol" : "$"}}
};

const basicFieldValueEditor = (
    <div>
        <dt>Field Editor (default text):</dt>
        <dd>
            <FieldValueEditor/>
        </dd>

        <dt>Empty Text Field Editor:</dt>
            <dd>
              <FieldValueEditor type={1}/>
            </dd>

        <dt>Empty Text Field Editor with placeholder text:</dt>
            <dd>
                <FieldValueEditor type={1} fieldDef={fieldDefWithPlaceholder} />
            </dd>


        <dt>Text Field Editor with a value:</dt>
            <dd>
                <FieldValueEditor type={1} value={editValue1} />
            </dd>

        <dt>Text Field Editor field is required and show required indicator:</dt>
            <dd>
                <FieldValueEditor type={1} value={editValue1}
                             fieldDef={fieldDefWithRequired} indicateRequired={true}/>
            </dd>


        <dt>Text Field Editor with a value and an error:</dt>
            <dd>
                <FieldValueEditor type={1}   value={editValue2}
                             isInvalid={editValue2Invalid} invalidMessage="Use up to 15 characters"/>
            </dd>


        <dt>Empty Numeric Field Editor:</dt>
            <dd>
                <FieldValueEditor type={2}/>
            </dd>

        <dt>Numeric Field Editor with a value:</dt>
            <dd>
                <FieldValueEditor type={2} value={editValue3} />
            </dd>

        <dt>Numeric Field Editor field is required and show required indicator:</dt>
        <dd>
            <FieldValueEditor type={2} value={editValue3}
                              fieldDef={fieldDefWithRequired} indicateRequired={true}/>
        </dd>

        <dt>Numeric Field Editor with a value and an error:</dt>
        <dd>
            <FieldValueEditor type={2} value={editValue3} isInvalid={editValue2Invalid} invalidMessage="Sample invalid message"/>
        </dd>

        <dt>Numeric Field Editor with Numeric Field type with currency symbol (no placeholder or value): </dt>
        <dd>
            <FieldValueEditor type={2} fieldDef={fieldDefWithCurrencySymbol} />
        </dd>

    </div>
);
ReactDOM.render(basicFieldValueEditor, mountNode);
