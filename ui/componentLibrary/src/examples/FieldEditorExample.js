
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

const basicFieldEditor = (
    <div>
        <dt>Field Editor (default text):</dt>
        <dd>
            <FieldEditor/>
        </dd>

        <dt>Empty Text Field Editor:</dt>
            <dd>
              <FieldEditor type={1}/>
            </dd>

        <dt>Empty Text Field Editor with placeholder text:</dt>
            <dd>
                <FieldEditor type={1} fieldDef={fieldDefWithPlaceholder} />
            </dd>


        <dt>Text Field Editor with a value:</dt>
            <dd>
                <FieldEditor type={1} value={editValue1} />
            </dd>

        <dt>Text Field Editor field is required and show required indicator:</dt>
            <dd>
                <FieldEditor type={1} value={editValue1}
                             fieldDef={fieldDefWithRequired} indicateRequired={true}/>
            </dd>


        <dt>Text Field Editor with a value and an error:</dt>
            <dd>
                <FieldEditor type={1}   value={editValue2}
                             isInvalid={editValue2Invalid} invalidMessage="Use up to 15 characters"/>
            </dd>

`   

        <dt>Empty Numeric Field Editor:</dt>
            <dd>
                <FieldEditor type={2}/>
            </dd>

        <dt>Numeric Field Editor with a value:</dt>
            <dd>
                <FieldEditor type={2} value={editValue3} />
            </dd>

    </div>
);
ReactDOM.render(basicFieldEditor, mountNode);
