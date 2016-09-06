let editValue1 = 'QuickBase';
let editValue2 = 'Lorem ipsum dolor sit amet';
let editValue2Invalid = true;

const basicMultiLineTextFieldValueEditor = (
    <div>
        <dt>Empty Text Field Editor:</dt>
        <dd>
            <TextFieldValueEditor />
        </dd>


        <dt>Empty Text Field Editor with placeholder text:</dt>
        <dd>
            <TextFieldValueEditor placeholder="test@example.com" />
        </dd>


        <dt>Text Field Editor with a value:</dt>
        <dd>
            <TextFieldValueEditor value={editValue1} />
        </dd>


        <dt>Text Field Editor with a value and an error:</dt>
        <dd>
            <TextFieldValueEditor isInvalid={editValue2Invalid} invalidMessage="Use up to 15 characters" value={editValue2} />
        </dd>


    </div>
);
ReactDOM.render(basicMultiLineTextFieldValueEditor, mountNode);
