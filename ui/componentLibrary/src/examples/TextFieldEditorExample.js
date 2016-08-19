
let editValue1 = 'QuickBase';
let editValue2 = 'Lorem ipsum dolor sit amet';
let editValue2Invalid = true;

const basicTextFieldEditor = (
    <div>
        <dt>Plain Text Field Editor:</dt>
            <dd>
              <TextFieldEditor />
            </dd>


        <dt>Empty Text Field Editor with placeholder text:</dt>
            <dd>
                <TextFieldEditor placeholder="test@example.com" />
            </dd>


        <dt>Text Field Editor with a value:</dt>
            <dd>
                <TextFieldEditor value={editValue1} />
            </dd>


        <dt>Text Field Editor with an error:</dt>
            <dd>
                <TextFieldEditor isInvalid={editValue2Invalid} invalidMessage="Use up to 15 characters" value={editValue2} />
            </dd>


    </div>
);
ReactDOM.render(basicTextFieldEditor, mountNode);
